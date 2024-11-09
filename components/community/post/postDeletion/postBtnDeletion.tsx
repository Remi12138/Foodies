import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getAuth } from "firebase/auth";

function PostBtnDeletion({ blogId }: { blogId: string }) {
  const currentUser = getAuth().currentUser;

  const handleDestroyBlog = async () => {
    try {
      if (currentUser) {
        alert("Post destroyed successfully!");
        console.log(`Post with ID: ${blogId} destroyed`);
      } else {
        alert("User not logged in");
      }
    } catch (error) {
      console.error("Error destroying post:", error);
      alert("An error occurred while destroying the post");
    }
  };

  const deleteButtonBackground = useThemeColor(
    { light: "#FF0000", dark: "#FF4444" },
    "background"
  );
  const deletionButtonText = useThemeColor(
    { light: "#FFF", dark: "#FFF" },
    "text"
  );

  return (
    <TouchableOpacity
      style={[
        styles.postDestroyButton,
        { backgroundColor: deleteButtonBackground },
      ]}
      onPress={handleDestroyBlog}
    >
      <ThemedText
        type="default"
        style={[styles.deletionButtonText, { color: deletionButtonText }]}
      >
        Destroy
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postDestroyButton: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  deletionButtonText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default PostBtnDeletion;
