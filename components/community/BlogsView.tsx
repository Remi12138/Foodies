import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
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
      <View style={styles.cardContainer}>
        <Link
          href={`/community/blog?authorUid=${item.author_id}&blogId=${item.blog_id}&blogTitle=${item.post_title}`}
        >
          <BlogCard
            imageUrl={item.post_image_cover}
            title={item.post_title}
            authorName={item.author_name}
            likesCount={item.post_likes_count}
          />
        </Link>
      </View>
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
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
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
    margin: 10,
    maxWidth: (Dimensions.get("window").width - 40) / 2, // Adjust the width of the card
  },
});

export default Blogs;
