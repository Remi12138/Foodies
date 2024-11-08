import { useEffect, useState } from "react";
import { FlatList, StyleSheet, ActivityIndicator, Image } from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  DocumentReference,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Blog } from "@/zustand/blog";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";

function BlogCollectionView() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const firestore = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!user) return;
      try {
        const collectionRef = doc(firestore, `collections/${user.uid}`);
        const collectionSnap = await getDoc(collectionRef);

        if (collectionSnap.exists()) {
          const collectionData = collectionSnap.data();
          if (
            collectionData &&
            "blogs" in collectionData &&
            Array.isArray(collectionData.blogs)
          ) {
            const blogReferences: DocumentReference[] = collectionData.blogs;

            const blogPromises = blogReferences.map(async (blogRef) => {
              const blogSnap = await getDoc(blogRef);
              return blogSnap.exists()
                ? ({ id: blogSnap.id, ...blogSnap.data() } as Blog)
                : null;
            });

            const blogsData = await Promise.all(blogPromises);
            setBlogs(blogsData.filter((blog) => blog !== null) as Blog[]);
          }
        }
      } catch (error) {
        console.error("Error fetching user collections: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [user, firestore]);

  const renderItem = ({ item }: { item: Blog }) => (
    <ThemedView style={styles.rowContainer}>
      <Link href={`/community/blog?blogId=${item.id}&blogTitle=${item.title}`}>
        <ThemedView style={styles.card}>
          <Image source={{ uri: item.image_cover }} style={styles.image} />
          <ThemedView style={styles.textContainer}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText style={styles.rate}>Rate: {item.rate}</ThemedText>
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
      keyExtractor={(item) => item.id}
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
