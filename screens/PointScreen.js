// Display user's points and rewards, allow user to spend points on rewards
// Import necessary components and libraries
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

// Define the users' points and rewards
const PointScreen = ({ route, navigation }) => {
  const [points, setPoints] = useState(route?.params?.points || 0); // Initialize with points from navigation

  // Define the rewards
  const rewards = [
    { name: "10% på fragt", cost: 2 },
    { name: "Plant et træ", cost: 10 },
    { name: "Gratis annonce", cost: 20 },
    { name: "20% på fragt", cost: 125 },
    { name: "Tidlig adgang til nye bøger", cost: 150 },
    { name: "Gratis fragt", cost: 300 },
    { name: "50 kr.- voucher", cost: 500 },
  ];

  // Function to handle reward press
  const handleRewardPress = (reward) => {
    // Check if user has enough points
    if (points >= reward.cost) {
      // Show confirmation popup
      Alert.alert(
        "Er du sikker?",
        `Vil du bruge ${reward.cost} point på '${reward.name}'?`,
        [
          {
            text: "Nej",
            style: "cancel",
          },
          {
            text: "Ja",
            onPress: () => {
              // Subtract points and show success message
              setPoints(points - reward.cost);
              Alert.alert(
                "Success",
                `Du har brugt ${reward.cost} point på '${reward.name}'!`
              );
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      // Show alert if not enough points
      Alert.alert("Fejl", "Du har ikke nok point til denne belønning.");
    }
  };

  // Return component layout
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Tilbage</Text>
      </TouchableOpacity>

      {/* Points Section */}
      <Text style={styles.heading}>Dine Point</Text>
      <Text style={styles.points}>{points} point</Text>

      {/* Rewards Section */}
      <View style={styles.rewardsContainer}>
        {rewards.map((reward, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.rewardButton,
              {
                backgroundColor: points >= reward.cost ? "#156056" : "#DB8D16",
              },
            ]}
            onPress={() => handleRewardPress(reward)}
          >
            <Text style={styles.rewardText}>{reward.name}</Text>
            <Text style={styles.rewardCost}>{reward.cost} point</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F0F0E5",
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#DB8D16",
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  points: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#DB8D16",
    marginBottom: 40,
  },
  rewardsContainer: {
    width: "100%",
  },
  rewardButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  rewardCost: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
});

export default PointScreen;
