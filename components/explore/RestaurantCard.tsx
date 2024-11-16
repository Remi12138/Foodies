import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Restaurant } from "@/zustand/restaurant";
import { FontAwesome } from "@expo/vector-icons";

function RestaurantCard({ item }: { item: Restaurant }) {
  const imageUrl =
    item.imageUrl && item.imageUrl.trim() !== ""
      ? { uri: item.imageUrl }
      : require("@/assets/images/default_location.png");

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(<FontAwesome key={i} name="star" size={14} color="#FFD700" />);
    }
    return stars;
  };

  return (
    <View style={styles.cardContainer}>
      {/* Image Section */}
      <Image source={imageUrl} style={styles.image} />

      {/* Text Content */}
      <View style={styles.textContainer}>
        {/* Name */}
        <Text style={styles.name}>{item.name}</Text>

        {/* Ratings */}
        <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>

        {/* Location */}
        <Text style={styles.location}>
          {item.location.city}, {item.location.state}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center", // Center align text below the image
  },
  image: {
    width: "100%",
    height: 200, // Increased image size
    resizeMode: "cover",
  },
  textContainer: {
    padding: 10,
    alignItems: "center", // Center align text
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
});

export default RestaurantCard;
