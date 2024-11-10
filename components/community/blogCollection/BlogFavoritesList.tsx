import { FlatList, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

import { BlogCover, useBlogStore } from "@/zustand/blog";

function BlogFavoritesList() {
  const { blogCollections } = useBlogStore();

  function renderItem({ item }: { item: BlogCover }) {
    return (
      <ThemedView style={styles.rowContainer}>
        <Link
          href={`/community/blog?authorUid=${item.author_id}&blogId=${item.blog_id}&blogTitle=${item.post_title}`}
        >
          <ThemedView style={styles.card}>
            <Image
              source={{ uri: item.post_image_cover }}
              style={styles.image}
            />
            <ThemedView style={styles.textContainer}>
              <ThemedText style={styles.title}>{item.post_title}</ThemedText>
              {/* <ThemedText style={styles.rate}>Rate: {item.rate}</ThemedText> */}
            </ThemedView>
          </ThemedView>
        </Link>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={blogCollections}
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
});

export default BlogFavoritesList;
