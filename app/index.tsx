import { FIREBASE_AUTH } from "@/firebaseConfig";
import { Redirect } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import * as Notifications from "expo-notifications";

// Set up notification handler for in-app notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 1 second
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    // Check if the user is signed in.
    const session = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("User:", user?.email);
      setUser(user);
      setLoading(false);
    });

    // Listen for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    return () => {
      clearTimeout(splashTimeout);
      session();
      notificationListener.remove(); // Clean up listener on unmount
    };
  }, []);

  // Show splash screen for 1 second
  if (showSplash || loading) {
    return (
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/foodies-entry.jpg")}
          style={styles.fullScreenImage}
        />
      </View>
    );
  }

  return user ? (
    <Redirect href="/(tabs)/community" />
  ) : (
    <Redirect href="/(auth)/signin" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // You can change this to 'contain' or other values as needed
  },
});
