import {
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import PostImagePicker from "@/components/community/postCreation/PostImagePicker";
import PostBtnSubmit from "@/components/community/postCreation/PostBtnSubmit";
import { ThemedView } from "@/components/ThemedView";
import { usePostStore } from "@/zustand/post";

function PostCreate() {
  const { draft, setTitle, setContent } = usePostStore();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <PostImagePicker />
        <TextInput
          style={styles.titleInput}
          placeholder="Add a title"
          value={draft.title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.contentInput}
          placeholder="Add text"
          value={draft.content}
          onChangeText={setContent}
          multiline
        />

        <PostBtnSubmit />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
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
});

export default PostCreate;
