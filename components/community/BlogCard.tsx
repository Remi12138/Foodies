import { Image, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Timestamp } from "firebase/firestore";

function BlogCard({
  imageUrl,
  title,
  author,
  date,
}: {
  imageUrl: string;
  title: string;
  author: string;
  date: Timestamp;
}) {
  return (
    <ThemedView style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </ThemedText>
        <ThemedView style={styles.footerRow}>
          <ThemedText style={styles.author}>{author}</ThemedText>
          <ThemedText style={styles.author}>
            {date.toDate().toLocaleDateString()}
          </ThemedText>
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
  author: {
    fontSize: 12,
    color: "#555",
  },
});

export default BlogCard;
