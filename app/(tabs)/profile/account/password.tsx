import { useState } from "react";
import StackHeader from "@/components/common/StackHeader";
import { ThemedText } from "@/components/ThemedText";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useUserStore } from "@/zustand/user";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function UpdatePasswordScreen() {
  const { verifyOldPassword, updatePassword, logout } = useUserStore();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleVerifyOldPassword = async () => {
    setLoading(true);
    const isVerified = await verifyOldPassword(oldPassword);
    setLoading(false);
    if (isVerified) {
      setStep(2);
    } else {
      alert("Old password is incorrect");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    setLoading(true);
    const success = await updatePassword(newPassword);
    setLoading(false);
    if (success) {
      await logout();
      router.replace("/signin");
    } else {
      alert("Failed to update password");
    }
  };

  // Use theme colors for buttons and input text
  const buttonBackground = useThemeColor(
    { light: "#000", dark: "#FFF" },
    "background"
  );
  const buttonText = useThemeColor({ light: "#FFF", dark: "#000" }, "text");
  const inputBorderColor = useThemeColor(
    { light: "#CCC", dark: "#666" },
    "text"
  );
  const inputTextColor = useThemeColor({ light: "#000", dark: "#FFF" }, "text");

  return (
    <>
      <StackHeader title="Update Your Password" />

      <ThemedView style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          {step === 1 ? (
            <>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: inputBorderColor, color: inputTextColor },
                ]}
                placeholder="Enter old password"
                placeholderTextColor={inputBorderColor}
                secureTextEntry
                value={oldPassword}
                onChangeText={(text) => setOldPassword(text)}
              />
              <TouchableOpacity
                style={[styles.button, { backgroundColor: buttonBackground }]}
                onPress={handleVerifyOldPassword}
                disabled={loading}
              >
                <ThemedText
                  type="default"
                  style={[styles.buttonText, { color: buttonText }]}
                >
                  {loading ? "Verifying..." : "Verify"}
                </ThemedText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: inputBorderColor, color: inputTextColor },
                ]}
                placeholder="Enter new password"
                placeholderTextColor={inputBorderColor}
                secureTextEntry
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
              />
              <TextInput
                style={[
                  styles.input,
                  { borderColor: inputBorderColor, color: inputTextColor },
                ]}
                placeholder="Confirm new password"
                placeholderTextColor={inputBorderColor}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              <TouchableOpacity
                style={[styles.button, { backgroundColor: buttonBackground }]}
                onPress={handleUpdatePassword}
                disabled={loading}
              >
                <ThemedText
                  type="default"
                  style={[styles.buttonText, { color: buttonText }]}
                >
                  {loading ? "Updating..." : "Update Password"}
                </ThemedText>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 18,
  },
  button: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
