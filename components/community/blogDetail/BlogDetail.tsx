import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useBlogStore, Blog } from "@/zustand/blog";
import { router } from "expo-router";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { ThemedView } from "@/components/ThemedView";
import BlogInfo from "./BlogInfo";
import {
  getFirestore,
  doc,
  getDoc,
  DocumentReference,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get("window");

function BlogDetail({ blogId }: { blogId: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fetchBlog = useBlogStore((state) => state.fetchBlog);
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBlogDetailsAndLikeStatus = async () => {
      try {
        const blogPromise = fetchBlog(blogId);
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
  }, [blogId, fetchBlog, user, firestore]);

  if (!blog) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  }

  const images = [blog.image_cover, ...blog.images];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <View style={styles.contentContainer}>
          <ThemedText style={styles.title}>{blog.title}</ThemedText>
          <BlogInfo blog={blog} isInitiallyLiked={isLiked} />
          <ThemedText style={styles.content}>
            <ThemedText style={styles.firstLetter}>
              {blog.content[0]}
            </ThemedText>
            {blog.content.substring(1)}
          </ThemedText>
        </View>
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
  container: {
    flex: 1,
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
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#000",
    marginHorizontal: 4,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
  },
  firstLetter: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default BlogDetail;
