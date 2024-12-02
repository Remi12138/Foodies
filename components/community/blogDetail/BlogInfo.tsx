import { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import BlogAuthor from "@/components/community/blogDetail/BlogAuthor";
import { useCollectionStore } from "@/zustand/collections";
import {
  updateBlogCoverLikesFromServer,
  updateBlogLikesFromServer,
  updateFavoriteBlogIdFromServer,
} from "@/utils/blogs/favorites";
import { Blog, BlogCover } from "@/zustand/blog";
import { FIREBASE_AUTH } from "@/firebaseConfig";
import { ThemedText } from "@/components/ThemedText";

function BlogInfo({
  blog,
  isInitiallyLiked,
}: {
  blog: Blog;
  isInitiallyLiked: boolean;
}) {
  const { blogIds, setBlogIds, addBlogCover, removeBlogCover } =
    useCollectionStore();
  const [isLiked, setIsLiked] = useState<boolean>(isInitiallyLiked);
  const [likecount, setLikecount] = useState<number>(blog.likes_count);
  const currentUser = FIREBASE_AUTH.currentUser;

  const toggleLike = async () => {
    if (currentUser) {
      try {
        setIsLiked(!isLiked);
        if (isLiked) {
          const newBlogIds = blogIds.filter((id) => id !== blog.id);
          setBlogIds(newBlogIds);
          // sync with server
          updateFavoriteBlogIdFromServer(currentUser.uid, blog.id, "remove");
          updateBlogCoverLikesFromServer(blog.id, "decrease");
          updateBlogLikesFromServer(blog.author_uid, blog.id, "decrease");
          // remove blog cover from local
          removeBlogCover(blog.id);
          setLikecount(likecount - 1);
        } else {
          const newBlogIds = [blog.id, ...blogIds];
          setBlogIds(newBlogIds);
          // sync with server
          updateFavoriteBlogIdFromServer(currentUser.uid, blog.id, "add");
          updateBlogCoverLikesFromServer(blog.id, "increase");
          updateBlogLikesFromServer(blog.author_uid, blog.id, "increase");
          // add blog cover from local
          const blogCover = {
            blog_id: blog.id,
            post_title: blog.post.title,
            post_image_cover: blog.post.images[0],
            post_likes_count: blog.likes_count,
            author_uid: blog.author_uid,
            author: blog.author,
          } as BlogCover;
          addBlogCover(blogCover);
          setLikecount(likecount + 1);
        }
      } catch (error) {
        setIsLiked(!isLiked);
        console.error("Error updating like status: ", error);
      }
    }
  };

  return (
    <ThemedView style={styles.blogInfoContainer}>
      <BlogAuthor blog={blog} />
      <ThemedView style={styles.toolContainer}>
        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "#D1382C" : "#000"}
          />
        </TouchableOpacity>
        <ThemedView style={styles.likecount}>
          <ThemedText>{likecount}</ThemedText>
        </ThemedView>
        {/* <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={24} color="#000" />
        </TouchableOpacity> */}
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
  },
  likecount: {
    marginRight: 8,
  },
  shareButton: {
    padding: 8,
  },
});

export default BlogInfo;
