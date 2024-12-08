import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import globalStyles from "../styles/globalStyles";
import { auth } from "../FirebaseConfig"; // Import Firebase auth


export default function Profile() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [points, setPoints] = useState(0);
  const [userProfile, setUserProfile] = useState({});
  const navigation = useNavigation();
   

  // Check auth state and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserBooks(currentUser.uid);
        fetchUserPoints(currentUser.uid);
        fetchLikedBooks(currentUser.uid); // Fetch liked books
        loadProfilePicture();
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user's books
  const fetchUserBooks = (userId) => {
    const db = getDatabase();
    const booksRef = ref(db, "Books");
    onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const booksList = Object.entries(data)
            .map(([key, value]) => ({ id: key, ...value }))
            .filter((book) => book.sellerId === userId);
          setBooks(booksList);
        }
      },
      (error) => {
        console.error("Error fetching books:", error);
      }
    );
  };

  // Fetch user's points
  const fetchUserPoints = (userId) => {
    const db = getDatabase();
    const userRef = ref(db, `Users/${userId}`);
    onValue(
      userRef,
      (snapshot) => {
        const data = snapshot.val();
        setPoints(data?.points || 0);
      },
      (error) => console.error("Error fetching points:", error)
    );
  };

  // Load profile picture
  const loadProfilePicture = async () => {
    const storedProfilePicture = await AsyncStorage.getItem("profilePicture");
    if (storedProfilePicture) {
      setUserProfile((prev) => ({
        ...prev,
        profilePicture: storedProfilePicture,
      }));
    }
  };

  // Handle profile picture upload
  const handleUploadPicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      await AsyncStorage.setItem("profilePicture", imageUri);
      setUserProfile((prev) => ({
        ...prev,
        profilePicture: imageUri,
      }));
    }
  };

  // Handle login
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then(() => Alert.alert("Success", "Logged in successfully!"))
      .catch((error) => Alert.alert("Error", error.message));
  };

  // Handle account creation
  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, createEmail, createPassword)
      .then(() => Alert.alert("Success", "Account created successfully!"))
      .catch((error) => Alert.alert("Error", error.message));
  };

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        Alert.alert("Success", "Logged out successfully!");
      })
      .catch((error) => Alert.alert("Error", error.message));
  };

  // Add new book
  const handleAddBook = () => {
    navigation.navigate("AddBook");
  };

  // Fetch user's liked books
  const fetchLikedBooks = (userId) => {
    const db = getDatabase();
    const likedBooksRef = ref(db, `LikedBooks/${userId}`);
    onValue(
      likedBooksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const likedBooksList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setLikedBooks(likedBooksList);
        } else {
          setLikedBooks([]); // Reset if no liked books
        }
      },
      (error) => console.error("Error fetching liked books:", error)
    );
  };


  /* ==================== Login ==================== */
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
          onPress={handleLogin}
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
          onPress={handleCreateAccount}
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
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
        >
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

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("PointScreen", { points });
              }}
              style={{
                marginTop: 10,
                backgroundColor: "#DB8D16",
                borderRadius: 20,
                paddingVertical: 5,
                paddingHorizontal: 25,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#FFF",
                  textAlign: "center",
                }}
              >
                {points} point
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleUploadPicture}
          style={globalStyles.mainButton}
        >
          <Text style={styles.uploadpicText}>Upload profilbillede</Text>
        </TouchableOpacity>
      </View>
      
      <View style={globalStyles.separator} />

      {/* Add Book Button */}
      <TouchableOpacity style={globalStyles.addButton} onPress={handleAddBook}>
        <Text style={globalStyles.addButtonText}>Opret ny annonce</Text>
      </TouchableOpacity>

      <View style={globalStyles.separator} />

      {/* ==================== MyBooks ==================== */}

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

      {/* ==================== liked books ==================== */}

      <View style={globalStyles.sectionContainer}>
        <Text style={globalStyles.heading}>Dine likede bøger</Text>
        <View style={globalStyles.gridContainer}>
          {likedBooks.map((book) => (
      <TouchableOpacity
              key={book.id}
              style={globalStyles.box}
              onPress={() => navigation.navigate("BookDetails", { book: book })} 
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

const styles = StyleSheet.create ({
  uploadpicText: {
    fontSize: 14,
    color: '#fff', // White text
    fontFamily: 'abadi',
  },
});
