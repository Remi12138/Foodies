import { FIREBASE_AUTH } from "@/firebaseConfig";
import { Redirect } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Notifications from 'expo-notifications';

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

  // Check if the user is signed in.
  useEffect(() => {
    const session = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("User:", user?.email);
      setUser(user);
      setLoading(false);
    });

    // Listen for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification received:", notification);
    });

    return () => {
      session();
      notificationListener.remove(); // Clean up listener on unmount
    };
  }, []);


  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return user ? (
    <Redirect href="/(tabs)/explore" />
  ) : (
    <Redirect href="/(auth)/signin" />
  );
}
