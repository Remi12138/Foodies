import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.footerRow}>
        <Text style={styles.author}>by {author}</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 150,
  },
  title: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  author: {
    fontSize: 14,
    color: "#555",
  },
});

export default BlogCard;
