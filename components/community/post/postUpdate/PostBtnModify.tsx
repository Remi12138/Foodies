import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getAuth } from "firebase/auth";

function PostBtnModify({ blogId }: { blogId: string }) {
  const currentUser = getAuth().currentUser;

  const handleDestroyBlog = async () => {
    try {
      if (currentUser) {
        alert("Post updated successfully!");
        console.log(`Post with ID: ${blogId} updated`);
      } else {
        alert("User not logged in");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post");
    }
  };

  const modifyButtonBackground = useThemeColor(
    { light: "#000", dark: "#FFF" },
    "background"
  );
  const deletionButtonText = useThemeColor(
    { light: "#FFF", dark: "#000" },
    "text"
  );

  return (
    <TouchableOpacity
      style={[
        styles.postModifyButton,
        { backgroundColor: modifyButtonBackground },
      ]}
      onPress={handleDestroyBlog}
    >
      <ThemedText
        type="default"
        style={[styles.deletionButtonText, { color: deletionButtonText }]}
      >
        Modify
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postModifyButton: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  deletionButtonText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default PostBtnModify;
