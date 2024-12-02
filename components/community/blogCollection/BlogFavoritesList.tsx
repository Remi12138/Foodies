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
import { useThemeColor } from "@/hooks/useThemeColor";

function BlogFavoritesList() {
  const { blogCovers } = useCollectionStore();
  const { setBlogIds, setBlogCovers } = useCollectionStore();
  const [refreshing, setRefreshing] = useState(false);

  const currentUser = getAuth().currentUser;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  function renderItem({ item }: { item: BlogCover }) {
    return (
      <ThemedView style={styles.rowContainer}>
        <Link
          href={`/community/blog?authorUid=${item.author_uid}&blogId=${item.blog_id}&blogTitle=${item.post_title}`}
          asChild
        >
          <Pressable>
            <ThemedView style={[styles.card, { borderColor: textColor }]}>
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
          contentContainerStyle={[styles.listContent, { backgroundColor }]}
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
  listContent: {
    padding: 16,
    flexGrow: 1, // Ensures that the FlatList can grow and be scrollable
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
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
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
