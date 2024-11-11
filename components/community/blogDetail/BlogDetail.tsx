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
import { fetchUserPublicProfile } from "@/utils/users/info";
import { checkIfBlogIsLikedLocal } from "@/utils/blogs/favorites";
import { UserPublicProfile } from "@/zustand/user";
import { useCollectionStore } from "@/zustand/collections";
import { formatBlogUpdatedTime } from "@/utils/blogs/info";

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
  const [authorPulicProfile, setAuthorPublicProfile] =
    useState<UserPublicProfile | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      const authorProfile = await fetchUserPublicProfile(authorUid);
      if (authorProfile) {
        setAuthorPublicProfile(authorProfile);
      }
    };
    fetchAuthorProfile();
  }, [authorUid]);

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

  const images = [blog.post.image_cover, ...blog.post.images];
  const blogUpdatedTime = blog.updated_at as unknown as Timestamp;
  const formattedUpdatedTime = formatBlogUpdatedTime(blogUpdatedTime);

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.sliderImage} />
            )}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentIndex(newIndex);
            }}
          />
          <ThemedView style={styles.paginationContainerCloser}>
            {images.map((_, index) => (
              <ThemedView
                key={index}
                style={[
                  styles.dot,
                  { opacity: currentIndex === index ? 1 : 0.4 },
                ]}
              />
            ))}
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.contentContainer}>
          <ThemedText style={styles.title}>{blog.post.title}</ThemedText>
          <BlogInfo
            blogId={blog.id}
            authorPublicProfile={authorPulicProfile}
            isInitiallyLiked={isLiked}
          />
          {user && user.uid === authorUid && (
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
  paginationContainerCloser: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#000",
    marginHorizontal: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: "Times New Roman",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "left",
  },
  content: {
    fontFamily: "Times New Roman",
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
    fontFamily: "Times New Roman",
    fontStyle: "italic",
    fontSize: 14,
    textAlign: "right",
    marginTop: 8,
  },
});

export default BlogDetail;
