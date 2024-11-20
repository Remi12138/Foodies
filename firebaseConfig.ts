import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_ept_U2lfvhw4bWy7KaQ06-egt8YZL38",
  authDomain: "tapteam-foodies.firebaseapp.com",
  projectId: "tapteam-foodies",
  storageBucket: "tapteam-foodies.appspot.com",
  messagingSenderId: "263000789674",
  appId: "1:263000789674:web:f0997aefadb59d8c42b6d3",
  measurementId: "G-YHEZ2XY5BT",
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

// Initialize Analytics only if supported
isSupported()
  .then((supported) => {
    if (supported) {
      const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
      console.log("Firebase analytics initialized successfully.");
    } else {
      console.log("Firebase analytics not supported in this environment.");
    }
  })
  .catch((error) => {
    console.error("Error checking firebase analytics support:", error);
  });
