import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useRestaurantStore } from "@/zustand/restaurant";
import { useThemeColor } from "@/hooks/useThemeColor";

const RestaurantInfo = () => {
  const { key } = useLocalSearchParams();
  const restaurant = useRestaurantStore((state) =>
    state.restaurants.find((r) => r.id === key)
  );

  const cardBackgroundColor = useThemeColor({ light: "#fff", dark: "#333" }, "background");
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const mutedTextColor = useThemeColor({ light: "gray", dark: "#bbb" }, "mutedText");

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: textColor }]}>Restaurant not found</Text>
      </View>
    );
  }

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const formatTime = (time: string) => `${time.slice(0, 2)}:${time.slice(2)}`;

  return (
    <ScrollView style={[styles.container, { backgroundColor: cardBackgroundColor }]}>
      {/* Image */}
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      
      {/* Restaurant Name */}
      <Text style={[styles.name, { color: textColor }]}>{restaurant.name}</Text>
      
      {/* Categories */}
      <Text style={[styles.categories, { color: mutedTextColor }]}>
        {restaurant.categories.map((cat) => cat.title).join(", ")}
      </Text>
      
      {/* Price */}
      <Text style={[styles.price, { color: mutedTextColor }]}>Price: {restaurant.price}</Text>
      
      {/* Rating and Reviews */}
      <View style={styles.infoContainer}>
        <Text style={[styles.rating, { color: textColor }]}>Rating: {restaurant.rating} ★</Text>
        <Text style={[styles.reviewCount, { color: mutedTextColor }]}>
          {restaurant.reviewCount} Reviews
        </Text>
      </View>
      
      {/* Address Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Address</Text>
        <Text style={{ color: mutedTextColor }}>
          {restaurant.location.displayAddress.join(", ")}
        </Text>
      </View>
      
      {/* Phone Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Phone</Text>
        <Text style={{ color: mutedTextColor }}>{restaurant.displayPhone}</Text>
      </View>
      
      {/* Business Hours */}
      <View style={styles.section}>
        <View style={styles.businessHourHeader}>
          <MaterialIcons name="schedule" size={20} color="#F4511E" />
          <Text style={[styles.sectionTitle, { color: textColor, marginLeft: 8 }]}>
            Business Hours
          </Text>
        </View>
        {restaurant.businessHours[0]?.open.map((hours, index) => (
          <Text key={index} style={{ color: mutedTextColor }}>
            {daysOfWeek[hours.day]}: {formatTime(hours.start)} - {formatTime(hours.end)}
          </Text>
        ))}
        <Text
          style={{
            color: restaurant.businessHours[0]?.is_open_now ? "green" : "red",
            marginTop: 4,
          }}
        >
          {restaurant.businessHours[0]?.is_open_now ? "Open" : "Closed"}
        </Text>
      </View>
      
      {/* Yelp Button */}
      <TouchableOpacity
        style={styles.yelpButton}
        onPress={() => Linking.openURL(restaurant.url)}
      >
        <FontAwesome name="yelp" size={24} color="white" />
        <Text style={styles.yelpButtonText}>View on Yelp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  categories: {
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
  },
  reviewCount: {
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  businessHourHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  yelpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d32323",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  yelpButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
  },
});

export default RestaurantInfo;
