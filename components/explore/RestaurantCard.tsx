import { StyleSheet, Image } from "react-native";
import { Restaurant } from "@/zustand/restaurant";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import React from "react";

function RestaurantCard({ item }: { item: Restaurant }) {
  return (
    <ThemedView style={styles.cardContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <ThemedView style={styles.textContainer}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.location}>
          {item.location.city}, {item.location.state}
        </ThemedText>
        <ThemedText style={styles.priceRange}>{item.price}</ThemedText> 
      </ThemedView>
      <ThemedView>
        <ThemedText style={styles.cuisineRating}>
          {item.categories[0].alias} • {item.rating} ⭐
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  location: {
    fontSize: 14,
    color: "#555",
  },
  cuisineRating: {
    top: "-25%",
    fontSize: 14,
    color: "#777",
  },
  priceRange: {
    fontSize: 14,
    color: "#333",
  },
});

export default RestaurantCard;
