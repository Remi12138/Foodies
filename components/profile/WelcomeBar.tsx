import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HelloWave } from "@/components/common/HelloWave";
import { useUserStore } from "@/zustand/user";
import { useEffect } from "react";

export default function WelcomeBar() {
  const { user, fetchUserProfile } = useUserStore();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">Hola</ThemedText>
      <ThemedText type="title">{user && user.name}</ThemedText>
      <HelloWave />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
