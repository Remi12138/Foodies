import { Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../ThemedView";

function BlogCard({
  imageUrl,
  title,
  author,
}: {
  imageUrl: string;
  title: string;
  author: string;
}) {
  return (
    <ThemedView style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <ThemedView style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <ThemedView style={styles.footerRow}>
          <Text style={styles.author}>by {author}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="red" />
          </TouchableOpacity>
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
    padding: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    flex: 1, // allows title to take proportional space if more space is available
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 14,
    color: "#555",
  },
});

export default BlogCard;
