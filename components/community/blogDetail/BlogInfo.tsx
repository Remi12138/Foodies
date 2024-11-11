import { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { getAuth } from "firebase/auth";
import BlogAuthor from "@/components/community/blogDetail/BlogAuthor";
import { UserPublicProfile } from "@/zustand/user";
import { useCollectionStore } from "@/zustand/collections";
import { updateFavoriteBlogCoverIds } from "@/utils/blogs/favorites";
import { Blog, BlogCover } from "@/zustand/blog";

function BlogInfo({
  blog,
  authorPublicProfile,
  isInitiallyLiked,
}: {
  blog: Blog;
  authorPublicProfile: UserPublicProfile | null;
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
          updateFavoriteBlogCoverIds(currentUser.uid, newBlogIds);
          setBlogIds(newBlogIds);
          removeBlogCover(blog.id);
        } else {
          const newBlogIds = [...blogIds, blog.id];
          updateFavoriteBlogCoverIds(currentUser.uid, newBlogIds);
          setBlogIds(newBlogIds);
          const blogCover = {
            blog_id: blog.id,
            post_title: blog.post.title,
            post_image_cover: blog.post.image_cover,
            post_likes_count: blog.likes_count,
            author_id: "",
            author_name: "",
            author_avatar: "",
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
