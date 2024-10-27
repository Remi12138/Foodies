import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

// Dummy data for foodies posts
const foodiePosts = [
  {
    id: "1",
    title: "The Best Pizza in New York",
    author: "John Doe",
    stars: 4.5,
  },
  {
    id: "2",
    title: "A Guide to Street Food in Bangkok",
    author: "Jane Smith",
    stars: 5,
  },
  {
    id: "3",
    title: "Top 10 Desserts in Paris",
    author: "Alice Johnson",
    stars: 4.8,
  },
  {
    id: "4",
    title: "Vegan Eats: Los Angeles Edition",
    author: "Mark Brown",
    stars: 4.3,
  },
  {
    id: "5",
    title: "Ultimate Sushi Spots in Tokyo",
    author: "Emily Davis",
    stars: 5,
  },
  {
    id: "6",
    title: "Coffee Lovers Guide to Seattle",
    author: "Michael Lee",
    stars: 4.7,
  },
];

function BlogCollectionView() {
  const renderItem = ({
    item,
  }: {
    item: { id: string; title: string; author: string; stars: number };
  }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>By: {item.author}</Text>
      <Text style={styles.stars}>Rating: {item.stars} stars</Text>
    </View>
  );

  return (
    <FlatList
      data={foodiePosts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 4,
  },
  stars: {
    fontSize: 14,
    color: "#666",
  },
});

export default BlogCollectionView;
