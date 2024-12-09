// import all the necessary libraries
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Button,
  Image,
} from "react-native";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { FontAwesome } from "@expo/vector-icons";
import globalStyles from "../styles/globalStyles";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import programmeData from "../data/programmes.json";

export default function Homepage({ navigation }) {
  // Declare the necessary state variables
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdowns, setDropdowns] = useState({
    university: false,
    programme: false,
    subject: false,
  });
  const [filters, setFilters] = useState({
    university: "",
    programme: "",
    subject: "",
  });
  const [user, setUser] = useState(null);

  // CHECKS if the user is logged in: Listen for changes in the user state to check if the user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Define the options for the dropdowns
  const options = {
    university: ["Copenhagen Business School"],
    programme: Object.keys(programmeData.programmes), // Use the keys of the programme data as options
    subject: [
      "Finansiering",
      "Indføring i organisationers opbygning og funktion",
      "Introduction to information systems",
      "Innovation og ny teknologi",
    ],
  };

  // Fetch the books from the database and listen for updates
  useEffect(() => {
    const db = getDatabase();
    const booksRef = ref(db, "Books");

    // Listen for book updates in the database
    const listenToBookUpdates = onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const booksList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
            liked: value.liked || false,
          }));
          setBooks(booksList);
          setFilteredBooks(booksList);
        } else {
          setBooks([]);
          setFilteredBooks([]);
        }
      },
      (error) => console.error("Error fetching data: ", error)
    );

    // Cleanup the listener when the component unmounts to prevent memory leaks
    return () => listenToBookUpdates();
  }, []);

  // SEARCH AND FILTER FUNCTION:
  //Apply the search and filters whenever the search or filters change
  useEffect(() => {
    applySearchAndFilters();
  }, [filters, search]);

  // Apply search and filters to the book list
  const applySearchAndFilters = () => {
    if (!books.length) return;

    let filtered = books;

    if (search) {
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(search.toLowerCase()) ||
          book.author?.toLowerCase().includes(search.toLowerCase()) ||
          book.subject?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by university -- this is a mock filter
    if (filters.university) {
      filtered = filtered.filter(
        (book) => book.university === filters.university
      );
    }

    // Filter by programme
    if (filters.programme) {
      const programmeBooks = programmeData.programmes[filters.programme] || [];
      filtered = filtered.filter((book) =>
        programmeBooks.some((pBook) => {
          return (
            pBook.title.toLowerCase() === book.title?.toLowerCase() || // Match by title
            (pBook.author &&
              pBook.author.toLowerCase() === book.author?.toLowerCase()) // Match by author
          );
        })
      );
    }

    if (filters.subject) {
      filtered = filtered.filter((book) => book.subject === filters.subject);
    }

    setFilteredBooks(filtered);
  };

  // Toggle the dropdown menu visibility
  const toggleDropdown = (field) => {
    setDropdowns((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle changes to filters
  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    setDropdowns((prev) => ({ ...prev, [field]: false }));
  };

  // Reset all filters and search
  const handleResetFilters = () => {
    setFilters({
      university: "",
      programme: "",
      subject: "",
    });
    setSearch("");
    setFilteredBooks(books);
  };

  // Handle the selection of a book to view its details
  const handleSelectBook = (id) => {
    const selectedBook = filteredBooks.find((book) => book.id === id);
    if (selectedBook) {
      navigation.navigate("BookDetails", { book: selectedBook });
    } else {
      console.error("Book with ID " + id + " not found");
    }
  };

  /* ========= TOGLE LIKE FUNCTION  */
  //the function to toggle the like status of a book, add it to the user's liked books on its profile, and update the book data in Firebase
  const toggleLike = (id) => {
    if (!user) {
      Alert.alert(
        "Login påkrævet",
        "Du skal være logget ind for at like en bog.",
        [
          {
            text: "Gå til login",
            onPress: () => navigation.navigate("Profil", { screen: "Profile" }),
          },
        ]
      );
      return;
    }

    const db = getDatabase();
    const bookRef = ref(db, `Books/${id}`);
    const userLikedBooksRef = ref(db, `LikedBooks/${user.uid}`); // Reference to store liked books for the user
    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        const liked = !book.liked; // Toggle the like status
        const likedBy = book.likedBy ? [...book.likedBy] : []; // Create a copy of likedBy array

        if (liked) {
          likedBy.push(user.uid); // Add the current user to the likedBy array

          // Create a new userLikedBooks object excluding undefined values
          const userLikedBooks = {
            [id]: {
              title: book.title,
              author: book.author,
              ...(book.imageBase64 ? { imageBase64: book.imageBase64 } : {}), // Add imageBase64 only if it's defined
              subject: book.subject,
              year: book.year,
              price: book.price,
            },
          };

          update(userLikedBooksRef, userLikedBooks); // Store the book in the user's liked books
        } else {
          const index = likedBy.indexOf(user.uid);
          if (index > -1) likedBy.splice(index, 1); // Remove the current user from likedBy if unliked

          // Remove the book from the user's liked books
          const userLikedBooks = { [id]: null }; // Null to remove the book from the liked books
          update(userLikedBooksRef, userLikedBooks);
        }

        // Update the book data in Firebase
        update(bookRef, { liked, likedBy });

        // Return a new object instead of modifying the original
        return {
          ...book,
          liked,
          likedBy,
        };
      }
      return book;
    });

    setBooks(updatedBooks); // Update the local state for books
    setFilteredBooks(updatedBooks); // Update the filtered books state
  };

  // Display a loading message if there are no books
  if (books.length === 0) {
    return <Text>Loading books...</Text>;
  }

  // Display a message if no books match the filters
  if (filteredBooks.length === 0) {
    return (
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Text>Ingen bøger matcher din søgning.</Text>
        <Button
          title="Tilbage"
          onPress={() => {
            // Reset your filters here
            setFilters({ title: "", author: "" });
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.heading}>BookSwap</Text>

      <View style={globalStyles.stepContainer}>
        <Text style={globalStyles.highlightedSubtitleText}>
          Del og opdag brugte bøger
        </Text>
        <Text style={globalStyles.descriptionText}>
          Find din næste yndlingsbog blandt vores udvalg👇
        </Text>
      </View>

      <View style={globalStyles.separator} />

      <Text style={globalStyles.title}>Søg blandt udvalg</Text>

      <View style={globalStyles.filterBox}>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Søg efter titel eller forfatter"
          value={search}
          onChangeText={setSearch}
        />
        <Text style={globalStyles.filterByText}>Filtrér efter:</Text>

        {Object.keys(options).map((field) => (
          <View
            key={field}
            style={[
              globalStyles.dropdownContainer,
              dropdowns[field] && { zIndex: 1000 },
            ]}
          >
            <TouchableOpacity
              style={globalStyles.dropdownButton}
              onPress={() => toggleDropdown(field)}
            >
              <Text style={globalStyles.dropdownButtonText}>
                {filters[field] || `Vælg ${field}`}
              </Text>
            </TouchableOpacity>
            {dropdowns[field] && (
              <View style={globalStyles.dropdownList}>
                {options[field].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      globalStyles.dropdownItem,
                      index === options[field].length - 1 &&
                        globalStyles.dropdownItemLast,
                    ]}
                    onPress={() => handleFilterChange(field, option)}
                  >
                    <Text style={globalStyles.dropdownItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={globalStyles.mainButton}
          onPress={handleResetFilters}
        >
          <Text style={globalStyles.mainButtonText}>Nulstil filter</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.separator} />

      <Text style={globalStyles.title}>Udforsk bøger her</Text>

      <View style={globalStyles.sectionContainer}>
        <View style={globalStyles.gridContainers}>
          {filteredBooks.map((book) => (
            <View key={book.id} style={globalStyles.box}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${book.imageBase64}` }}
                style={globalStyles.bookImage}
              />

              <TouchableOpacity onPress={() => handleSelectBook(book.id)}>
                <Text style={globalStyles.boxText}>{book.title}</Text>
                <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
                <Text style={globalStyles.boxTextSmall}>
                  {book.subject || "No subject"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleLike(book.id)}>
                <FontAwesome
                  name={book.liked ? "heart" : "heart-o"}
                  size={24}
                  color={book.liked ? "#FF0000" : "#000"}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
