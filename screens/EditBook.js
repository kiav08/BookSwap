import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { getDatabase, ref, update, remove } from "firebase/database";

export default function EditBookDetails({ navigation, route }) {
  const [book, setBook] = useState(null);

  useEffect(() => {
    setBook(route.params.book);

    // Custom back button to navigate to Profile
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

    // Get a reference to the database
    const db = getDatabase();
    const bookRef = ref(db, `Books/${book.id}`);

    // Update book details
    update(bookRef, book)
      .then(() => {
        Alert.alert("Success", "Book details updated successfully!");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error updating book:", error);
        Alert.alert("Error", "Failed to update the book.");
      });
  };

  // Function to handle deleting the book
  const handleDeleteBook = () => {
    if (!book || !book.id) {
      return Alert.alert("Error", "Book data is missing.");
    }

    const db = getDatabase();
    const bookRef = ref(db, `Books/${book.id}`);

    remove(bookRef)
      .then(() => {
        Alert.alert("Success", "Book deleted successfully!");
        navigation.goBack();
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

  return (
    <View style={styles.container}>
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

      {/* Button to save changes */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* Button to delete the book */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteBook}>
          <Text style={styles.deleteButtonText}>Delete Book</Text>
        </TouchableOpacity>
      </View>

      {/* Button to toggle the status */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.soldButton} onPress={handleToggleStatus}>
          <Text style={styles.soldButtonText}>
            {book.status === "sold" ? "Sælg igen" : "Bog solgt"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  saveButton: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  soldButton: {
    backgroundColor: "green",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  soldButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
