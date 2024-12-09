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
import * as FileSystem from "expo-file-system";
import globalStyles from "../styles/globalStyles";

/* ========================= ADDBOOK-function ========================= */
//Exporting the AddBook function that will be used in App.js
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
    location: "",
  };

  const [NewBook, setNewBook] = useState(initialState);
  const [imageUri, setImageUri] = useState(null);

  // Function to convert image to base64
  const convertToBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const changeTextInput = (name, event) => {
    setNewBook({ ...NewBook, [name]: event });
  };

  /* ========================= HANDLE SAVE FUNCTION ========================= */
  // Function to save the new book to Firebase
  const handleSave = async () => {
    const { title, author, year, subject, price, location } = NewBook;

    if (
      title.length === 0 ||
      author.length === 0 ||
      year.length === 0 ||
      subject.length === 0 ||
      price.length === 0 ||
      location.length === 0
    ) {
      return Alert.alert("Error", "All fields must be filled.");
    }

    const currentUser = auth.currentUser;
    const sellerId = currentUser ? currentUser.uid : null;
    const sellerEmail = currentUser ? currentUser.email : null;

    if (!sellerId) {
      return Alert.alert("Error", "No user is logged in.");
    }

    // Convert image to base64
    let base64Image = null;
    if (imageUri) {
      base64Image = await convertToBase64(imageUri);
    }

    // Book data to be saved in the database
    const bookData = {
      ...NewBook,
      sellerId,
      sellerEmail,
      status: "active", // Default status for new books
      imageBase64: base64Image || null,
    };

    // Reference to Books and Users in the database
    const booksRef = ref(db, "Books/");
    const userRef = ref(db, `Users/${sellerId}`);

    try {
      // Save book data
      await push(booksRef, bookData);

      // Fetch current user's points once and update them
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      const currentPoints = userData?.points || 0;
      const newPoints = currentPoints + 20;

      // Update points in the database
      await update(userRef, { points: newPoints });

      Alert.alert("Success", "Book was added successfully!");
      setNewBook(initialState);
      navigation.navigate("Profile");
    } catch (error) {
      console.error(`Error: ${error.message}`);
      Alert.alert("Error", "An error occurred while adding the book.");
    }
  };

  /* ========================= OPENCAMERA FUNCTION ========================= */
  // Function to open camera to take a picture of the book
  const openCamera = async () => {
    // Request permission to access the camera on the user's current device
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Adgang til kameraet er påkrævet!");
      return;
    }

    // Launch the camera and take a picture
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  /* ========================= OPENIMAGELIBRARY FUNCTION ========================= */
  // Function to open image library and select a picture of the book
  const openImageLibrary = async () => {
    // Request permission to access the image library on the user's current device
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Adgang til billedbiblioteket er påkrævet!");
      return;
    }

    // Launch the image library and select a picture
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  /* ========================= RETURN ========================= */
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        {/* Back Button */}
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.backButtonText}>Tilbage</Text>

        {/* Add Book Form */}
        </TouchableOpacity>
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

        {/* Buttons and actions to add a picture*/}
        <View style={styles.imageContainer}>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}
          <TouchableOpacity
            onPress={openCamera}
            style={globalStyles.mainButton}
          >
            <Text style={globalStyles.mainButtonText}>Scan din bog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openCamera}
            style={globalStyles.mainButton}
          >
            <Text style={globalStyles.mainButtonText}>Åben kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openImageLibrary}
            style={globalStyles.mainButton}
          >
            <Text style={globalStyles.mainButtonText}>Åben album</Text>
          </TouchableOpacity>
        </View>

        {/* Save and Cancel Buttons */}
        <TouchableOpacity onPress={handleSave} style={globalStyles.addButton}>
          <Text style={globalStyles.addButtonText}>Tilføj bog</Text>
        </TouchableOpacity>
        <Button
          title={"Annuller"}
          color={"#db8d16"}
          onPress={() => {
            navigation.navigate("Profile");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ========================= STYLES ========================= */

const styles = StyleSheet.create({
  row: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold", // Optional: Makes the label bolder
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 10, // Afstand under inputfeltet
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
});
