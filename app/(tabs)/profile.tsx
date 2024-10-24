import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { HelloWave } from "@/components/common/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hola, Smith</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView>
        <TouchableOpacity style={styles.row}>
          <ThemedText style={styles.rowText}>Diet</ThemedText>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView>
        <TouchableOpacity style={styles.row}>
          <ThemedText style={styles.rowText}>My Posts</ThemedText>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView>
        <TouchableOpacity style={styles.row}>
          <ThemedText style={styles.rowText}>My Receipts</ThemedText>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView>
        <TouchableOpacity style={styles.row}>
          <ThemedText style={styles.rowText}>My Profile and UUID</ThemedText>
          <Ionicons name="chevron-forward" size={24} color="gray" />
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.themeSettingContainer}>
        <ThemedText style={styles.settingTitle}>Theme Setting</ThemedText>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.themeButton, styles.lightButtonPressed]}
            onPress={() => {
              /* Handle Light theme */
            }}
          >
            <ThemedText style={styles.buttonText}>Light</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => {
              /* Handle Dark theme */
            }}
          >
            <ThemedText style={styles.buttonText}>Dark</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => {
              /* Handle System theme */
            }}
          >
            <ThemedText style={styles.buttonText}>System</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
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
  settingTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  themeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
  },
  lightButtonPressed: {
    backgroundColor: "#e0f7fa",
  },
  buttonText: {
    fontSize: 16,
  },
});
