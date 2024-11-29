// firebaseConfig.js
import { getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5q2uzhMmKzoNZw6QjEd1Wiof3dfBt_ps",
  authDomain: "my-app-4-88614.firebaseapp.com",
  databaseURL:
    "https://my-app-4-88614-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-app-4-88614",
  storageBucket: "my-app-4-88614.appspot.com",
  messagingSenderId: "690679301727",
  appId: "1:690679301727:web:c78007959fa72f8c6f3dea",
};

let app;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase Initialized");
}

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
