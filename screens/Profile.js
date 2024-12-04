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
import {
  handleLogin,
  handleCreateAccount,
  handleLogout,
  subscribeToAuthState,
  fetchUserBooks,
  fetchUserProfile,
  fetchLikedBooks,
} from "../screens/authFunctions";
import { getDatabase, ref, update, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import globalStyles from "../styles/globalStyles";
import {useNavigation} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [likedBooks, setLikedBooks] = useState([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [books, setBooks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(setUser, (userId) => {
      fetchUserBooks(userId, setBooks);
      fetchLikedBooks(userId, setLikedBooks);
      fetchUserProfile(userId, setUserProfile);
    });
    return () => unsubscribe();
  }, []);

  const handleAddBook = () => {
    navigation.navigate("AddBook");
  };


  //Funktionen for profilbillede som bliver gemt i AsyncStorage
  const handleUploadPicture = async () => {
    Alert.alert(
      "Vælg kilde",
      "Hvor vil du uploade dit billede fra?",
      [
        {
          text: "Kamera",
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
            if (!permissionResult.granted) {
              Alert.alert("Tilladelse påkrævet", "Tilladelse til kamera er nødvendig.");
              return;
            }
            try {
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
              });
              if (result.canceled) {
                Alert.alert("Handling annulleret", "Ingen billede blev taget.");
                return;
              }
              const imageUri = result.assets[0].uri;
              // Billedet bliver gemt i Async
              await AsyncStorage.setItem("profilePicture", imageUri);
              Alert.alert("Success", "Profilbillede opdateret!");
              setUserProfile((prev) => ({
                ...prev,
                profilePicture: imageUri,
              }));
            } catch (error) {
              console.error("Fejl under upload:", error);
              Alert.alert("Fejl", "Kunne ikke opdatere profilbillede.");
            }
          },
        },
        {
          text: "Galleri",
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
            if (!permissionResult.granted) {
              Alert.alert("Tilladelse påkrævet", "Tilladelse til galleri er nødvendig.");
              return;
            }
  
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
              });
  
              if (result.canceled) {
                Alert.alert("Handling annulleret", "Ingen billede blev valgt.");
                return;
              }
  
              const imageUri = result.assets[0].uri;
              // Directly store the image URI in AsyncStorage
              await AsyncStorage.setItem("profilePicture", imageUri);
  
              Alert.alert("Success", "Profilbillede opdateret!");
              setUserProfile((prev) => ({
                ...prev,
                profilePicture: imageUri,
              }));
            } catch (error) {
              console.error("Fejl under upload:", error);
              Alert.alert("Fejl", "Kunne ikke opdatere profilbillede.");
            }
          },
        },
        { text: "Annuller", style: "cancel" },
      ],
      { cancelable: true }
    );
  };
  
  //Gemte bøger bliver gemt i AsynStorage for at det kan blive vist på profilsiden, eftersom de bliver gemt i Databasen fra Homepage.js
  useEffect(() => {
    const loadSavedBooks = async () => {
      try {
        // Hent gemte bøger fra AsyncStorage
        const savedBooksData = await AsyncStorage.getItem("savedBooks");
        if (savedBooksData) {
          setLikedBooks(JSON.parse(savedBooksData)); // Opdater likedBooks state
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af gemte bøger:", error);
      }
    };
    loadSavedBooks();
  }, [user]); // Opdateres hver gang brugeren ændres
  
      // Load profile picture from AsyncStorage after login
      const loadProfilePicture = async () => {
        const storedProfilePicture = await AsyncStorage.getItem("profilePicture");
        if (storedProfilePicture) {
          setUserProfile((prev) => ({
            ...prev,
            profilePicture: storedProfilePicture,
          }));
        }
      };
  
      loadProfilePicture();  

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

      <View style={globalStyles.separator} />

      <View style={globalStyles.sectionContainer}>
        <Text style={globalStyles.heading}>Dine annoncer</Text>
        <View style={globalStyles.gridContainer}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={globalStyles.box}
              onPress={() => navigation.navigate("EditBook", { book })}
            >
              <Image
                source={{ uri: book.imageUri }}
                style={globalStyles.bookImage}
              />
              <Text style={globalStyles.boxText}>{book.title}</Text>
              <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
              <Text style={globalStyles.boxTextSmall}>({book.year})</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={globalStyles.separator} />

      <View style={globalStyles.sectionContainer}>
  <Text style={globalStyles.heading}>Dine gemte bøger</Text>
  <View style={globalStyles.gridContainer}>
    {likedBooks.map((book) => (
      <TouchableOpacity
        key={book.id}
        style={globalStyles.box}
        onPress={() => navigation.navigate("EditBook", { book })}>
        <Image source={{ uri: book.imageUri }} style={globalStyles.bookImage} />
        <Text style={globalStyles.boxText}>{book.title}</Text>
        <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
        <Text style={globalStyles.boxTextSmall}>({book.year})</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>


<View style={globalStyles.separator} />


<View style={globalStyles.sectionContainer}>
  <Text style={globalStyles.heading}>Bøger du følger</Text>
  <View style={globalStyles.gridContainer}>
  </View>
</View>


      <TouchableOpacity
        style={globalStyles.logoutButton}
        onPress={() => handleLogout(setUser)}>
        <Text style={globalStyles.logoutButtonText}>Log ud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
