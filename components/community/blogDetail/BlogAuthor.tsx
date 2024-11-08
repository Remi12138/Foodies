import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { UserPublicProfile } from "@/zustand/user";

function BlogAuthor({ author }: { author: UserPublicProfile }) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.authorText}>
        {author.first_name} {author.last_name}
      </ThemedText>
      <TouchableOpacity style={styles.followButton}>
        <ThemedText style={styles.followButtonText}>Follow</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorText: {
    fontSize: 20,
  },
  followButton: {
    backgroundColor: "#000",
    paddingVertical: 2,
    paddingHorizontal: 12,
    marginLeft: 10, // Added margin to create space between author and follow button
  },
  followButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default BlogAuthor;
