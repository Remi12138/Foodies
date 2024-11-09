import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePostStore } from "@/zustand/post";

function PostBtnSubmit() {
  const { draft, resetDraft } = usePostStore();

  const handleCreateBlog = () => {
    console.log({
      title: draft.title,
      content: draft.content,
      location: draft.location,
    });
    alert("Post created successfully!");
    resetDraft();
  };

  const postButtonBackground = useThemeColor(
    { light: "#000", dark: "#FFF" },
    "background"
  );
  const postButtonText = useThemeColor({ light: "#FFF", dark: "#000" }, "text");

  return (
    <TouchableOpacity
      style={[styles.postButton, { backgroundColor: postButtonBackground }]}
      onPress={handleCreateBlog}
    >
      <ThemedText
        type="default"
        style={[styles.postButtonText, { color: postButtonText }]}
      >
        Post
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  postButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PostBtnSubmit;
