import { FIREBASE_AUTH } from "@/firebaseConfig";
import { Redirect } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

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

    return () => session();
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
