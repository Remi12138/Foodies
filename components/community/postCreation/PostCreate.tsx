import { useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import PostImagePicker from "./PostImagePicker";
import { ThemedView } from "@/components/ThemedView";
import { usePostStore } from "@/zustand/post";
import PostBtnSubmit from "./PostBtnSubmit";
import { debounce } from "lodash";

function PostCreate() {
  const {
    draft,
    setTitle,
    setContent,
    loadDraftFromStorage,
    saveDraftToStorage,
  } = usePostStore();

  useEffect(() => {
    // Load saved draft when the component mounts
    loadDraftFromStorage();
  }, []);

  const handleTitleChange = (title: string) => {
    setTitle(title);
    debouncedSaveDraft();
  };

  const handleContentChange = (content: string) => {
    setContent(content);
    debouncedSaveDraft();
  };

  const debouncedSaveDraft = debounce(() => {
    saveDraftToStorage();
  }, 2000);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <PostImagePicker />
          <TextInput
            style={styles.titleInput}
            placeholder="Add a title"
            value={draft.title}
            onChangeText={handleTitleChange}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="Add text"
            value={draft.content}
            onChangeText={handleContentChange}
            multiline
          />
        </ScrollView>
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
  scrollViewContent: {
    paddingBottom: 80,
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
