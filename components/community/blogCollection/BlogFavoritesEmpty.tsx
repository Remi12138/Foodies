import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

function BlogFavoritesEmpty() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.emptyTextContainer}>
        <ThemedText style={styles.emptyText}>No favorite blogs</ThemedText>
      </ThemedView>
      <Link href="/community" style={styles.link}>
        <ThemedText style={styles.linkText}>Explore Posts</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTextContainer: {
    margin: 16,
  },
  emptyText: {
    fontFamily: "SpaceMonoB",
    fontSize: 24,
    padding: 16,
  },
  link: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#000",
  },
  linkText: {
    fontFamily: "SpaceMonoB",
    color: "#FFF",
    fontSize: 16,
  },
});

export default BlogFavoritesEmpty;
