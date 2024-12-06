import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const PointScreen = ({ route }) => {
  const { points } = route.params; // Getting points from navigation

  // Define reward items
  const rewards = [
    { name: "10% på fragt", cost: 3 },
    { name: "Plant et træ", cost: 10 },
    { name: "Gratis annonce", cost: 20 },
    { name: "20% på fragt", cost: 125 },
    { name: "Tidlig adgang til nye bøger", cost: 150 },
    { name: "Gratis fragt", cost: 300 },
    { name: "50 kr.- voucher", cost: 500 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Dine Point</Text>
      <Text style={styles.points}>{points} point</Text>

      <View style={styles.rewardsContainer}>
        {rewards.map((reward, index) => {
          const isAffordable = points >= reward.cost; // Check if the user has enough points
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.rewardButton,
                { backgroundColor: isAffordable ? "#156056" : "#DB8D16" }, // Green if enough points, brown if not
              ]}
              disabled={!isAffordable} // Disable the button if the user doesn't have enough points
            >
              <Text style={styles.rewardText}>{reward.name}</Text>
              <Text style={styles.rewardCost}>{reward.cost} point</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Allow content to grow and scroll
    justifyContent: "flex-start", // Adjust the content to the top of the screen
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
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
