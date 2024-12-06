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
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../styles/globalStyles";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [likedBooks, setLikedBooks] = useState([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [books, setBooks] = useState([]);
  const [points, setPoints] = useState(0); // Points state
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(setUser, (userId) => {
      fetchUserBooks(userId, setBooks);
      fetchLikedBooks(userId, setLikedBooks);
      fetchUserProfile(userId, setUserProfile);
      loadUserPoints(); // Load points from AsyncStorage
    });
    return () => unsubscribe();
  }, []);

  const handleAddBook = () => {
    navigation.navigate("AddBook");
    handleAddPoint(); // Add point when a new book is added
  };

  const loadUserPoints = async () => {
    try {
      const storedPoints = await AsyncStorage.getItem("userPoints");
      if (storedPoints) {
        setPoints(parseInt(storedPoints, 10)); // Parse to integer
      }
    } catch (error) {
      console.error("Error loading points:", error);
    }
  };

  const updateUserPoints = async (newPoints) => {
    try {
      setPoints(newPoints);
      await AsyncStorage.setItem("userPoints", newPoints.toString());
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };

  const handleAddPoint = () => {
    const newPoints = points + 1; // Increment points
    updateUserPoints(newPoints);
  };

  // Function for profile image upload
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
              // Billedet bliver gemt i AsyncStorage
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
          <Text style={globalStyles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
          {/* Profile picture and points */}
          <View>
            <Image
              source={
                userProfile?.profilePicture
                  ? { uri: userProfile.profilePicture }
                  : require("../assets/default-profile.png")
              }
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                marginRight: 10,
                borderWidth: 3,
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>
              Velkommen
            </Text>
            <Text style={{ fontSize: 18, color: "#757575" }}>{user.email}</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 10,
                backgroundColor: "#DB8D16",
                borderRadius: 20,
                paddingVertical: 5,
                paddingHorizontal: 25,
                color: "#FFF",
              }}
            >
              {points} point
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleUploadPicture}
          style={{
            backgroundColor: "#156056", // Green button for upload
            paddingVertical: 10,
            paddingHorizontal: 40,
            borderRadius: 25,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 16 }}>Upload Profilbillede</Text>
        </TouchableOpacity>
      </View>

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
        <Text style={globalStyles.heading}>Bøger du følger</Text>
        <View style={globalStyles.gridContainer}></View>
      </View>

      <TouchableOpacity
        style={globalStyles.logoutButton}
        onPress={() => handleLogout(setUser)}
      >
        <Text style={globalStyles.logoutButtonText}>Log ud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
