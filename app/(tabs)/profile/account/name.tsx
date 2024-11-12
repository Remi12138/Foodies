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
import {
  fetchUserPublicProfile,
  updateUserPublicProfileName,
} from "@/utils/users/info";
import { getAuth } from "firebase/auth";

export default function EditNameScreen() {
  const currentUser = getAuth().currentUser;
  const { user, setUser } = useUserStore();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    if (currentUser) {
      await updateUserPublicProfileName(currentUser.uid, name);
      const updatedUser = await fetchUserPublicProfile(currentUser.uid);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
    setLoading(false);
    router.navigate("/profile");
  };

  // Use theme colors for Save button and input text
  const saveButtonBackground = useThemeColor(
    { light: "#000", dark: "#FFF" },
    "background"
  );
  const saveButtonText = useThemeColor({ light: "#FFF", dark: "#000" }, "text");
  const inputBorderColor = useThemeColor(
    { light: "#CCC", dark: "#666" },
    "text"
  );
  const inputTextColor = useThemeColor({ light: "#000", dark: "#FFF" }, "text");

  return (
    <>
      <StackHeader title="Edit Your Name" />

      <ThemedView style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: inputBorderColor, color: inputTextColor },
            ]}
            placeholder="Enter new name"
            placeholderTextColor={inputBorderColor}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: saveButtonBackground },
            ]}
            onPress={handleSave}
            disabled={loading}
          >
            <ThemedText
              type="default"
              style={[styles.saveButtonText, { color: saveButtonText }]}
            >
              {loading ? "Saving..." : "Save"}
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
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 18,
  },
  saveButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
