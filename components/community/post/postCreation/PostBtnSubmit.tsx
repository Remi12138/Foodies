import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePostStore } from "@/zustand/post";
import { createPostRecord } from "@/utils/blogs/posts";
import { getAuth } from "firebase/auth";

function PostBtnSubmit() {
  const { draft, resetDraft } = usePostStore();
  const currentUser = getAuth().currentUser;

  const handleCreateBlog = async () => {
    console.log({
      title: draft.title,
      content: draft.content,
      cover: draft.image_cover,
      images: draft.images,
    });
    try {
      if (currentUser) {
        await createPostRecord(draft, currentUser.uid);
        alert("Post created successfully!");
        resetDraft();
      } else {
        alert("User not logged in");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post");
    }
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
