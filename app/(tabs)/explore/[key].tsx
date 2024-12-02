import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useRestaurantStore } from "@/zustand/restaurant";

const RestaurantInfo = () => {
  const { key } = useLocalSearchParams(); 
  console.log(key);
  const restaurant = useRestaurantStore((state) =>
    state.restaurants.find((r) => r.id === key)
  );

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }
  console.log(restaurant.businessHours);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const formatTime = (time: string) => `${time.slice(0, 2)}:${time.slice(2)}`;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.categories}>
        {restaurant.categories.map((cat) => cat.title).join(", ")}
      </Text>
      <Text style={styles.price}>Price: {restaurant.price}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.rating}>Rating: {restaurant.rating} ★</Text>
        <Text style={styles.reviewCount}>{restaurant.reviewCount} Reviews</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <Text>{restaurant.location.displayAddress.join(", ")}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone</Text>
        <Text>{restaurant.displayPhone}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Hours</Text>
        {restaurant.businessHours[0]?.open.map((hours, index) => (
          <Text key={index}>
            {daysOfWeek[hours.day]}: {formatTime(hours.start)} - {formatTime(hours.end)}
          </Text>
        ))}
        <Text style={{ color: restaurant.businessHours[0]?.is_open_now ? "green" : "red" }}>
          {restaurant.businessHours[0]?.is_open_now ? "Open" : "Closed"}
        </Text>
      </View>
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
    backgroundColor: "#ffffff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  categories: {
    fontSize: 16,
    color: "gray",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    color: "gray",
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  rating: {
    fontSize: 16,
  },
  reviewCount: {
    fontSize: 16,
    color: "gray",
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
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
    color: "red",
  },
});

export default RestaurantInfo;