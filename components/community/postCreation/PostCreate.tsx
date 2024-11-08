import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import {
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";

function PostCreate() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleCreateBlog = () => {
    console.log({ title, content, location, isPublic });
    alert("Post created successfully!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.imageContainer}>
        <ThemedView style={styles.imagePlaceholder}>
          <Ionicons name="add" size={48} color="#ccc" />
        </ThemedView>
      </ThemedView>

      <TextInput
        style={styles.titleInput}
        placeholder="Add a title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.contentInput}
        placeholder="Add text"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TextInput
        style={styles.locationInput}
        placeholder="Mark Locations"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity
        style={styles.publicToggle}
        onPress={() => setIsPublic((prev) => !prev)}
      >
        <ThemedText>{isPublic ? "Public" : "Private"}</ThemedText>
      </TouchableOpacity>

      <Button title="Post" onPress={handleCreateBlog} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
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
  titleInput: {
    fontSize: 18,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    paddingVertical: 10,
  },
  contentInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 120,
    textAlignVertical: "top",
  },
  locationInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  publicToggle: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
});

export default PostCreate;
