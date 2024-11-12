import { StyleSheet, View, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HelloWave } from "@/components/common/HelloWave";
import { useUserStore } from "@/zustand/user";

export default function WelcomeBar() {
  const { user } = useUserStore();

  return (
    <ThemedView style={styles.container}>
      <Image
        source={
          user?.avatar !== ""
            ? { uri: user?.avatar }
            : require("@/assets/images/avatar-placeholder.jpg")
        }
        style={styles.avatar}
      />
      <View style={styles.userInfoContainer}>
        <ThemedText style={styles.userNameText}>{user?.name}</ThemedText>
        <ThemedText style={styles.userCidText}>@ {user?.cid}</ThemedText>
      </View>
      <HelloWave />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
  },
  userInfoContainer: {
    paddingVertical: 8,
    flexDirection: "column",
  },
  userNameText: {
    fontFamily: "SpaceMonoB",
    fontSize: 24,
    paddingTop: 8,
  },
  userCidText: {
    fontFamily: "SpaceMonoI",
    fontSize: 16,
    lineHeight: 20,
  },
});
