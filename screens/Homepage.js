import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { FontAwesome } from "@expo/vector-icons";
import globalStyles from "../styles/globalStyles";

export default function App({ navigation }) {
  const [books, setBooks] = useState([]); // State for books
  const [filteredBooks, setFilteredBooks] = useState([]); // State for filtered books
  const [search, setSearch] = useState(""); // State for search query
  const [dropdowns, setDropdowns] = useState({
    university: false,
    programme: false,
    semester: false,
    subject: false,
  });

  const [filters, setFilters] = useState({
    university: "",
    programme: "",
    semester: "",
    subject: "",
  });

  const options = {
    university: ["Copenhagen Business School", "Københavns Universitet"],
    programme: ["HA (it.)", "HA (alm)", "Økonomi", "Psykologi"],
    semester: ["1. semester", "2. semester", "3. semester"],
    subject: ["Finansiering", "Organisationsteori", "BIS"],
  };

  useEffect(() => {
    const db = getDatabase();
    const booksRef = ref(db, "Books");

    const unsubscribe = onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const booksList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
            liked: value.liked || false, // Initialize liked status
          }));
          setBooks(booksList);
          setFilteredBooks(booksList); // Initialize filteredBooks with the full book list
        } else {
          setBooks([]);
          setFilteredBooks([]);
        }
      },
      (error) => console.error("Error fetching data: ", error)
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applySearchAndFilters();
  }, [filters, search]);

  const applySearchAndFilters = () => {
    if (!books.length) return;

    let filtered = books;

    if (search) {
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(search.toLowerCase()) ||
          book.author?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.university) {
      filtered = filtered.filter(
        (book) => book.university === filters.university
      );
    }
    if (filters.programme) {
      filtered = filtered.filter(
        (book) => book.programme === filters.programme
      );
    }
    if (filters.semester) {
      filtered = filtered.filter((book) => book.semester === filters.semester);
    }
    if (filters.subject) {
      filtered = filtered.filter((book) => book.subject === filters.subject);
    }

    setFilteredBooks(filtered);
  };

  const toggleDropdown = (field) => {
    setDropdowns((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [field]: value }));
    setDropdowns((prev) => ({ ...prev, [field]: false }));
  };

  const handleResetFilters = () => {
    setFilters({
      university: "",
      programme: "",
      semester: "",
      subject: "",
    });
    setSearch("");
    setFilteredBooks(books);
  };

  const handleSelectBook = (id) => {
    const selectedBook = filteredBooks.find((book) => book.id === id);
    if (selectedBook) {
      navigation.navigate("BookDetails", { book: selectedBook });
    } else {
      console.error("Book with ID " + id + " not found");
    }
  };

  const toggleLike = (id) => {
    const updatedBooks = books.map((book) =>
      book.id === id ? { ...book, liked: !book.liked } : book
    );
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);

    // Update Firebase
    const db = getDatabase();
    const bookRef = ref(db, `Books/${id}`);
    const likedBook = updatedBooks.find((book) => book.id === id);
    update(bookRef, { liked: likedBook.liked });
  };

  if (books.length === 0) {
    return <Text>Loading books...</Text>;
  }

  if (filteredBooks.length === 0) {
    return <Text>No books match the filters.</Text>;
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.heading}>BookSwap</Text>

      <View style={styles.stepContainer}>
        <Text style={styles.highlightedSubtitleText}>
          Del og opdag brugte bøger
        </Text>
        <Text style={styles.descriptionText}>
          Find din næste yndlingsbog blandt vores udvalg👇
        </Text>
      </View>

    <View style={styles.separator} />
    <Text style={styles.title}>Søg blandt udvalg</Text>
      <View style={globalStyles.filterBox}>
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Search by title or author"
          value={search}
          onChangeText={setSearch}
        />
        <Text style={globalStyles.filterByText}>Filter by:</Text>

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
                {filters[field] || `Select ${field}`}
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
          style={globalStyles.resetButton}
          onPress={handleResetFilters}
        >
          <Text style={globalStyles.resetButtonText}>Reset Filters</Text>
        </TouchableOpacity>
      </View>

          {/* Separator */}
    <View style={styles.separator} />

    <Text style={styles.title}>Udforsk bøger her</Text>
      <View style={styles.gridContainer}>
        {filteredBooks.map((book) => (
          <View key={book.id} style={styles.box}>
            <TouchableOpacity onPress={() => handleSelectBook(book.id)}>
              <Text style={styles.boxText}>{book.title}</Text>
              <Text style={styles.boxTextSmall}>{book.author}</Text>
              <Text style={styles.boxTextSmall}>
                {book.subject || "No subject"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome
                name={book.liked ? "heart" : "heart-o"}
                size={24}
                color="#FF0000"
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    backgroundColor: "#D08D16",
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
    marginHorizontal: 15,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  box: {
    width: "48%",
    aspectRatio: 1.2,
    backgroundColor: "#D08D16",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
  boxText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  boxTextSmall: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
    width: "100%",
    alignSelf: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
});
