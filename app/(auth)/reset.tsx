import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { router } from "expo-router";

function ResetCredentialsScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      alert(
        "Credential reset link would be sent to your email if there is a match."
      );
      router.replace("/(auth)/signin");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetButtonBackground = useThemeColor(
    { light: "#000", dark: "#FFF" },
    "background"
  );
  const resetButtonText = useThemeColor(
    { light: "#FFF", dark: "#000" },
    "text"
  );
  const inputBorderColor = useThemeColor(
    { light: "#CCC", dark: "#666" },
    "text"
  );
  const inputTextColor = useThemeColor({ light: "#000", dark: "#FFF" }, "text");

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedView style={styles.title}>
          <ThemedText type="title">Reset Credential</ThemedText>
        </ThemedView>
        <TextInput
          style={[
            styles.input,
            { borderColor: inputBorderColor, color: inputTextColor },
          ]}
          placeholder="Enter your email"
          placeholderTextColor={inputBorderColor}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoFocus
        />
        <TouchableOpacity
          style={[
            styles.resetButton,
            { backgroundColor: resetButtonBackground },
          ]}
          onPress={handleReset}
          disabled={loading}
        >
          <ThemedText
            type="default"
            style={[styles.resetButtonText, { color: resetButtonText }]}
          >
            {loading ? "Processing..." : "Get Reset Link"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            { backgroundColor: resetButtonBackground },
          ]}
          onPress={() => router.replace("/(auth)/signin")}
          disabled={loading}
        >
          <ThemedText
            type="default"
            style={[styles.resetButtonText, { color: resetButtonText }]}
          >
            Cancel
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 58,
  },
  contentContainer: {
    marginBottom: 6,
  },
  title: {
    paddingVertical: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 18,
  },
  resetButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  cancelButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResetCredentialsScreen;
