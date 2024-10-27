import { HelloWave } from "@/components/common/HelloWave";
import { Ionicons } from "@expo/vector-icons";

import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import ExploreBar from "@/components/explore/ExploreBar";
import RestaurantsView from "@/components/explore/RestaurantsView";
import { useRestaurantStore } from "@/zustand/restaurant";
import RestaurantsMapView from "@/components/explore/RestaurantsMapView";

export default function ExploreScreen() {
  const [isMapView, setIsMapView] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchRestaurants = useRestaurantStore(
    (state) => state.fetchFakeRestaurants
  );

  const toggleMapView = () => {
    setIsMapView((prev) => !prev);
  };

  useEffect(() => {
    handleGetRestaurants();
  }, []);

  // Retrieve restaurants from Zustand store
  const restaurants = useRestaurantStore((state) => state.restaurants);

  async function handleGetRestaurants() {
    // Show loading indicator
    setLoading(true);
    await fetchRestaurants();
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedView style={{ flexDirection: "row" }}>
          <ThemedText type="title">Explore</ThemedText>
          <HelloWave emoji="🏖" />
        </ThemedView>
        <TouchableOpacity style={styles.mapToggle} onPress={toggleMapView}>
          <ThemedText>
            <Ionicons name={isMapView ? "list" : "map-outline"} size={24} />
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={{ flex: 1 }}>
        <ExploreBar />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000000"
            style={styles.loadingIndicator}
          />
        ) : isMapView ? (
          <RestaurantsMapView data={restaurants} />
        ) : (
          <RestaurantsView data={restaurants} />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
