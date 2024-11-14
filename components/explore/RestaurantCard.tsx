import { StyleSheet, Image, View } from "react-native";
import { Restaurant } from "@/zustand/restaurant";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import React from "react";

function RestaurantCard({ item }: { item: Restaurant }) {
  const imageUrl = item.imageUrl && item.imageUrl.trim() !== "" ? { uri: item.imageUrl } : require('@/assets/images/default_location.png'); // 判断 imageUrl 是否为空字符串

  return (
    <ThemedView style={styles.cardContainer}>
      <Image source={imageUrl} style={styles.image} />
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.location}>
          {item.location.city}, {item.location.state}
        </ThemedText>
        <ThemedText style={styles.priceRange}>{item.price}</ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.cuisineRating}>
          {item.categories[0].title} • {item.rating} ⭐
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  priceRange: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  cuisineRating: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default RestaurantCard;