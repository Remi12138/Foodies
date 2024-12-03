import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRestaurantStore } from "@/zustand/restaurant";
import { useThemeColor } from "@/hooks/useThemeColor";
import { transformToRestaurant, Restaurant } from "@/zustand/restaurant";

const fetchRestaurantById = async (id: string): Promise<Restaurant | null> => {
  const url = `https://api.yelp.com/v3/businesses/${id}`;
  const apiKey =
    "-fn0ifdZSmgiv2Q90tLr4j6kt0I6mlVQEFvF-xrdqEpUmzyg_UkDPn0L1TkkLX0QZSdP2sw-4teU3BeP-0YoG21ro7bA4B4i4C8aNOt9KBPci1GFJCqkCr4_Nk5GZ3Yx";

  const opts = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 20 * 1000,
  };

  try {
    const response = await fetch(url, opts);
    if (response.ok) {
      const restaurantData = await response.json();
      const transformedRestaurant = transformToRestaurant(restaurantData);
      useRestaurantStore.getState().addRestaurant(transformedRestaurant); // Add to Zustand store
      return transformedRestaurant;
    } else {
      console.error(`HTTP Error: ${response.status}`);
      console.error("Error Details:", await response.text());
      return null;
    }
  } catch (error) {
    console.error("Error fetching restaurant by id:", error);
    return null;
  }
};

const RestaurantInfo = () => {
  const { key } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [canGoBack, setCanGoBack] = useState(true);

  const cardBackgroundColor = useThemeColor(
    { light: "#fff", dark: "#333" },
    "background"
  );
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const mutedTextColor = useThemeColor({ light: "gray", dark: "#bbb" }, "text");

  useEffect(() => {
    const fetchRestaurant = async () => {
      const foundRestaurant = useRestaurantStore
        .getState()
        .restaurants.find((r) => r.id === key);
      if (!foundRestaurant) {
        console.log(
          `Restaurant with ID ${key} not found locally. Fetching from API...`
        );
        setCanGoBack(false);
        const fetchedRestaurant = await fetchRestaurantById(key as string);
        setRestaurant(fetchedRestaurant);
      } else {
        setRestaurant(foundRestaurant);
      }
    };
    fetchRestaurant();
  });

  if (!restaurant) {
    return (
      <View
        style={[styles.container, { backgroundColor: cardBackgroundColor }]}
      >
        <Text style={[styles.errorText, { color: textColor }]}>
          Loading restaurant details...
        </Text>
      </View>
    );
  }

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const formatTime = (time: string) => `${time.slice(0, 2)}:${time.slice(2)}`;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cardBackgroundColor }]}
    >
      {/* Restaurant Image */}
      <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      <Text style={[styles.name, { color: textColor }]}>{restaurant.name}</Text>
      <Text style={[styles.categories, { color: mutedTextColor }]}>
        {restaurant.categories.map((cat) => cat.title).join(", ")}
      </Text>
      <Text style={[styles.price, { color: mutedTextColor }]}>
        Price: {restaurant.price}
      </Text>

      {/* Rating and Reviews */}
      <View style={styles.infoContainer}>
        <Text style={[styles.rating, { color: textColor }]}>
          Rating: {restaurant.rating} ★
        </Text>
        <Text style={[styles.reviewCount, { color: mutedTextColor }]}>
          {restaurant.reviewCount} Reviews
        </Text>
      </View>

      {/* Address */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Address</Text>
        <Text style={{ color: mutedTextColor }}>
          {restaurant.location.displayAddress.join(", ")}
        </Text>
      </View>

      {/* Phone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Phone</Text>
        <Text style={{ color: mutedTextColor }}>{restaurant.displayPhone}</Text>
      </View>

      {/* Business Hours */}
      <View style={styles.section}>
        <View style={styles.businessHourHeader}>
          <MaterialIcons name="schedule" size={20} color="#F4511E" />
          <Text
            style={[styles.sectionTitle, { color: textColor, marginLeft: 8 }]}
          >
            Business Hours
          </Text>
        </View>
        {restaurant.businessHours[0]?.open.map((hours, index) => (
          <Text key={index} style={{ color: mutedTextColor }}>
            {daysOfWeek[hours.day]}: {formatTime(hours.start)} -{" "}
            {formatTime(hours.end)}
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

      {/* Go back to Explore */}
      {!canGoBack && (
        <TouchableOpacity
          style={styles.yelpButton}
          onPress={() => router.push("/explore")}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
          <Text style={styles.yelpButtonText}>Go back to Explore</Text>
        </TouchableOpacity>
      )}
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
