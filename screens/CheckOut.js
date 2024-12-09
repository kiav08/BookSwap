import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import globalStyles from "../styles/globalStyles";
import { getDatabase, ref, set, update } from "firebase/database";
import { auth } from "../FirebaseConfig";

/* ========================= SAVEORDER FUNCTION ========================= */
//function that saves the order to the database if the user is logged in
const saveOrder = async (order) => {
  const user = auth.currentUser;

  //if the user is not logged in, an alert will be shown
  if (!user) {
    Alert.alert("Fejl", "Du skal være logget ind for at kunne bestille.");
    return;
  }

  //if the user is logged in, the order will be saved to the database
  try {
    const orderId = Date.now();
    const db = getDatabase();
    // Save the order to the database
    await set(ref(db, `orders/${user.uid}/${orderId}`), order);
  } catch (error) {
    console.error("Fejl under lagring af ordre:", error);
    Alert.alert("Fejl", "Kunne ikke gemme ordren: " + error.message);
  }
};

/* ========================= CHECKOUT FUNCTION ========================= */
//function that handles the checkout process when the user tries to buy a book
export default function CheckOut({ route, navigation }) {
  // Get the book from the route params
  const { book } = route.params || {};
  const user = auth.currentUser;

  //Listens for the navigation and if the user is not logged in, the user will be redirected to the login screen
  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }
  }, [user, navigation]);

  // If no book is found, show an alert and go back
  if (!book) {
    Alert.alert("Fejl", "Ingen bog fundet.");
    navigation.goBack();
    return null;
  }

  // State for the form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    address: "",
    postalCode: "",
    phone: "",
    deliveryOption: "pickup",
    pickupLocation: "",
    bankInfo: "",
  });

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // Function to get the shipping fee based on the delivery option
  const getShippingFee = () => {
    if (form.deliveryOption === "meetWithSeller") {
      return 0;
    }
    return 40;
  };

  // Function to calculate the total price
  const calculateTotal = () => {
    const bookPrice = parseFloat(book.price);
    const buyerProtectionFee = 6;
    const shippingFee = getShippingFee();
    return bookPrice + buyerProtectionFee + shippingFee;
  };

  // Function to handle the confirm order button
  const handleConfirmOrder = () => {
    if (
      !form.name ||
      !form.email ||
      !form.address ||
      !form.postalCode ||
      !form.phone ||
      !form.bankInfo
    ) {
      Alert.alert(
        "Udfyld alle felter",
        "Alle felter skal udfyldes for at fortsætte."
      );
      return;
    }

    // Create the order object
    const order = {
      bookTitle: book.title,
      bookPrice: book.price,
      totalPrice: calculateTotal(),
      buyerInfo: form,
      orderDate: new Date().toISOString(),
    };

    saveOrder(order);

    // Update the book status and move it to the BookSold node
    const db = getDatabase();
    const bookRef = ref(db, `Books/${book.id}`);
    const bookSoldRef = ref(db, `BookSold/${book.id}`);

    update(bookRef, { status: "sold" })
      .then(() => {
        return set(bookSoldRef, {
          ...book,
          status: "sold",
          soldTo: {
            name: form.name,
            email: form.email,
            address: form.address,
            postalCode: form.postalCode,
            phone: form.phone,
          },
        });
      })
      .then(() => {
        return set(bookRef, null);
      })
      // Show an confirmation and navigate to the homepage
      .then(() => {
        Alert.alert(
          "Bestilling bekræftet",
          `Tak for din bestilling! Din ordre på "${book.title}" er blevet placeret. En kvittering på dit køb er blevet sendt til din E-mail.`,
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Homepage");
              },
            },
          ]
        );
      })
      .catch((error) => {
        console.error(
          "Fejl under opdatering af bogstatus eller overførsel:",
          error
        );
        Alert.alert("Fejl", "Kunne ikke opdatere bogstatus eller flytte data.");
      });
  };

  /* ========================= RETURN ========================= */

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Din ordre</Text>
        <Text>Titel: {book.title}</Text>
        <Text>Pris: {book.price} kr</Text>
      </View>

      {/* Input fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personlige oplysninger</Text>
        <TextInput
          placeholder="Navn"
          style={globalStyles.input}
          value={form.name}
          onChangeText={(value) => handleInputChange("name", value)}
        />
        <TextInput
          placeholder="E-mail"
          style={globalStyles.input}
          value={form.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        <TextInput
          placeholder="Land"
          style={globalStyles.input}
          value={form.country}
          onChangeText={(value) => handleInputChange("country", value)}
        />
        <TextInput
          placeholder="Adresselinje"
          style={globalStyles.input}
          value={form.address}
          onChangeText={(value) => handleInputChange("address", value)}
        />
        <TextInput
          placeholder="Postnummer"
          style={globalStyles.input}
          keyboardType="numeric"
          value={form.postalCode}
          onChangeText={(value) => handleInputChange("postalCode", value)}
        />
        <TextInput
          placeholder="Telefonnummer"
          style={globalStyles.input}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(value) => handleInputChange("phone", value)}
        />
      </View>

      {/* Delivery options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leveringsmulighed</Text>
        <TouchableOpacity
          style={[
            styles.deliveryOption,
            form.deliveryOption === "meetWithSeller" && styles.selectedOption,
          ]}
          onPress={() => handleInputChange("deliveryOption", "meetWithSeller")}
        >
          <Text>Mødes med sælger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deliveryOption,
            form.deliveryOption === "home" && styles.selectedOption,
          ]}
          onPress={() => handleInputChange("deliveryOption", "home")}
        >
          <Text>Send til hjemmeadresse</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deliveryOption,
            form.deliveryOption === "pickup" && styles.selectedOption,
          ]}
          onPress={() => handleInputChange("deliveryOption", "pickup")}
        >
          <Text>Send til afhentningssted</Text>
        </TouchableOpacity>
        {form.deliveryOption === "pickup" && (
          <TextInput
            placeholder="Indtast afhentningssted"
            style={globalStyles.input}
            value={form.pickupLocation}
            onChangeText={(value) => handleInputChange("pickupLocation", value)}
          />
        )}
      </View>

      {/* Bank information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tilføj betalingsmetode</Text>
        <TextInput
          placeholder="Bank informationer"
          style={globalStyles.input}
          value={form.bankInfo}
          onChangeText={(value) => handleInputChange("bankInfo", value)}
        />
      </View>

      {/* Order summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ordreoversigt</Text>
        <Text>Ordre: {book.price} kr</Text>
        <Text>Gebyr for køberbeskyttelse: 6 kr</Text>
        <Text>Porto: {getShippingFee()}</Text>
        <Text style={styles.totalPrice}>I alt: {calculateTotal()} kr</Text>
      </View>

      {/* Confirm order button */}
      <TouchableOpacity
        style={globalStyles.addButton}
        onPress={handleConfirmOrder}
      >
        <Text style={globalStyles.addButtonText}>Bekræft bestilling</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ========================= STYLES ========================= */

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  section: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
  deliveryOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#156056",
  },
  totalPrice: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "blue",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
