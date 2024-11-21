import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { usePostStore } from "@/zustand/post";
import { createPostRecord } from "@/utils/blogs/posts";
import { getAuth } from "firebase/auth";
import { useUserStore } from "@/zustand/user";
import { router } from "expo-router";
import { useState } from "react";
import { draftValidate } from "@/utils/blogs/form";

function PostBtnSubmit() {
  const { user } = useUserStore();
  const { draft, resetDraft } = usePostStore();
  const currentUser = getAuth().currentUser;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateBlog = async () => {
    const formMsg = draftValidate(draft);
    if (formMsg !== "validated") {
      alert(formMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentUser && user) {
        await createPostRecord(draft, currentUser.uid, user);
        alert("Post created successfully!");
        resetDraft();
        router.replace("/(tabs)/community");
      } else {
        alert("User not logged in");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while creating the post");
    } finally {
      setIsSubmitting(false);
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
      disabled={isSubmitting}
    >
      <ThemedText
        type="default"
        style={[styles.postButtonText, { color: postButtonText }]}
      >
        {isSubmitting ? "Posting..." : "Post"}
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
