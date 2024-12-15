// import all the necessary libraries
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
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

/* ========================= FETCH USER ========================= */
// Fetch user data from Firebase
export default function Profile() {
  // State variables
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [LikedBooks, setLikedBooks] = useState([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [points, setPoints] = useState(0);
  const [userProfile, setUserProfile] = useState({});
  const [followedBooks, setFollowedBooks] = useState([]);
  const navigation = useNavigation();

  // Check auth state and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data
        fetchUserBooks(currentUser.uid);
        fetchUserPoints(currentUser.uid);
        fetchLikedBooks(currentUser.uid);
        loadProfilePicture();
      }
    });
    // Unsubscribe when component unmounts
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
          // Convert object to array and filter by sellerId
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

  // Load user's profile picture
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
          // Reset liked books if no data
          setLikedBooks([]);
        }
      },
      (error) => console.error("Error fetching liked books:", error)
    );
  };

    // Fetch followed books from Firebase
    useEffect(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const db = getDatabase();
        const followRef = ref(db, `users/${currentUser.uid}/followedBooks`);
  
        // Listen for changes in the followedBooks data
        onValue(followRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const books = Object.values(data); // Convert the followed books object into an array
            setFollowedBooks(books);
          } else {
            setFollowedBooks([]);
          }
        }, (error) => {
          console.error("Error fetching followed books:", error);
          setFollowedBooks([]);  // Optional: Clear the list if there's an error
        });        
      }
    }, [user]);  

  /* ==================== LOGIN ==================== */
  if (!user) {
    return (
      <View style={globalStyles.container}>
        {/* Login form */}
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Create account form */}
        <Text style={styles.text}>Create Account</Text>
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
          style={styles.createAccountButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ==================== PROFILE ==================== */
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
                borderColor: "#DB8D16", // Optional for a colored border
                marginBottom: 15, // Space below the picture
              }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>
              Velkommen
            </Text>
            <Text style={{ fontSize: 18, color: "#757575", marginBottom: 15 }}>{user.email}</Text>

          <TouchableOpacity
          onPress={() => navigation.navigate("PointScreen", { points })}
          style={globalStyles.mainButton} // Fixed style syntax
          >
         <Text style={[globalStyles.uploadpicText, { fontSize: 18 }]}>
         {points} point
         </Text>
        </TouchableOpacity>

        {/* Upload picture button */}
        <TouchableOpacity
          onPress={handleUploadPicture}
          style={globalStyles.mainButton}
        >
          <Text style={globalStyles.uploadpicText}>Upload billede</Text>
        </TouchableOpacity>
      </View>
      </View>
      </View>



      <View style={globalStyles.separator} />

      {/* Add Book Button */}
      <TouchableOpacity style={globalStyles.addButton} onPress={handleAddBook}>
        <Text style={globalStyles.addButtonText}>Opret ny annonce</Text>
      </TouchableOpacity>

      <View style={globalStyles.separator} />

{/* User's boks*/}
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
                source={{ uri: `data:image/jpeg;base64,${book.imageBase64}` }}
                style={globalStyles.bookImage}
              />
              <Text style={globalStyles.boxText}>{book.title}</Text>
              <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
              <Text style={globalStyles.boxTextSmall}>({book.year})</Text>
              <Text style={styles.bookPrice}>{book.price} DKK</Text>

<TouchableOpacity
    style={styles.viewButton}
    onPress={() => navigation.navigate("BookDetails", { book: book })}>
    <Text style={styles.viewButtonText}>Se detaljer</Text>
</TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={globalStyles.separator} />

      {/* User's liked books  */}
      <View style={globalStyles.sectionContainer}>
        <Text style={globalStyles.heading}>Dine likede bøger</Text>
        <View style={globalStyles.gridContainer}>
          {LikedBooks.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={globalStyles.box}
              onPress={() => navigation.navigate("BookDetails", { book: book })}
            >
              <Image
                source={{ uri: `data:image/jpeg;base64,${book.imageBase64}` }}
                style={globalStyles.bookImage}
              />
              <Text style={globalStyles.boxText}>{book.title}</Text>
              <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
              <Text style={globalStyles.boxTextSmall}>({book.year})</Text>

              <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigation.navigate("BookDetails", { book: book })}>
                  <Text style={styles.viewButtonText}>Se detaljer</Text>
              </TouchableOpacity>

            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={globalStyles.separator} />

{/* User's followed books */}
<View style={globalStyles.sectionContainer}>
  <Text style={globalStyles.heading}>Titler du følger</Text>
  <View style={globalStyles.gridContainer}>
    {/* Check if there are followed books */}
    {followedBooks.length === 0 ? (
    <Text>Du følger ingen bøger endnu</Text>
    ) : (
      followedBooks.map((book, index) => (
        <TouchableOpacity
          key={index}
          style={globalStyles.box}
          onPress={() => navigation.navigate("BookDetails", { book: book })}
        >
          <Image
            source={{ uri: `data:image/jpeg;base64,${book.imageBase64}` }}
            style={globalStyles.bookImage}
          />
          <Text style={globalStyles.boxText}>{book.title}</Text>
          <Text style={globalStyles.boxTextSmall}>{book.author}</Text>
          <Text style={globalStyles.boxTextSmall}>({book.year})</Text>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate("BookDetails", { book: book })}
          >
            <Text style={styles.viewButtonText}>Se detaljer</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))
    )}
  </View>
</View>

      <View style={globalStyles.separator} />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout(setUser)}
      >
        <Text style={styles.logoutButtonText}>Log ud</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ==================== STYLES ==================== */
const styles = StyleSheet.create({
  uploadpicText: {
    fontSize: 14,
    color: "#fff", // White text
    fontFamily: "abadi",
  },
  loginButton: {
    backgroundColor: "#156056", // Green background
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonText: {
    color: "#fff", // White text
    fontWeight: "bold",
    fontSize: 16,
  },
  createAccountButtonText: {
    color: "#fff", // White text
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButtonText: {
    color: "#fff", // White text
    fontWeight: "bold",
    fontSize: 16,
  },
  createAccountButton: {
    backgroundColor: "#8C806F", // Brown background
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  viewButton: {
    backgroundColor: "#DB8D16",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#8C806F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
});
