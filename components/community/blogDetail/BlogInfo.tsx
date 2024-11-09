import { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Blog } from "@/zustand/blog";
import BlogAuthor from "@/components/community/blogDetail/BlogAuthor";

function BlogInfo({
  blog,
  isInitiallyLiked,
}: {
  blog: Blog;
  isInitiallyLiked: boolean;
}) {
  const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const toggleLike = async () => {
    if (user) {
      try {
        setIsLiked(!isLiked);
        const collectionRef = doc(firestore, `collections/${user.uid}`);
        if (isLiked) {
          await updateDoc(collectionRef, {
            blogs: arrayRemove(doc(firestore, `blogs/${blog.id}`)),
          });
        } else {
          await updateDoc(collectionRef, {
            blogs: arrayUnion(doc(firestore, `blogs/${blog.id}`)),
          });
        }
      } catch (error) {
        setIsLiked(!isLiked);
        console.error("Error updating like status: ", error);
      }
    }
  };

  return (
    <ThemedView style={styles.blogInfoContainer}>
      <BlogAuthor author={blog.author} />
      <ThemedView style={styles.toolContainer}>
        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          <AntDesign
            name={isLiked ? "heart" : "hearto"}
            size={24}
            color={isLiked ? "#D1382C" : "#000"}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Entypo name="share" size={24} color="#000" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  blogInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toolContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeButton: {
    padding: 8,
    marginRight: 8,
  },
  shareButton: {
    padding: 8,
  },
});

export default BlogInfo;
