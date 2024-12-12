import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { auth } from "../FirebaseConfig";
import { getDatabase, ref, update, push, onValue, remove } from "firebase/database";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import MapView, { Marker } from "react-native-maps"; // Import MapView and Marker
import * as Location from "expo-location"; // Import Expo's Location API for geocoding
import globalStyles from "../styles/globalStyles";

/* ========================= BOOKDETAILS FUNCTION ========================= */
// Function to display book details when the user clicks on a book
export default function BookDetails({ navigation, route }) {
  // Usestate to store book data
  const [book, setBook] = useState(null);
  // Usestate to store latitude and longitude
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); 


  /* ========================= GET LOCATION COORDINATES FUNCTION ========================= */
  // Function to get latitude and longitude from a location string
  const getLocationCoordinates = async (location) => {
    try {
      // Geocode location string to get coordinates
      const geocode = await Location.geocodeAsync(location);

      if (geocode.length > 0) {
        const { latitude, longitude } = geocode[0];
        return { latitude, longitude };
      } else {
        console.error("Location kunne ikke geokodes.");
        return null;
      }
    } catch (error) {
      console.error("Fejl ved geokodning:", error);
      return null;
    }
  };

  // Fetch coordinates when book changes or component mounts
  useEffect(() => {
    // Check if book data is passed from previous screen
    if (route.params && route.params.book) {
      setBook(route.params.book);
    }
  }, [route.params]);

  // Fetch coordinates if book.location exists
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (book && book.location) {
        // Get coordinates from location string and GeoCodes
        const coords = await getLocationCoordinates(book.location);
      
        if (coords) {
          setLatitude(coords.latitude);
          setLongitude(coords.longitude);
        }
      }
    };

    fetchCoordinates();
  }, [book]);


  // New useEffect for handling "Follow Book" functionality
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const db = getDatabase();
      const followRef = ref(db, `users/${currentUser.uid}/followedBooks`);

      // Check if this book is already followed
      onValue(followRef, (snapshot) => {
        const followedBooks = snapshot.val() || {};
        const isBookFollowed = Object.values(followedBooks).some(
          (followedBook) => followedBook.bookId === book?.id
        );
        setIsFollowing(isBookFollowed);
      });
    }
  }, [book]); // Dependency on book to check follow status when book is set or changed

  if (!book) {
    return <Text>Loading...</Text>;
  }
  // Handle map loading
  if (latitude === null || longitude === null) {
    return <Text>Loading map...</Text>;
  }  

  /*========================= HANDLE WRITE TO SELLER FUNCTION ========================= */
  // Function to handle the button "Skriv til sælger"
  const handleWriteToSeller = () => {
    const currentUser = auth.currentUser;

    // Check if user is logged in
    if (currentUser) {
      // User is logged in, proceed with chat logic
      const db = getDatabase();
      const chatId = `${currentUser.uid}_${book.sellerId}_${book.id}`; // Unique chatId with book id
      const chatRef = ref(db, `chats/${chatId}`);

      const newChat = {
        senderId: currentUser.uid,
        receiverId: book.sellerId,
        bookTitle: book.title,
        message: "Hej jeg er interesseret i " + book.title,
        timestamp: Date.now(),
      };

      // Create chat in database
      update(chatRef, newChat)
        .then(() => {
          Alert.alert("Success", "Chat oprettet. Du kan nu skrive til sælger.");
          navigation.navigate("Chat", { chatId });
        })
        .catch((error) => {
          console.error("Error creating chat:", error);
          Alert.alert("Fejl", "Der skete en fejl under oprettelse af chat.");
        });
    } else {
      // User is not logged in, alert and navigate to Profile
      Alert.alert(
        "Log ind nødvendig",
        "Du skal logge ind eller oprette en bruger for at fortsætte."
      );
      navigation.navigate("Profil");
    }
  };



  /*========================= HANDLE PURCHASE FUNCTION ========================= */
  // Function to handle "Køb bog" button
  const handlePurchase = () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      // User is logged in, proceed with purchase logic
      const db = getDatabase();
      const bookRef = ref(db, `Books/${book.id}`);

      // Update status to "reserved"
      update(bookRef, { status: "reserved" })
        .then(() => {
          Alert.alert("Success", "Bogen er nu reserveret.");
          navigation.navigate("CheckOut", { book });
        })
        .catch((error) => {
          console.error("Error updating book:", error);
          Alert.alert("Fejl", "Der skete en fejl under reservering.");
        });
    } else {
      // User is not logged in, alert and navigate to Profile
      Alert.alert(
        "Log ind nødvendig",
        "Du skal logge ind eller oprette en bruger for at fortsætte."
      );
      navigation.navigate("Profil");
    }
  };


  /*========================= HANDLE FOLLOW BOOK FUNCTION ========================= */
    // Function to handle "Følg bog" button
    const handleFollowBook = () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert(
          "Log ind nødvendig",
          "Du skal logge ind eller oprette en bruger for at fortsætte."
        );
        navigation.navigate("Profil");
        return;
      }
    
      const db = getDatabase();
      const followRef = ref(db, `users/${currentUser.uid}/followedBooks`);

    
      if (isFollowing) {
        // Stop med at følge bogen
        onValue(followRef, (snapshot) => {
          const followedBooks = snapshot.val() || {};
          const bookKey = Object.keys(followedBooks).find(
            (key) => followedBooks[key].bookId === book.id
          );
          if (bookKey) {
            remove(ref(db, `users/${currentUser.uid}/followedBooks/${bookKey}`))
              .then(() => {
                setIsFollowing(false);
                Alert.alert("Success", "Du følger ikke længere bogen.");
              })
              .catch((error) => {
                console.error("Error unfollowing book:", error);
                Alert.alert("Fejl", "Kunne ikke stoppe med at følge bogen.");
              });
          }
        }, { onlyOnce: true });
      } else {
        // Følg bogen
        const newFollow = {
          bookId: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          imageBase64: book.imageBase64 || null,
        };
        push(followRef, newFollow)
          .then(() => {
            setIsFollowing(true);
            Alert.alert("Success", "Bogen er nu fulgt.");
          })
          .catch((error) => {
            console.error("Error following book:", error);
            Alert.alert("Fejl", "Kunne ikke følge bogen.");
          });
      }
    };


  /* ========================= RETURN ========================= */
  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={globalStyles.backButtonText}>Tilbage</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: `data:image/jpeg;base64,${book.imageBase64}` }}
          style={styles.bookImage}
        />

        {/* Book details */}
        {["title", "author", "year", "subject", "price", "location"].map(
          (field, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </Text>
              <Text style={styles.value}>{book[field]}</Text>
            </View>
          )
        )}

        {/* MapView for location */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>

        {/* Buy button */}
        <TouchableOpacity style={styles.buyButton} onPress={handlePurchase}>
          <Text style={styles.buyButtonText}>Køb bog</Text>
        </TouchableOpacity>

        {/* Write to seller */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleWriteToSeller}
        >
          <Text style={styles.chatButtonText}>Skriv til sælger</Text>
        </TouchableOpacity>

         {/* Follow Book button */}
         <TouchableOpacity
          style={styles.chatButton}
          onPress={handleFollowBook}
        >
          <Text style={styles.chatButtonText}>
          {isFollowing ? "Følg ikke bog længere" : "Følg bog"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ========================= STYLES ========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0E5",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
    flex: 1,
  },
  value: {
    flex: 2,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  buyButton: {
    backgroundColor: "#156056",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buyButtonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "abadi",
    fontWeight: "bold",
  },
  chatButton: {
    backgroundColor: "#8C806F",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  chatButtonText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "abadi",
    fontWeight: "bold",
  },
  bookImage: {
    width: "100%",
    height: 300,
    marginTop: 10,
    borderRadius: 15,
    resizeMode: "cover",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  author: {
    fontSize: 18,
    color: "#757575",
  },
  year: {
    fontSize: 16,
    color: "#757575",
  },
  subject: {
    fontSize: 16,
    color: "#757575",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6347",
  },
  map: {
    width: "100%",
    height: 100,
    marginTop: 20,
  },
});
