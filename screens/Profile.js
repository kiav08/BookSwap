import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput
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
      <View style={globalStyles.container}>
        <Text style={globalStyles.heading}>Velkommen, {user.email}</Text>
        <Text style={globalStyles.heading}>Dine bøger:</Text>

        {/* Grid of books */}
        <View style={styles.gridContainer}>
          {books.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.box}
              onPress={() => handleSelectBook(book)} // Navigate to EditBook screen
            >
              <Text style={styles.boxText}>{book.title}</Text>
              <Text style={styles.boxTextSmall}>{book.author}</Text>
              <Text style={styles.boxTextSmall}>({book.year})</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={globalStyles.heading}>Dine likede bøger:</Text>
        <Text style={globalStyles.heading}>Dine fulgte bøger:</Text>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render the login and account creation view
  return (
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
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  box: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#DB8D16",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
  boxText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  boxTextSmall: {
    color: "#fff",
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
});
