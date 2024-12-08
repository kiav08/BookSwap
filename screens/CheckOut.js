import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import globalStyles from "../styles/globalStyles";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "../FirebaseConfig";

const saveOrder = async (order) => {
  const user = auth.currentUser;

  if (!user) {
    Alert.alert("Fejl", "Du skal være logget ind for at kunne bestille.");
    return;
  }

  try {
    const orderId = Date.now(); 
    const db = getDatabase();
    await set(ref(db, `orders/${user.uid}/${orderId}`), order); // Gem ordren under brugerens UID og ordre-ID

    Alert.alert("Success", "Din ordre er gemt i databasen.");
  } catch (error) {
    console.error("Fejl under lagring af ordre:", error);
    Alert.alert("Fejl", "Kunne ikke gemme ordren: " + error.message);
  }
};

export default function CheckOut({ route, navigation }) {
  const { book } = route.params || {}; 
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login"); 
    }
  }, [user, navigation]);

  if (!book) {
    Alert.alert("Fejl", "Ingen bog fundet.");
    navigation.goBack(); 
    return null; 
  }

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

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const calculateTotal = () => {
    const bookPrice = parseFloat(book.price);
    const buyerProtectionFee = 6;
    const shippingFee = 40;
    return bookPrice + buyerProtectionFee + shippingFee;
  };

  const handleConfirmOrder = () => {
    if (!form.name || !form.email || !form.address || !form.postalCode || !form.phone || !form.bankInfo) {
      Alert.alert("Udfyld alle felter", "Alle felter skal udfyldes for at fortsætte.");
      return;
    }

    const order = {
      bookTitle: book.title,
      bookPrice: book.price,
      totalPrice: calculateTotal(),
      buyerInfo: form,
      orderDate: new Date().toISOString(),
    };

    saveOrder(order);

    const db = getDatabase();
    const bookRef = ref(db, `books/${book.id}`); 

    set(bookRef, {
      ...book,
      status: "sold", 
    })
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
        console.error("Fejl under opdatering af bogstatus:", error);
        Alert.alert("Fejl", "Kunne ikke opdatere bogstatus.");
      });
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Din ordre</Text>
        <Text>Titel: {book.title}</Text>
        <Text>Pris: {book.price} kr</Text>
      </View>

      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Personlige oplysninger</Text>
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

      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Leveringsmulighed</Text>
        <TouchableOpacity
          style={[
            globalStyles.deliveryOption,
            form.deliveryOption === "pickup" && globalStyles.selectedOption,
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
        <TouchableOpacity
          style={[
            globalStyles.deliveryOption,
            form.deliveryOption === "home" && globalStyles.selectedOption,
          ]}
          onPress={() => handleInputChange("deliveryOption", "home")}
        >
          <Text>Send til hjem</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Tilføj betalingsmetode</Text>
        <TextInput
          placeholder="Bank informationer"
          style={globalStyles.input}
          value={form.bankInfo}
          onChangeText={(value) => handleInputChange("bankInfo", value)}
        />
      </View>

      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Ordreoversigt</Text>
        <Text>Ordre: {book.price} kr</Text>
        <Text>Gebyr for køberbeskyttelse: 6 kr</Text>
        <Text>Porto: 40 kr</Text>
        <Text style={globalStyles.totalPrice}>I alt: {calculateTotal()} kr</Text>
      </View>

      <TouchableOpacity style={globalStyles.confirmButton} onPress={handleConfirmOrder}>
        <Text style={globalStyles.confirmButtonText}>Bekræft bestilling</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}