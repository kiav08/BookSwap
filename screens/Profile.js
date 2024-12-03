import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  handleLogin,
  handleCreateAccount,
  handleLogout,
  subscribeToAuthState,
  fetchUserBooks,
  uploadProfilePicture,
  fetchUserProfile,
  fetchLikedBooks,
} from "../screens/authFunctions";
import globalStyles from "../styles/globalStyles";
import {useNavigation} from "@react-navigation/native";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [likedBooks, setLikedBooks] = useState([]); // State for liked books
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [books, setBooks] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    const unsubscribe = subscribeToAuthState(setUser, (userId) => {
      fetchUserBooks(userId, setBooks); // Fetch user's books
      fetchLikedBooks(userId, setLikedBooks); // Fetch liked books
      fetchUserProfile(userId, setUserProfile); // Fetch user profile
    });
    return () => unsubscribe();
  }, []);

      // Navigate to AddBook screen
      const handleAddBook = () => {
        navigation.navigate("AddBook");
      };

  const handleUploadPicture = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Tilladelse påkrævet",
        "Tilladelse til galleri er nødvendig."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images, // Correct API usage
        allowsEditing: true,
        aspect: [1, 1], // Square crop
        quality: 0.5,
      });

      if (result.canceled) {
        Alert.alert("Handling annulleret", "Ingen billede blev valgt.");
        return;
      }

      const imageUri = result.assets[0].uri; // Correct URI format
      const downloadURL = await uploadProfilePicture(user.uid, imageUri);
      Alert.alert("Success", "Profilbillede opdateret!");
      setUserProfile((prev) => ({ ...prev, profilePicture: downloadURL }));
    } catch (error) {
      console.error("Fejl under upload:", error);
      Alert.alert("Fejl", "Kunne ikke uploade profilbillede.");
    }
  };

  if (!user) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.text}>Login</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={loginEmail}
          onChangeText={setLoginEmail}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          value={loginPassword}
          onChangeText={setLoginPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={globalStyles.loginButton}
          onPress={() => handleLogin(loginEmail, loginPassword, setUser)}
        >
          <Text style={globalStyles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={globalStyles.text}>Create Account</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={createEmail}
          onChangeText={setCreateEmail}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          value={createPassword}
          onChangeText={setCreatePassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={globalStyles.createAccountButton}
          onPress={() => handleCreateAccount(createEmail, createPassword)}
        >
          <Text style={globalStyles.createAccountButtonText}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.heading}>Velkommen, {user.email}</Text>

      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          source={
            userProfile?.profilePicture
              ? { uri: userProfile.profilePicture }
              : require("../assets/default-profile.png")
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 10,
          }}
        />
        <TouchableOpacity
          onPress={handleUploadPicture}
          style={globalStyles.loginButton}
        >
          <Text style={globalStyles.loginButtonText}>Upload Profilbillede</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.separator} />

        {/* Add Book Button */}
        <TouchableOpacity style={globalStyles.addButton} onPress={handleAddBook}>
          <Text style={globalStyles.addButtonText}>Opret ny annonce</Text>
        </TouchableOpacity>

        <View style={globalStyles.sectionContainer}>
      <Text style={globalStyles.heading}>Dine bøger:</Text>
      <View style={globalStyles.gridContainer}>
        {books.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={globalStyles.box}
            onPress={() => console.log("Book selected:", book)}
            >
            <Image
            source={{ uri: book.imageUri  }} // Adjust this to match your Firebase image key
            style={globalStyles.bookImage}
            />  
            
            <Text style={globalStyles.boxText}>{book.title}</Text>
            <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
            <Text style={globalStyles.boxTextSmall}>({book.year})</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={globalStyles.heading}>Dine likede bøger:</Text>
      {/* <View style={globalStyles.gridContainer}>
        {likedBooks.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={globalStyles.box}
            onPress={() => console.log("Book selected:", book)}
          >
            <Text style={globalStyles.boxText}>{book.title}</Text>
            <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
            <Text style={globalStyles.boxTextSmall}>({book.year})</Text>
          </TouchableOpacity>
        ))} */}
                </View>

      <TouchableOpacity
        style={globalStyles.logoutButton}
        onPress={() => handleLogout(setUser)}
      >
        <Text style={globalStyles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      </ScrollView>
  );
}
