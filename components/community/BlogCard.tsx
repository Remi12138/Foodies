import { Image, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { BlogCover } from "@/zustand/blog";
import { useCollectionStore } from "@/zustand/collections";
import { useEffect, useState } from "react";
import { checkIfBlogIsLikedLocal } from "@/utils/blogs/favorites";
import { useThemeColor } from "@/hooks/useThemeColor";

function BlogCard({ item }: { item: BlogCover }) {
  const { blogIds } = useCollectionStore();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Check if the blog is liked by the user
  useEffect(() => {
    setIsLiked(checkIfBlogIsLikedLocal(blogIds, item.blog_id));
  }, [blogIds]);

  const textColor = useThemeColor({}, "text");

  return (
    <ThemedView style={styles.card}>
      <ThemedView style={{ flex: 1 }}>
        <Image
          source={{ uri: item.post_image_cover }}
          style={styles.image}
          resizeMode="cover"
        />
      </ThemedView>
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {item.post_title}
        </ThemedText>
        <ThemedView style={styles.footerRow}>
          <ThemedView style={styles.authorContainer}>
            <Image
              source={
                item.author?.avatar !== ""
                  ? { uri: item.author?.avatar }
                  : require("@/assets/images/avatar-placeholder.jpg")
              }
              style={styles.authorAvatar}
            />
            <ThemedText style={styles.authorText}>
              {item.author.name}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.likeContainer}>
            <ThemedText style={styles.likesIcon}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={14}
                color={isLiked ? "#D1382C" : textColor}
              />
            </ThemedText>
            <ThemedText style={styles.likesCount}>
              {item.post_likes_count}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    flex: 1,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    flex: 1,
  },
  contentContainer: {
    width: "100%",
    height: 85,
    padding: 6,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 18,
    height: 48,
    overflow: "hidden",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorText: {
    fontFamily: "SpaceMono",
    fontSize: 12,
  },
  authorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 6,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesIcon: {
    marginRight: 4,
  },
  likesCount: {
    fontSize: 12,
  },
});

export default BlogCard;
