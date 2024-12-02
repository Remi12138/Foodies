import { Image, StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import WelcomeBar from "@/components/profile/WelcomeBar";

export default function ProfileScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/brooke-lark-BepcnEnnoPs-unsplash.jpg")}
          style={styles.headerImage}
        />
      }
    >
      <WelcomeBar />
      {/* <ThemedView>
        <TouchableOpacity style={styles.row}>
          <ThemedText style={styles.rowText}>My Posts</ThemedText>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>
      </ThemedView> */}

      <ThemedView>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            router.navigate("/profile/account");
          }}
        >
          <ThemedText style={styles.rowText}>Account</ThemedText>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>
      </ThemedView>
      {/* <ThemeSetting /> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 150,
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  rowText: {
    fontSize: 18,
  },
  themeSettingContainer: {
    marginTop: 32,
  },
});
