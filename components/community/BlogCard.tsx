import { Image, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { UserPublicProfile } from "@/zustand/user";
function BlogCard({
  imageUrl,
  title,
  author,
  likesCount,
}: {
  imageUrl: string;
  title: string;
  author: UserPublicProfile;
  likesCount: number;
}) {
  return (
    <ThemedView style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </ThemedText>
        <ThemedView style={styles.footerRow}>
          <ThemedView style={styles.authorContainer}>
            <Image
              source={
                author?.avatar !== ""
                  ? { uri: author?.avatar }
                  : require("@/assets/images/avatar-placeholder.jpg")
              }
              style={styles.authorAvatar}
            />
            <ThemedText style={styles.authorText}>{author.name}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.likeContainer}>
            <ThemedText style={styles.likesIcon}>
              <Ionicons name="heart-outline" size={14} />
            </ThemedText>
            <ThemedText style={styles.likesCount}>{likesCount}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    borderWidth: 1,
    flex: 1,
  },
  image: {
    width: "100%",
    aspectRatio: 1 / 1,
  },
  contentContainer: {
    padding: 6,
    flex: 1,
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
    color: "#555",
  },
});

export default BlogCard;
