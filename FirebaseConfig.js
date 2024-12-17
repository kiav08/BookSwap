import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Tilføj denne import
import { getAuth } from "firebase/auth";

// Firebase-konfiguration
const firebaseConfig = {
  apiKey: "*INSERT API KEY HERE",
  authDomain: "my-app-4-88614.firebaseapp.com",
  databaseURL:
    "https://my-app-4-88614-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-app-4-88614",
  storageBucket: "my-app-4-88614.appspot.com",
  messagingSenderId: "690679301727",
  appId: "1:690679301727:web:c78007959fa72f8c6f3dea",
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Firestore
const firestore = getFirestore(app); // Sørg for, at denne linje fungerer

// Initialiser Auth
const auth = getAuth(app);

export { firestore, auth };
