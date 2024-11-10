import { useEffect, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator, Image } from "react-native";
import { doc, getDoc, DocumentReference } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { BlogCover } from "@/zustand/blog";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { FIREBASE_DB } from "@/firebaseConfig";

function BlogCollectionView() {
  const [blogs, setBlogs] = useState<BlogCover[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentUser = getAuth().currentUser;

  useEffect(() => {
    const fetchCollections = async () => {
      if (!currentUser) return;
      try {
        const collectionRef = doc(
          FIREBASE_DB,
          "users",
          currentUser.uid,
          "collections",
          "blogs"
        );
        const collectionDoc = await getDoc(collectionRef);

        if (collectionDoc.exists()) {
          const collectionData = collectionDoc.data();
          console.log("collectionData: ", collectionData);
          const blogReferences: DocumentReference[] = collectionData.favorites;

          const blogPromises = blogReferences.map(async (blogRef) => {
            const blogSnap = await getDoc(blogRef);
            return blogSnap.exists()
              ? ({ blog_id: blogSnap.id, ...blogSnap.data() } as BlogCover)
              : null;
          });

          const blogsData = await Promise.all(blogPromises);
          setBlogs(blogsData.filter((blog) => blog !== null) as BlogCover[]);
        }
      } catch (error) {
        console.error("Error fetching user collections: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [currentUser]);

  const renderItem = ({ item }: { item: BlogCover }) => (
    <ThemedView style={styles.rowContainer}>
      <Link
        href={`/community/blog?authorUid=${item.author_id}&blogId=${item.blog_id}&blogTitle=${item.post_title}`}
      >
        <ThemedView style={styles.card}>
          <Image source={{ uri: item.post_image_cover }} style={styles.image} />
          <ThemedView style={styles.textContainer}>
            <ThemedText style={styles.title}>{item.post_title}</ThemedText>
            {/* <ThemedText style={styles.rate}>Rate: {item.rate}</ThemedText> */}
          </ThemedView>
        </ThemedView>
      </Link>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={blogs}
      renderItem={renderItem}
      keyExtractor={(item) => item.blog_id}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  rowContainer: {
    width: "100%",
    marginBottom: 12,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    padding: 8,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  rate: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BlogCollectionView;
