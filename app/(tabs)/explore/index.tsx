import { HelloWave } from "@/components/common/HelloWave";
import { Ionicons } from "@expo/vector-icons";

import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  View,
  StatusBar,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import ExploreBar from "@/components/explore/ExploreBar";
import RestaurantsView from "@/components/explore/RestaurantsView";
import { Restaurant, useRestaurantStore } from "@/zustand/restaurant";
import RestaurantsMapView from "@/components/explore/RestaurantsMapView";
import { useLocation } from "@/zustand/location";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ExploreScreen() {
  const cardBackgroundColor = useThemeColor(
    { light: "#fff", dark: "#000" },
    "background"
  );

  const [isMapView, setIsMapView] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchRestaurants = useRestaurantStore(
    (state) => state.fetchRestaurants
  );
  const fetchFakeRestaurants = useRestaurantStore(
    (state) => state.fetchFakeRestaurants
  );
  const { userLocation, fetchLocation } = useLocation();
  const toggleMapView = () => {
    setIsMapView((prev) => !prev);
  };

  useEffect(() => {
    console.log("Fetching restaurants...");
    handleGetRestaurants();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Updated userLocation in component:", userLocation);
      if (userLocation.latitude && userLocation.longitude) {
        await fetchRestaurants(userLocation);
        setFilteredRestaurants(restaurants);
      }
    };
    fetchData();
  }, [userLocation]);

  const restaurants = useRestaurantStore((state) => state.restaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  async function handleGetRestaurants() {
    setLoading(true);
    await fetchLocation();
    if (userLocation.latitude && userLocation.longitude) {
      await fetchRestaurants(userLocation);
    }
    console.log("userLocation", userLocation);
    setLoading(false);
  }

  const handleFilter = (filteredData: Restaurant[]) => {
    setFilteredRestaurants(filteredData);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: cardBackgroundColor }]}
    >
      <ThemedView
        style={[
          styles.titleContainer,
          { backgroundColor: cardBackgroundColor },
        ]}
      >
        <ThemedView
          style={{ flexDirection: "row", backgroundColor: cardBackgroundColor }}
        >
          <ThemedText type="title">Explore</ThemedText>
          <HelloWave emoji="🏖" />
        </ThemedView>
        <TouchableOpacity style={styles.mapToggle} onPress={toggleMapView}>
          <ThemedText>
            <Ionicons name={isMapView ? "list" : "map-outline"} size={24} />
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={{ flex: 1, paddingTop: 60 }}>
        <View
          style={[
            styles.exploreBarContainer,
            { backgroundColor: cardBackgroundColor },
          ]}
        >
          <ExploreBar restaurants={restaurants} onFilter={handleFilter} />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000000"
            style={styles.loadingIndicator}
          />
        ) : isMapView ? (
          <RestaurantsMapView data={filteredRestaurants} router={router} />
        ) : (
          <RestaurantsView data={filteredRestaurants} router={router} />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerImage: {
    height: 199,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  titleContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapToggle: {
    padding: 8,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  exploreBarContainer: {
    position: "absolute",
    top: -5,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    backgroundColor: "#ffffff",
  },
});
