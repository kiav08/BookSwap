import React, { useEffect, useState } from "react"; 
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { auth } from "../FirebaseConfig";
import { getDatabase, ref, update } from "firebase/database";
import { ScrollView } from "react-native";
import { Image } from 'react-native';


/* ========== BOOKDETAILS FUNCTION ========== */
// Function to display book details when the user clicks on a book
export default function BookDetails({ navigation, route }) {
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (route.params && route.params.book) {
      setBook(route.params.book);
      if (route.params.book.sellerId) {
      }
    }

    // Cleanup function
    return () => {
      setBook(null)
    }
  }, [route.params.book]);

  if (!book) {
    return <Text>Ingen data</Text>;
  }

  /*=========== HANDLE WRITE TO SELLER FUNCTION ============*/
  // Function to handle "Skriv til sælger"
  const handleWriteToSeller = () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      // User is logged in, navigate to Chat screen
      navigation.navigate("Profil", { screen: "Chat" });
    } else {
      // User is not logged in, alert and navigate to Profile
      Alert.alert(
        "Log ind nødvendig",
        "Du skal logge ind eller oprette en bruger for at fortsætte."
      );
      navigation.navigate("Profil"); // Navigate to Profile screen to log in
    }
  };

  /*=========== HANDLE PURCHASE FUNCTION ============*/
  // Function to handle "Køb"
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
          navigation.navigate("CheckOut",{book});
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {/* Book image */}
        {book.imageUri && (
          <Image source={{ uri: book.imageUri }} style={styles.bookImage} />
        )}
        
        {/* Book details */}
        {["title", "author", "year", "subject", "price", "university", "semester"].map((field, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </Text>
            <Text style={styles.value}>{book[field]}</Text>
          </View>
        ))}

        {/* Buy button */}
        <TouchableOpacity
          style={styles.buyButton}
          onPress={handlePurchase} // Check login before handling purchase
        >
          <Text style={styles.buyButtonText}>Køb bog</Text>
        </TouchableOpacity>

        {/* Write to seller */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleWriteToSeller} // Check login before navigating to Chat
        >
          <Text style={styles.chatButtonText}>Skriv til sælger</Text>
        </TouchableOpacity>
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
    color: '#fff', // White text
    fontFamily: 'abadi',
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
    color: '#fff', // White text
    fontFamily: 'abadi',
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
});
