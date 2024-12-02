import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { auth } from "../FirebaseConfig";
import { getDatabase, ref, update } from "firebase/database";
import { Image } from 'react-native';


export default function BookDetails({ navigation, route }) {
  const [book, setBook] = useState(null);

  useEffect(() => {
    setBook(route.params.book);

    // Cleanup function
    return () => {
      setBook({});
    };
  }, [route.params.book]);

  if (!book) {
    return <Text>Ingen data</Text>;
  }

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
  bookImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 5,
    resizeMode: "cover",
  },
  buyButton: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  chatButton: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  chatButtonText: {
    color: "white",
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