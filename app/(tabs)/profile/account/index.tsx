import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import StackHeader from "@/components/common/StackHeader";
import { useUserStore } from "@/zustand/user";

export default function AccountScreen() {
  const { logout } = useUserStore();

  const handleEditName = () => {
    router.navigate("/profile/account/name");
  };

  const handleChangePassword = () => {
    router.navigate("/profile/account/password");
  };

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/signin");
  };

  const handleDeleteAccount = () => {
    router.navigate("/profile/account/deletion");
  };

  // Use theme colors for Sign Out button
  const logoutButtonBackground = useThemeColor(
    { light: "#000", dark: "#FFF" },
    "background"
  );
  const logoutButtonText = useThemeColor(
    { light: "#FFF", dark: "#000" },
    "text"
  );

  return (
    <>
      <StackHeader title="My Account" />

      <ThemedView style={styles.container}>
        <ScrollView style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleEditName}
          >
            <ThemedText type="default">Edit Name</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleChangePassword}
          >
            <ThemedText type="default">Change Password</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleDeleteAccount}
          >
            <ThemedText type="default">Request Account Deletion</ThemedText>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: logoutButtonBackground },
          ]}
          onPress={handleLogout}
        >
          <ThemedText
            type="default"
            style={[
              styles.logoutText,
              { fontWeight: "bold", color: logoutButtonText },
            ]}
          >
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  optionsContainer: {
    marginBottom: 6,
  },
  optionButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logoutButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
  },
});
