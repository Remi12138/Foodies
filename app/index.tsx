import { FIREBASE_AUTH } from "@/firebaseConfig";
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import * as Notifications from "expo-notifications";
import { useCollectionStore } from "@/zustand/collections";
import { initBlogCollections } from "@/utils/blogs/favorites";
import { initUserCollection, initUserProfile } from "@/utils/users/init";
import { useUserStore } from "@/zustand/user";
import { fetchUserPublicProfile } from "@/utils/users/info";

// Set up notification handler for in-app notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomeScreen() {
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const { setBlogIds, setBlogCovers } = useCollectionStore();

  useEffect(() => {
    // Show splash screen for 1.5 seconds
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    // Initialize user and their profile, collections.
    const session = onAuthStateChanged(FIREBASE_AUTH, async (firebaseUser) => {
      if (firebaseUser) {
        setUserSignedIn(true);
        setUserVerified(firebaseUser.emailVerified);
        if (firebaseUser.emailVerified) {
          const userProfile = await fetchUserPublicProfile(firebaseUser.uid);
          if (!userProfile) {
            console.log(
              "User profile not found and just created for user:",
              firebaseUser.uid
            );
            const userNewProfile = await initUserProfile(firebaseUser.uid);
            setUser(userNewProfile);
          } else {
            setUser(userProfile);
            console.log("User:", userProfile?.name, userProfile?.cid);
          }
          initUserCollection(firebaseUser.uid);
          initBlogCollections(firebaseUser.uid, setBlogIds, setBlogCovers);
        }
      } else {
        setUserSignedIn(false);
        setUserVerified(false);
      }
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

  // Show splash screen during loading
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

  if (userSignedIn) {
    if (!userVerified) {
      return <Redirect href="/(auth)/email" />;
    }
    return <Redirect href="/(tabs)/community" />;
  }

  return <Redirect href="/(auth)/signin" />;
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
