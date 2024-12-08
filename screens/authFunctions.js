import { Alert } from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth } from "../FirebaseConfig";

const storage = getStorage();

export const uploadProfilePicture = async (userId, imageUri) => {
  const fileName = `${userId}_profile.jpg`;
  const storageReference = storageRef(storage, `profilePictures/${fileName}`);
  const response = await fetch(imageUri);
  const blob = await response.blob();

  try {
    await uploadBytes(storageReference, blob);
    const downloadURL = await getDownloadURL(storageReference);

    // Gem URL i Firebase-database
    const db = getDatabase();
    const userRef = ref(db, `Users/${userId}`);
    await update(userRef, { profilePicture: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error("Fejl under upload til Firebase:", error);
    throw error;
  }
};

export const fetchLikedBooks = (userId, setLikedBooks) => {
  const db = getDatabase();
  const booksRef = ref(db, "Books");
  onValue(
    booksRef,
    (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const likedBooks = Object.entries(data)
          .map(([key, value]) => ({ id: key, ...value }))
          .filter((book) => book.likedBy && book.likedBy.includes(userId)); // Check if user ID is in the likedBy array
        setLikedBooks(likedBooks);
      }
    },
    (error) => console.error("Error fetching liked books:", error)
  );
};

export const fetchUserProfile = (userId, setUserProfile) => {
  const db = getDatabase();
  const userRef = ref(db, `Users/${userId}`);
  onValue(
    userRef,
    (snapshot) => {
      setUserProfile(snapshot.val());
    },
    (error) => {
      console.error("Error fetching user profile:", error);
    }
  );
};

export const fetchUserBooks = (userId, setBooks) => {
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

export const handleLogin = (email, password, setUser) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      Alert.alert("Success", "Logged in successfully!");
    })
    .catch((error) => {
      Alert.alert("Error", error.message);
    });
};

export const handleCreateAccount = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      Alert.alert("Success", "Account created successfully!");
    })
    .catch((error) => {
      Alert.alert("Error", error.message);
    });
};

export const handleLogout = (setUser) => {
  signOut(auth)
    .then(() => {
      Alert.alert("Success", "Logged out successfully!");
      setUser(null);
    })
    .catch((error) => {
      Alert.alert("Error", error.message);
    });
};

// Funktion til at gemme ordren i databasen
export const saveOrder = async (order) => {
  const user = auth.currentUser; // Hent den nuværende bruger

  if (!user) {
    Alert.alert("Fejl", "Du skal være logget ind for at kunne bestille.");
    return;
  }

  try {
    const orderId = Date.now(); // Brug timestamp som unik ID
    const db = getDatabase();
    await set(ref(db, `orders/${user.uid}/${orderId}`), order); // Gem ordren under brugerens UID og ordre-ID

    Alert.alert("Success", "Din ordre er gemt i databasen.");
  } catch (error) {
    console.error("Fejl under lagring af ordre:", error);
    Alert.alert("Fejl", "Kunne ikke gemme ordren: " + error.message);
  }
};

export const subscribeToAuthState = (setUser, fetchUserBooksCallback) => {
  return onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      fetchUserBooksCallback(currentUser.uid);
    }
  });
};
