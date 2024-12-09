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
  StyleSheet,
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

  // Checks if the user is logged in: Listen for changes in the user state to check if the user is logged in
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

  /* ========================= SEARCH AND FILTER FUNCTION ========================= */
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

    // Filter by university
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
    // Filter by subject
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

  /* ========================= BOOK SELECTION FUNCTION ========================= */
  // Handle the selection of a book to view its details
  const handleSelectBook = (id) => {
    const selectedBook = filteredBooks.find((book) => book.id === id);
    if (selectedBook) {
      navigation.navigate("BookDetails", { book: selectedBook });
    } else {
      console.error("Book with ID " + id + " not found");
    }
  };

  /* ========================= LIKE FUNCTION ========================= */
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
    // Reference to store liked books for the user
    const userLikedBooksRef = ref(db, `LikedBooks/${user.uid}`);
    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        // Toggle the like status
        const liked = !book.liked;
        // Create a copy of likedBy array
        const likedBy = book.likedBy ? [...book.likedBy] : [];

        if (liked) {
          // Add the current user to the likedBy array so it gets in to the database
          likedBy.push(user.uid);

          // Create a new userLikedBooks object excluding undefined values, to post it on profile
          const userLikedBooks = {
            [id]: {
              title: book.title,
              author: book.author,
              ...(book.imageBase64 ? { imageBase64: book.imageBase64 } : {}),
              subject: book.subject,
              year: book.year,
              price: book.price,
            },
          };

          // Store the book in the user's liked books
          update(userLikedBooksRef, userLikedBooks);
        } else {
          const index = likedBy.indexOf(user.uid);
          if (index > -1) likedBy.splice(index, 1);

          // Remove the book from the user's liked books in the database
          const userLikedBooks = { [id]: null };
          update(userLikedBooksRef, userLikedBooks);
        }

        // Update the book data in database
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

  /* ========================= RETURN ========================= */

  return (
    <ScrollView style={globalStyles.container}>
      {/* Display the app title */}
      <Text style={globalStyles.heading}>BookSwap</Text>

      {/* Display a banner */}
      <View style={styles.stepContainer}>
        <Text style={styles.highlightedSubtitleText}>
          Del og opdag brugte bøger
        </Text>
        <Text style={styles.descriptionText}>
          Find din næste yndlingsbog blandt vores udvalg👇
        </Text>
      </View>

      <View style={globalStyles.separator} />

      {/* Display the searchbar */}
      <Text style={globalStyles.title}>Søg blandt udvalg</Text>
      <View style={styles.filterBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Søg efter titel eller forfatter"
          value={search}
          onChangeText={setSearch}
        />

        {/* Display the filter options */}
        <Text style={styles.filterByText}>Filtrér efter:</Text>
        {Object.keys(options).map((field) => (
          <View
            key={field}
            style={[dropdowns[field] && { zIndex: 1000 }, ]}
          >
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => toggleDropdown(field)}
            >
              <Text style={styles.dropdownButtonText}>
                {filters[field] || `Vælg ${field}`}
              </Text>
            </TouchableOpacity>
            {dropdowns[field] && (
              <View style={styles.dropdownList}>
                {options[field].map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dropdownItem,
                      index === options[field].length - 1 &&
                        styles.dropdownItemLast,
                    ]}
                    onPress={() => handleFilterChange(field, option)}
                  >
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Display the reset button */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={handleResetFilters}
        >
          <Text style={styles.mainButtonText}>Nulstil filter</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.separator} />

      {/* Display the books */}
      <Text style={globalStyles.title}>Udforsk bøger her</Text>

      <View style={globalStyles.sectionContainer}>
        <View style={styles.gridContainers}>
          {filteredBooks.map((book) => (
            <View key={book.id} style={globalStyles.box}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${book.imageBase64}` }}
                style={globalStyles.bookImage}/>
              <TouchableOpacity onPress={() => handleSelectBook(book.id)}>
                <Text style={globalStyles.boxText}>{book.title}</Text>
                <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
                <Text style={globalStyles.boxTextSmall}>
                  {book.subject || "No subject"}
                </Text>
              </TouchableOpacity>

              {/* Display the like button */}
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

/* ========================= STYLES ========================= */
const styles = StyleSheet.create({
  filterBox: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff", // White background for filter box
    borderColor: "#8C806F", // Brown border
    borderWidth: 1,
    marginBottom: 20,
  },
  filterByText: {
    fontSize: 16,
    color: "#333", // Dark text for filter text
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#8C806F", // Brown border
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff", // White background
    marginBottom: 15, // Space between elements
    fontSize: 16,
    color: "#333", // Text color
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8C806F", // Brown border
    backgroundColor: "#fff", // White background
    marginBottom: 15, // Space between dropdown buttons
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#156056", // Dark text for dropdowns
    fontWeight: "bold",
  },
  dropdownList: {
    position: "absolute",
    top: 50,
    width: "100%",
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#8C806F", // Brown border
    borderRadius: 10,
    backgroundColor: "#fff", // White background
    zIndex: 1000, // Ensure it overlays other elements
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light gray divider
  },
  dropdownItemLast: {
    borderBottomWidth: 0, // Remove divider for the last item
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333", // Dark text for items
  },
  stepContainer: {
    backgroundColor: "#DB8D16",
    paddingVertical: 90,
    alignItems: "center",
    shadowColor: "#000",
    elevation: 5,
    marginBottom: 20,
    width: "100%",
  },
  highlightedSubtitleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "#000000",
    textShadowRadius: 3,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#FFF5E1",
    textAlign: "center",
  },
  mainButton: {
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: "#156056", // Green background
    paddingVertical: 10,
    paddingHorizontal: 110,
    borderRadius: 10,
  },
  mainButtonText: {
    fontSize: 14,
    color: "#fff", // White text
    fontFamily: "abadi",
    fontWeight: "bold",
  },
  gridContainers: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
})