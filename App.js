import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

// Importing screens
import AddBook from "./screens/AddBook";
import BookDetails from "./screens/BookDetails";
import Chat from "./screens/Chat";
import EditBook from "./screens/EditBook";
import Homepage from "./screens/Homepage";
import Profile from "./screens/Profile";
import PointScreen from "./screens/PointScreen";
import CheckOut from "./screens/CheckOut";
 

// Creating navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack for Homepage
const HomepageStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Homepage" component={Homepage} />
      <Stack.Screen
        name="BookDetails"
        component={BookDetails}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Homepage")} // Navigate back to Homepage
              style={{ marginLeft: 10 }}
            >
              <Text style={{ color: "#DB8D16", fontSize: 16 }}>Tilbage</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="CheckOut"
        component={CheckOut} // Include the Checkout screen
        options={{
          headerShown: true,
          headerTitle: "CheckOut",
        }}
      />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

// Stack for Profile
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditBook" component={EditBook} />
      <Stack.Screen name="AddBook" component={AddBook} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="PointScreen" component={PointScreen} />
    </Stack.Navigator>
  );
};

// Stack for Chat
const ChatStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const BottomNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Hjem"
        component={HomepageStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarActiveTintColor: "#156056",
          tabBarInactiveTintColor: "#8C806F",
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStack} // Use ChatStack instead of Chat
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" color={color} size={size} />
          ),
          tabBarActiveTintColor: "#156056",
          tabBarInactiveTintColor: "#8C806F",
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          tabBarActiveTintColor: "#156056",
          tabBarInactiveTintColor: "#8C806F",
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <BottomNavigation />
    </NavigationContainer>
  );
}
