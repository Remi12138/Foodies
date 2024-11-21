import { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { getAuth } from "firebase/auth";
import BlogAuthor from "@/components/community/blogDetail/BlogAuthor";
import { useCollectionStore } from "@/zustand/collections";
import { updateFavoriteBlogIdFromServer } from "@/utils/blogs/favorites";
import { Blog, BlogCover } from "@/zustand/blog";

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
  const currentUser = getAuth().currentUser;

  const toggleLike = async () => {
    if (currentUser) {
      try {
        setIsLiked(!isLiked);
        if (isLiked) {
          const newBlogIds = blogIds.filter((id) => id !== blog.id);
          setBlogIds(newBlogIds);
          // sync with server
          updateFavoriteBlogIdFromServer(currentUser.uid, blog.id, "remove");
          // remove blog cover from local
          removeBlogCover(blog.id);
        } else {
          const newBlogIds = [blog.id, ...blogIds];
          setBlogIds(newBlogIds);
          // sync with server
          updateFavoriteBlogIdFromServer(currentUser.uid, blog.id, "add");
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
