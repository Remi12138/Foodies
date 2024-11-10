import { useEffect, useState } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";

import { getAuth } from "firebase/auth";
import { fetchFavoriteBlogs } from "@/utils/blogs/favorites";
import BlogFavoritesList from "@/components/community/blogCollection/BlogFavoritesList";
import { useBlogStore } from "@/zustand/blog";

function BlogCollectionView() {
  const { setBlogCollections } = useBlogStore();
  const currentUser = getAuth().currentUser;
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchBlogCollections();
  }, []);

  const fetchBlogCollections = async () => {
    if (!currentUser) return;
    const blogFavorites = await fetchFavoriteBlogs(currentUser.uid);
    if (blogFavorites) setBlogCollections(blogFavorites);
    setLoading(false);
  };

  return !loading ? (
    <BlogFavoritesList />
  ) : (
    <ThemedView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BlogCollectionView;
