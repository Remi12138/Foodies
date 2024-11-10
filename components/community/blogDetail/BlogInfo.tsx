import { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import BlogAuthor from "@/components/community/blogDetail/BlogAuthor";
import { UserPublicProfile } from "@/zustand/user";
import { FIREBASE_DB } from "@/firebaseConfig";

function BlogInfo({
  blogId,
  authorPublicProfile,
  isInitiallyLiked,
}: {
  blogId: string;
  authorPublicProfile: UserPublicProfile | null;
  isInitiallyLiked: boolean;
}) {
  const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
  const currentUser = getAuth().currentUser;

  const toggleLike = async () => {
    if (currentUser) {
      try {
        setIsLiked(!isLiked);
        const collectionRef = doc(
          FIREBASE_DB,
          `users/${currentUser.uid}/collections/blogs`
        );
        if (isLiked) {
          await updateDoc(collectionRef, {
            favorites: arrayRemove(blogId),
          });
        } else {
          await updateDoc(collectionRef, {
            favorites: arrayUnion(blogId),
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
      {authorPublicProfile && <BlogAuthor author={authorPublicProfile} />}
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
    marginVertical: 8,
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
