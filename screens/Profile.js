import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Image, 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../FirebaseConfig";
import globalStyles from "../styles/globalStyles";
import { ScrollView } from "react-native"; 

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [books, setBooks] = useState([]);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserBooks(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch the user's books from Firebase
  const fetchUserBooks = (userId) => {
    const db = getDatabase();
    const booksRef = ref(db, "Books");
    onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const booksList = Object.entries(data)
            .map(([key, value]) => ({
              id: key,
              ...value,
            }))
            .filter((book) => book.sellerId === userId);
          setBooks(booksList);
        }
      },
      (error) => {
        console.error("Error fetching books:", error);
      }
    );
  };

    // Navigate to AddBook screen
    const handleAddBook = () => {
      navigation.navigate("AddBook");
    };

  // Handle selecting a book and navigating to EditBook
  const handleSelectBook = (book) => {
    navigation.navigate("EditBook", { book }); // Navigate to EditBook screen
  };

  // Handle login
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then(() => {
        Alert.alert("Success", "Logged in successfully!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  // Handle account creation
  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, createEmail, createPassword)
      .then(() => {
        Alert.alert("Success", "Account created successfully!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  // Handle logout
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Success", "Logged out successfully!");
        setUser(null);
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  // Render the logged-in view
  if (user) {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={globalStyles.container}>

        <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>Velkommen, {user.email}</Text>
        </View>

      <View style={styles.separator} />

        {/* Add Book Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
          <Text style={styles.addButtonText}>Opret ny annonce</Text>
        </TouchableOpacity>


        <View style={styles.sectionContainer}>
        <Text style={globalStyles.heading}>Dine bøger:</Text>
        {/* Grid of books */}
        <View style={styles.gridContainer}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.box}
              onPress={() => handleSelectBook(book)} // Navigate to EditBook screen
            >

            <Image
            source={{ uri: book.imageUri  }} // Adjust this to match your Firebase image key
            style={styles.bookImage}
            />  

              <Text style={styles.boxText}>{book.title}</Text>
              <Text style={styles.boxTextSmall}>{book.author}</Text>
              <Text style={styles.boxTextSmall}>({book.year})</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.separator} />

        <View style={styles.sectionContainer}>
        <Text style={globalStyles.heading}>Dine likede bøger:</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.sectionContainer}>
        <Text style={globalStyles.heading}>Dine fulgte bøger:</Text>
        </View>
        <View style={styles.separator} />
        </View>

        <View style={styles.separator} />

    


        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      </ScrollView>
    );
  }

  // Render the login and account creation view
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={globalStyles.container}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={loginEmail}
        onChangeText={setLoginEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={createEmail}
        onChangeText={setCreateEmail}
      />
      <TextInput
        style={styles.input}
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
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#D08D16", 
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  bannerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  sectionContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    maxWidth: '48%',
  },
  boxText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  boxTextSmall: {
    color: "#000",
    fontSize: 12,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  text: {
    fontSize: 30,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginBottom: 10,
    paddingLeft: 8,
  },
  loginButton: {
    backgroundColor: "#156056",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  createAccountButton: {
    backgroundColor: "#8C806F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },
  createAccountButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#156056",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 20,
    width: "100%",
    alignSelf: "center",
    marginBottom: 20,
  },
  bookImage: {
    width: "100%",
    height: "150",
    resizeMode: "cover",
    borderRadius: 5,
    marginBottom: 10,
  },
});
