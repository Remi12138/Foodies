import { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Blog } from "@/zustand/blog";
import { router } from "expo-router";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { ThemedView } from "@/components/ThemedView";
import BlogInfo from "./BlogInfo";
import { Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import PostAuthorTool from "@/components/community/post/postAuthor/PostAuthorTool";
import { fetchPostRecord } from "@/utils/blogs/posts";
import { checkIfBlogIsLikedLocal } from "@/utils/blogs/favorites";
import { useCollectionStore } from "@/zustand/collections";
import { formatBlogUpdatedTime } from "@/utils/blogs/info";
import BlogImageModal from "./BlogImageModal";

const { width } = Dimensions.get("window");

function BlogDetail({
  authorUid,
  blogId,
}: {
  authorUid: string;
  blogId: string;
}) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const { blogIds } = useCollectionStore();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchBlogDetailsAndLikeStatus = async () => {
      try {
        const blog = await fetchPostRecord(authorUid, blogId);
        if (blog) {
          setIsLiked(checkIfBlogIsLikedLocal(blogIds, blogId));
          setBlog(blog);
        } else {
          router.back();
          console.log(`No blog found with ID: ${blogId}`);
        }
      } catch (error) {
        console.error("Error fetching blog details and like status:", error);
      }
    };

    fetchBlogDetailsAndLikeStatus();
  }, []);

  if (!blog) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000FF" />
      </ThemedView>
    );
  }

  const images = [...blog.post.images];
  const blogUpdatedTime = blog.updated_at as unknown as Timestamp;
  const formattedUpdatedTime = formatBlogUpdatedTime(blogUpdatedTime);

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView>
          <BlogImageModal images={images} />
        </ThemedView>
        <ThemedView style={styles.contentContainer}>
          <ThemedText style={styles.title}>{blog.post.title}</ThemedText>
          <BlogInfo blog={blog} isInitiallyLiked={isLiked} />
          {currentUser?.uid === authorUid && (
            <PostAuthorTool blogId={blog.id} />
          )}
          <ThemedText style={styles.content}>
            <ThemedText style={styles.firstLetter}>
              {blog.post.content[0]}
            </ThemedText>
            {blog.post.content.substring(1)}
          </ThemedText>
          <ThemedView>
            <ThemedText style={styles.updatedTime}>
              {formattedUpdatedTime}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureContainer: { flex: 1, backgroundColor: "#FFF" },
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderImage: {
    width,
    height: Dimensions.get("window").height / 2.5,
  },

  contentContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: "Lora",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "left",
  },
  content: {
    fontFamily: "Lora",
    fontSize: 16,
    textAlign: "justify",
    paddingVertical: 8,
  },
  firstLetter: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  updatedTime: {
    fontFamily: "Lora",
    fontStyle: "italic",
    fontSize: 14,
    textAlign: "right",
    marginTop: 8,
  },
});

export default BlogDetail;
