import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function ThemeSetting() {
  return (
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
  );
}

const styles = StyleSheet.create({
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
