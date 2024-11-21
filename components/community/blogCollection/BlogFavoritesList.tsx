import { useState } from "react";
import { FlatList, StyleSheet, Image, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

import { useCollectionStore } from "@/zustand/collections";
import { BlogCover } from "@/zustand/blog";
import { initBlogCollections } from "@/utils/blogs/favorites";
import { getAuth } from "firebase/auth";
import BlogFavoritesEmpty from "@/components/community/blogCollection/BlogFavoritesEmpty";

function BlogFavoritesList() {
  const { blogCovers } = useCollectionStore();
  const { setBlogIds, setBlogCovers } = useCollectionStore();
  const [refreshing, setRefreshing] = useState(false);

  const currentUser = getAuth().currentUser;

  function renderItem({ item }: { item: BlogCover }) {
    return (
      <ThemedView style={styles.rowContainer}>
        <Link
          href={`/community/blog?authorUid=${item.author_uid}&blogId=${item.blog_id}&blogTitle=${item.post_title}`}
          asChild
        >
          <Pressable>
            <ThemedView style={styles.card}>
              <Image
                source={{ uri: item.post_image_cover }}
                style={styles.image}
              />
              <ThemedView style={styles.textContainer}>
                <ThemedText style={styles.title}>{item.post_title}</ThemedText>
                <ThemedText style={styles.name}>{item.author.name}</ThemedText>
                <ThemedText style={styles.name}>
                  Liked by {item.post_likes_count} people.
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </Pressable>
        </Link>
      </ThemedView>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentUser) {
      await initBlogCollections(currentUser.uid, setBlogIds, setBlogCovers);
    }
    setRefreshing(false);
  };

  return (
    <>
      {blogCovers.length > 0 ? (
        <FlatList
          data={blogCovers}
          renderItem={renderItem}
          keyExtractor={(item) => item.blog_id}
          contentContainerStyle={styles.container}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <BlogFavoritesEmpty />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#FFF",
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
    borderWidth: 1,
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
  name: {
    fontSize: 14,
  },
});

export default BlogFavoritesList;
