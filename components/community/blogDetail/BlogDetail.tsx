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
import {
  getFirestore,
  doc,
  getDoc,
  DocumentReference,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import PostAuthorTool from "@/components/community/post/postAuthor/PostAuthorTool";
import { fetchPostRecord } from "@/utils/blogs/posts";
import { fetchUserPublicProfile } from "@/utils/users/info";
import { UserPublicProfile } from "@/zustand/user";

const { width } = Dimensions.get("window");

function BlogDetail({
  authorUid,
  blogId,
}: {
  authorUid: string;
  blogId: string;
}) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [authorPulicProfile, setAuthorPublicProfile] =
    useState<UserPublicProfile | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const firestore = getFirestore();
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
        const blogPromise = fetchPostRecord(authorUid, blogId);
        let isBlogLiked = false;

        if (user) {
          isBlogLiked = await checkIfBlogIsLiked(user.uid);
          if (isBlogLiked) {
            setIsLiked(true);
          }
        }

        const blog = await blogPromise;
        if (blog) {
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

  const images = [blog.post_image_cover, ...blog.post_images];
  const blogUpdatedTime = blog.updated_at as unknown as Timestamp;
  const formattedUpdatedTime = blogUpdatedTime
    .toDate()
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

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
          <ThemedText style={styles.title}>{blog.post_title}</ThemedText>
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
              {blog.post_content[0]}
            </ThemedText>
            {blog.post_content.substring(1)}
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

  async function checkIfBlogIsLiked(userId: string) {
    const collectionRef = doc(firestore, `collections/${userId}`);
    const collectionSnap = await getDoc(collectionRef);
    if (collectionSnap.exists()) {
      const collectionData = collectionSnap.data();
      if (
        collectionData &&
        "blogs" in collectionData &&
        Array.isArray(collectionData.blogs)
      ) {
        const blogReferences: DocumentReference[] = collectionData.blogs;
        return blogReferences.some((ref) => ref.id === blogId);
      }
    }
    return false;
  }
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
