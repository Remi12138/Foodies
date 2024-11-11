import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getAuth } from "firebase/auth";
import { Blog } from "@/zustand/blog";

function BlogAuthor({ blog }: { blog: Blog }) {
  const currentUser = getAuth().currentUser;
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.authorText}>{blog.author.name}</ThemedText>
      {currentUser && currentUser.uid !== blog.author_uid ? (
        <TouchableOpacity style={styles.followButton}>
          <ThemedText style={styles.followButtonText}>Follow</ThemedText>
        </TouchableOpacity>
      ) : (
        <ThemedView style={{ marginLeft: 5 }}>
          <ThemedText>(Me)</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorText: {
    fontSize: 20,
  },
  followButton: {
    backgroundColor: "#000",
    paddingVertical: 2,
    paddingHorizontal: 12,
    marginLeft: 10, // Added margin to create space between author and follow button
  },
  followButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default BlogAuthor;
