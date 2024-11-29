import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import app from "../FirebaseConfig"
import { getDatabase, ref, onValue } from "firebase/database";
import globalStyles from "../styles/globalStyles";

export default function App({ navigation }) {
  const [books, setBooks] = useState(null); // State for books
  const [filteredBooks, setFilteredBooks] = useState(null); // State for filtered books
  const [search, setSearch] = useState(""); // State for search query

  useEffect(() => {
    // Get a reference to the database
    const db = getDatabase();
    const booksRef = ref(db, "Books");

    // Fetch books data from Firebase
    const unsubscribe = onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const booksList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setBooks(booksList);
          setFilteredBooks(booksList); // Initialize filteredBooks with the full book list
        } else {
          setBooks([]);
          setFilteredBooks([]);
        }
      },
      (error) => {
        console.error("Error fetching data: ", error);
      }
    );

    return () => unsubscribe(); // Cleanup function
  }, []);

  // Handle search input and filter the book list
  const handleSearch = (text) => {
    setSearch(text);

    // Filter books based on the search query (by title or author)
    if (books) {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(text.toLowerCase()) ||
          book.author.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  };

  // Function to handle selecting a book
  const handleSelectBook = (id) => {
    const selectedBook = filteredBooks.find((book) => book.id === id);
    if (selectedBook) {
      navigation.navigate("BookDetails", { book: selectedBook }); // Navigate to BookDetails screen with selected book
    } else {
      console.error("Book with ID " + id + " not found");
    }
  };

  if (!filteredBooks) {
    return <Text>Loading books...</Text>;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>BookSwap</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Søg efter titel eller forfatter"
        value={search}
        onChangeText={handleSearch} // Filter the list as user types
        // backgroundcolor of the input field
        backgroundColor="white"
      />

      {/* Grid of books */}
      <View style={styles.gridContainer}>
        {filteredBooks.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={styles.box}
            onPress={() => handleSelectBook(book.id)} // Navigate to BookDetails
          >
            <Text style={styles.boxText}>{book.title}</Text>
            <Text style={styles.boxTextSmall}>{book.author}</Text>
            <Text style={styles.boxTextSmall}>({book.year})</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Ensures items wrap to the next row
    justifyContent: "space-between", // Spreads columns evenly
    marginTop: 20,
  },
  box: {
    width: "48%", // Each box takes up nearly half of the row (adjusted for spacing)
    aspectRatio: 1, // Makes the box square
    backgroundColor: "#DB8D16",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10, // Adds spacing between rows
    borderRadius: 5, // Optional: Rounded corners for boxes
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
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
});