import { StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getAuth } from "firebase/auth";
import { Blog } from "@/zustand/blog";

function BlogAuthor({ blog }: { blog: Blog }) {
  const currentUser = getAuth().currentUser;
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.container}>
        <Image
          source={
            blog.author?.avatar !== ""
              ? { uri: blog.author?.avatar }
              : require("@/assets/images/avatar-placeholder.jpg")
          }
          style={styles.avatar}
        />
        <ThemedText style={styles.authorText}>{blog.author.name}</ThemedText>
      </ThemedView>
      {currentUser && currentUser.uid === blog.author_uid && (
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
    fontFamily: "SpaceMono",
    fontSize: 20,
    lineHeight: 32,
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: 8,
    borderRadius: 16,
    overflow: "hidden",
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
