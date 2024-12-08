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
  Image,
} from "react-native";
import {
  getDatabase,
  ref,
  push,
  onValue,
  get,
  update,
} from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../FirebaseConfig"; // Import auth to get current user
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

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
  const [imageUri, setImageUri] = useState(null);

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = reject;
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send();
    });

    const storage = getStorage();
    const imageRef = storageRef(
      storage,
      "bookImages/" + new Date().toISOString()
    );
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    blob.close();
    return downloadURL;
  };

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
      imageUri: imageUri || null, // Include image URI if available
    };

    const booksRef = ref(db, "Books/");
    const userRef = ref(db, `Users/${sellerId}`);

    try {
      // Save book data
      await push(booksRef, bookData);

      // Fetch current points once and update them
      const snapshot = await get(userRef); // Fetch user data
      const userData = snapshot.val();
      const currentPoints = userData?.points || 0;
      const newPoints = currentPoints + 20;

      // Update points in the database
      await update(userRef, { points: newPoints });

      Alert.alert("Success", "Book was added successfully!");
      setNewBook(initialState); // Reset form
      navigation.navigate("Profile");
    } catch (error) {
      console.error(`Error: ${error.message}`);
      Alert.alert("Error", "An error occurred while adding the book.");
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Adgang til kameraet er påkrævet!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Adgang til billedbiblioteket er påkrævet!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
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
        <View style={styles.imageContainer}>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
          <TouchableOpacity onPress={openCamera} style={styles.button}>
            <Text style={styles.buttonText}>Åben Kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openImageLibrary} style={styles.button}>
            <Text style={styles.buttonText}>Åben Album</Text>
          </TouchableOpacity>
        </View>
        <Button
          title={"Add book"}
          onPress={() => {
            handleSave();
          }}
        />
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
  imageContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50", // Green background
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
