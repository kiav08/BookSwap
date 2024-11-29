import * as React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  Alert,
  View,
  Text,
} from "react-native";
import { getDatabase, ref, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../FirebaseConfig"; // Import auth to get current user

export default function AddBook() {
  const db = getDatabase();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button title="Back" onPress={() => navigation.navigate("Profile")} />
      ),
    });
  }, [navigation]);

  // Initial state for book details
  const initialState = {
    title: "",
    author: "",
    year: "",
    subject: "",
    price: "",
  };

  const [NewBook, setNewBook] = useState(initialState);

  const changeTextInput = (name, event) => {
    setNewBook({ ...NewBook, [name]: event });
  };

  // Function to save the new book to Firebase
  const handleSave = async () => {
    const { title, author, year, subject, price } = NewBook;

    if (
      title.length === 0 ||
      author.length === 0 ||
      year.length === 0 ||
      subject.length === 0 ||
      price.length === 0
    ) {
      return Alert.alert("Error", "All fields must be filled.");
    }

    const currentUser = auth.currentUser;
    const sellerId = currentUser ? currentUser.uid : null;
    const sellerEmail = currentUser ? currentUser.email : null;

    if (!sellerId) {
      return Alert.alert("Error", "No user is logged in.");
    }

    const bookData = {
      ...NewBook,
      sellerId,
      sellerEmail,
      status: "active", // Default status
    };

    const booksRef = ref(db, "Books/");
    await push(booksRef, bookData)
      .then(() => {
        Alert.alert("Success", "Book was added successfully!");
        setNewBook(initialState); // Reset form
        navigation.navigate("Profile");
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(initialState).map((key, index) => {
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.label}>{key}</Text>
              <TextInput
                value={NewBook[key]}
                onChangeText={(event) => changeTextInput(key, event)}
                style={styles.input}
                placeholder={`Enter ${key}`}
              />
            </View>
          );
        })}
        <Button title={"Add book"} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
  },
});
