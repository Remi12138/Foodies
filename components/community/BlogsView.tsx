import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import BlogCard from "@/components/community/BlogCard";
import { Blog, useBlogStore } from "@/zustand/blog";
import { Link } from "expo-router";

function Blogs({ data }: { data: Blog[] }) {
  const [refreshing, setRefreshing] = useState(false);
  const fetchBlogs = useBlogStore((state) => state.fetchBlogs);

  const renderBlogCard = ({ item }: { item: Blog }) => (
    <View style={styles.cardContainer}>
      <Link href={`/community/blog?blogId=${item.id}&blogTitle=${item.title}`}>
        <BlogCard
          imageUrl={item.image_cover}
          title={item.title}
          author={item.author.first_name}
        />
      </Link>
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBlogs();
    setRefreshing(false);
  };

  return (
    <FlatList
      data={data}
      renderItem={renderBlogCard}
      keyExtractor={(item) => item.id}
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
  cardContainer: {
    flex: 1,
    margin: 10,
    maxWidth: (Dimensions.get("window").width - 40) / 2, // Adjust the width of the card
  },
});

export default Blogs;
