import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Link } from "expo-router";

import BlogCard from "@/components/community/BlogCard";
import { ThemedView } from "@/components/ThemedView";
import { BlogCover, useBlogStore } from "@/zustand/blog";
import { fetchBlogCovers } from "@/utils/blogs/covers";

function Blogs() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { blogCovers, setBlogCovers } = useBlogStore();

  useEffect(() => {
    onRetrieveBlogs();
  }, []);

  async function onRetrieveBlogs() {
    setLoading(true);
    const covers = await fetchBlogCovers();
    if (covers) setBlogCovers(covers);
    setLoading(false);
  }

  async function onRefresh() {
    setRefreshing(true);
    const covers = await fetchBlogCovers();
    if (covers) setBlogCovers(covers);
    setRefreshing(false);
  }

  function renderBlogCard({ item }: { item: BlogCover }) {
    return (
      <ThemedView style={styles.cardContainer}>
        <Link
          href={`/community/blog?authorUid=${item.author_uid}&blogId=${item.blog_id}&blogTitle=${item.post_title}`}
          style={{ flex: 1 }}
          asChild
        >
          <Pressable>
            <BlogCard item={item} />
          </Pressable>
        </Link>
      </ThemedView>
    );
  }

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={blogCovers}
      renderItem={renderBlogCard}
      keyExtractor={(item) => item.blog_id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    padding: 10,
    height: (Dimensions.get("window").width / 2) * 1.5,
    maxWidth: Dimensions.get("window").width / 2,
  },
});

export default Blogs;
