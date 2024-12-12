import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Image, Modal, FlatList } from "react-native";
import * as Notifications from "expo-notifications";
import { auth } from "../FirebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";
import globalStyles from "../styles/globalStyles";

export default function FollowedBooks({ navigation }) {
  const [followedBooks, setFollowedBooks] = useState([]);
  const [notifications, setNotifications] = useState([]); // To store notifications
  const [showNotifications, setShowNotifications] = useState(false); // To control visibility of notifications

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      console.log("Notification permissions:", status);
      if (status !== "granted") {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        console.log("New notification permissions status:", newStatus);
        if (newStatus !== "granted") {
          Alert.alert("Tilladelse nødvendig", "Notifikationstilladelser er nødvendige for at modtage meddelelser.");
        }
      }
    };
    
    requestPermissions();
  }, []);
  
  useEffect(() => {
    const currentUser = auth.currentUser;
  
    if (currentUser) {
      const db = getDatabase();
      const followRef = ref(db, `users/${currentUser.uid}/followedBooks`);
      const booksRef = ref(db, `Books`);
      const prevPricesRef = {}; // Use a ref to track previous prices without triggering re-renders
  
      const unsubscribeFollowed = onValue(followRef, (snapshot) => {
        const followedBooksData = snapshot.val();
        if (followedBooksData) {
          const booksArray = Object.values(followedBooksData);
          const newPrices = {};
          const changedBooks = [];
  
          booksArray.forEach((book) => {
            if (prevPricesRef[book.id] !== undefined && prevPricesRef[book.id] !== book.price) {
              changedBooks.push(book);
            }
            newPrices[book.id] = book.price;
          });
  
          if (changedBooks.length > 0) {
            changedBooks.forEach((book) => addPriceChangeNotification(book));
          }
  
          prevPricesRef.current = newPrices; // Update the ref directly
          setFollowedBooks(booksArray);
        } else {
          setFollowedBooks([]);
        }
      });
  
      const unsubscribeBooks = onValue(booksRef, (snapshot) => {
        const booksData = snapshot.val();
        if (booksData) {
          const booksArray = Object.values(booksData);
          const newPrices = {};
          const changedBooks = [];
  
          booksArray.forEach((book) => {
            if (prevPricesRef[book.id] !== undefined && prevPricesRef[book.id] !== book.price) {
              changedBooks.push(book);
            }
            newPrices[book.id] = book.price;
          });
  
          if (changedBooks.length > 0) {
            changedBooks.forEach((book) => addPriceChangeNotification(book));
          }
  
          prevPricesRef.current = newPrices; // Update the ref directly
        }
      });
  
      // Cleanup listener on unmount
      return () => {
        unsubscribeFollowed();
        unsubscribeBooks();
      };
    } else {
      Alert.alert("Log ind nødvendig", "Du skal logge ind for at se dine fulgte bøger.");
      navigation.navigate("Profil");
    }
  }, [navigation]);

  // Funktion til at tilføje en prisændrings-notifikation
  const addPriceChangeNotification = async (book) => {
    // Tjek om notifikationen allerede eksisterer
    if (!notifications.some((notification) => notification.id === book.id && notification.message.includes(book.price))) {
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { id: book.id, message: `Prisen på \"${book.title}\" er ændret til ${book.price} DKK.` },
      ]);
  
      // Send en lokal notifikation
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Prisændring",
          body: `Prisen på \"${book.title}\" er ændret til ${book.price} DKK.`,
        },
        trigger: { seconds: 1 }, // Notifikation udløses efter 1 sekund
      });
    }
  };
  
  // Funktion til at vise/gemme notifikationer
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Funktion til at navigere til bogdetaljer
  const navigateToBookDetails = (book) => {
    navigation.navigate("BookDetails", { book });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {/* Tilbage-knap */}
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.backButtonText}>Tilbage</Text>
        </TouchableOpacity>

        {/* Notification button */}
        <TouchableOpacity onPress={toggleNotifications} style={styles.notificationButton}>
          <Text style={styles.notificationButtonText}>Notifikationer</Text>
        </TouchableOpacity>

        {/* Notifications dropdown */}
        {showNotifications && (
          <Modal
            visible={showNotifications}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleNotifications}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Notifikationer</Text>
                <FlatList
                  data={notifications}
                  renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                      <Text>{item.message}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
                <TouchableOpacity onPress={toggleNotifications} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Luk</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Vis liste af fulgte bøger */}
        {followedBooks.length > 0 ? (
          <View style={styles.bookGrid}>
            {followedBooks.map((book, index) => (
              <View key={index} style={styles.bookCard}>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${book.imageBase64}` }}
                  style={globalStyles.bookImage}
                />
                <Text style={globalStyles.bookTitle}>{book.title}</Text>
                <Text style={globalStyles.bookAuthor}>{book.author}</Text>

                <TouchableOpacity
                  style={globalStyles.viewButton}
                  onPress={() => navigateToBookDetails(book)}
                >
                  <Text style={globalStyles.viewButtonText}>Se detaljer</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={globalStyles.noBooksText}>Du følger ingen bøger endnu.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0E5",
  },
  notificationButton: {
    backgroundColor: "#156056",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  notificationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  notificationItem: {
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#156056",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  bookCard: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    width: "48%",
  },
  bookGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bookImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  bookAuthor: {
    fontSize: 16,
    color: "#757575",
    marginVertical: 5,
  },
  viewButton: {
    backgroundColor: "#156056",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noBooksText: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
    marginTop: 20,
  },
});
