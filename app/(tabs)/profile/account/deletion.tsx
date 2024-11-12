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
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebaseConfig";
import {
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useUserStore } from "@/zustand/user";

function DeletionScreen() {
  const currentUser = FIREBASE_AUTH.currentUser;
  const { setUser } = useUserStore();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!currentUser || !currentUser.email) return;
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser!, credential);
      // remove user profiles from server
      const userDocRef = doc(FIREBASE_DB, "users", currentUser.uid);
      await updateDoc(userDocRef, { deletionRequested: true });
      // remove user
      await deleteUser(currentUser!);
      setUser(null);
      alert("Your account has been permanently deleted.");
      router.replace("/(auth)/signin");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const warningBlockBackground = useThemeColor(
    { light: "#000", dark: "#FFF" },
    "background"
  );
  const deleteButtonBackground = useThemeColor(
    { light: "#FF0000", dark: "#FF4444" },
    "background"
  );
  const inputBorderColor = useThemeColor(
    { light: "#CCC", dark: "#666" },
    "text"
  );
  const warningTextColor = useThemeColor(
    { light: "#FFF", dark: "#000" },
    "text"
  );
  const inputTextColor = useThemeColor({ light: "#000", dark: "#FFF" }, "text");

  return (
    <>
      <StackHeader title="Delete Account" />

      <ThemedView style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <ThemedView
            style={[
              styles.warningBlock,
              { backgroundColor: warningBlockBackground },
            ]}
          >
            <ThemedText
              style={[styles.warningText, { color: warningTextColor }]}
            >
              Warning: This action cannot be undone. Your account will be
              permanently removed from our database.
            </ThemedText>
          </ThemedView>
          <TextInput
            style={[
              styles.input,
              { borderColor: inputBorderColor, color: inputTextColor },
            ]}
            placeholder="Enter your password"
            placeholderTextColor={inputBorderColor}
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={[
              styles.deleteButton,
              { backgroundColor: deleteButtonBackground },
            ]}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <ThemedText type="default" style={[styles.deleteButtonText]}>
              {loading ? "Processing..." : "Delete My Account"}
            </ThemedText>
          </TouchableOpacity>
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
  warningBlock: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 26,
  },
  warningText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 18,
  },
  deleteButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeletionScreen;
