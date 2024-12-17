import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Button,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { getDatabase, ref, update, remove, onValue } from "firebase/database";
import globalStyles from "../styles/globalStyles";
import { getAuth } from "firebase/auth";

/* ========================= EDITBOOK FUNCTION ========================= */
//function that allows the user to edit the details of a book
export default function EditBookDetails({ navigation, route }) {
  // State for the book details
  const [book, setBook] = useState(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Get the book from the route params
  useEffect(() => {
    setBook(route.params.book);

    // Navigate back to the Profile screen
    navigation.setOptions({
      headerLeft: () => (
        <Button title="Back" onPress={() => navigation.navigate("Profile")} />
      ),
    });

    // Cleanup
    return () => {
      setBook({});
    };
  }, [navigation, route.params.book]);

  // Function to handle saving changes
  const handleSaveChanges = () => {
    if (!book || !book.id) {
      return Alert.alert("Error", "Book data is missing.");
    }
    if (!currentUser) {
      return Alert.alert("Error", "User is not authenticated.");
    }
  
    // Get a reference to the database
    const db = getDatabase();
    const bookRef = ref(db, `Books/${book.id}`);
    const followRef = ref(db, `users/${currentUser.uid}/followedBooks/${book.id}`);
  
    // Update the book details
    update(bookRef, book)
      .then(() => {
        // Update only the price for followed books
        if (book.status !== "sold") {
          update(followRef, { price: book.price })
            .then(() => {
              Alert.alert("Success", "Book details updated successfully!");
              navigation.goBack();
            })
            .catch((error) => {
              console.error("Error updating followed book:", error);
              Alert.alert("Error", "Failed to update followed book price.");
            });
        } else {
          Alert.alert("Success", "Book details updated successfully!");
          navigation.goBack();
        }
      })
      .catch((error) => {
        console.error("Error updating book:", error);
        Alert.alert("Error", "Failed to update the book.");
      });
  };
  
/* ========================= HANDLE DELETNG BOOK FUNCTION =========================*/
// Function to handle deleting the book
const handleDeleteBook = () => {
  if (!book || !book.id) {
    return Alert.alert("Error", "Book data is missing.");
  }

  const db = getDatabase();
  const bookRef = ref(db, `Books/${book.id}`);
  const followRef = ref(db, `users/${currentUser.uid}/followedBooks`);

  // Remove the book from the "Books" collection
  remove(bookRef)
    .then(() => {
      // After the book is deleted from "Books", check followedBooks
      onValue(followRef, (snapshot) => {
        const followedBooks = snapshot.val() || {};
        const bookKey = Object.keys(followedBooks).find(
          (key) => followedBooks[key].bookId === book.id
        );
        if (bookKey) {
          // Remove the book from followedBooks
          remove(ref(db, `users/${currentUser.uid}/followedBooks/${bookKey}`))
            .then(() => {
              Alert.alert("Success", "Book deleted from both your collection and followed books.");
              navigation.goBack(); // Optionally navigate back after deletion
            })
            .catch((error) => {
              console.error("Error removing from followedBooks:", error);
              Alert.alert("Error", "Failed to remove book from followed books.");
            });
        } else {
          Alert.alert("Success", "Book deleted successfully!");
          navigation.goBack(); // Navigate back if no book was followed
        }
      });
    })
    .catch((error) => {
      console.error("Error deleting book:", error);
      Alert.alert("Error", "Failed to delete the book.");
    });
};


  // Function to handle marking the book as sold or setting it to active
  const handleToggleStatus = () => {
    if (!book || !book.id) {
      return Alert.alert("Error", "Book data is missing.");
    }

    const db = getDatabase();
    const bookRef = ref(db, `Books/${book.id}`);
    const newStatus = book.status === "sold" ? "active" : "sold";

    // Update status to "sold" or "active"
    update(bookRef, { status: newStatus })
      .then(() => {
        Alert.alert("Success", `Book marked as ${newStatus}.`);
        setBook({ ...book, status: newStatus });
      })
      .catch((error) => {
        console.error("Error updating book:", error);
        Alert.alert("Error", `Failed to mark the book as ${newStatus}.`);
      });
  };

  if (!book) {
    return <Text>No data</Text>;
  }

  

  /* ========================= RETURN ========================= */

  return (
    <ScrollView style={globalStyles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={globalStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.backButtonText}>Tilbage</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {book.imageBase64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${book.imageBase64}` }}
            style={styles.bookImage}
          />
        )}
        {/* Editable input fields for book details */}
        {["title", "author", "year", "subject", "price"].map((field, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </Text>
            <TextInput
              style={styles.input}
              value={book[field]}
              onChangeText={(text) => setBook({ ...book, [field]: text })}
            />
          </View>
        ))}

        {/* Non-editable status field */}
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{book.status}</Text>
        </View>

        {/* Button to boost listing */}
        <View style={styles.row}>
       <TouchableOpacity
        style={globalStyles.BoostButton}
         onPress={() =>
         Alert.alert(
        "Boost Opslag",
        "Betal 10 kr. for at booste dit opslag",
        [{ text: "OK" }]
         )
         }
         >
        <Text style={globalStyles.addButtonText}>Boost Opslag</Text>
         </TouchableOpacity>
        </View>
        
        {/* Button to save changes */}
        <View style={styles.row}>
          <TouchableOpacity
            style={globalStyles.addButton}
            onPress={handleSaveChanges}
          >
            <Text style={globalStyles.addButtonText}>Gem ændringer</Text>
          </TouchableOpacity>
        </View>

        {/* Button to toggle the status */}
        <View style={styles.row}>
          <TouchableOpacity
            style={globalStyles.addButton}
            onPress={handleToggleStatus}
          >
            <Text style={globalStyles.addButtonText}>
              {book.status === "sold" ? "Sælg igen" : "Bog solgt"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Button to delete the book */}
        <View style={styles.row}>
          <TouchableOpacity
            style={globalStyles.addButton}
            onPress={handleDeleteBook}
          >
            <Text style={globalStyles.addButtonText}>Slet bog</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

/* ========================= STYLES ========================= */
const styles = StyleSheet.create({
  container: { //container to image
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
    flex: 1,
  },
  input: {
    flex: 2,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
    backgroundColor: "#f5f5f5",
  },
  value: {
    flex: 2,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  bookImage: {
    width: "100%",
    height: 300,
    marginTop: 10,
    borderRadius: 15,
    resizeMode: "cover",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
