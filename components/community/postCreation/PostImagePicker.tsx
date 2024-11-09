import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";

function PostImagePicker() {
  return (
    <ThemedView style={styles.imageContainer}>
      <ThemedView style={styles.imagePlaceholder}>
        <Ionicons name="add" size={48} color="#ccc" />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});

export default PostImagePicker;
