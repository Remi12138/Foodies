import { HelloWave } from "@/components/common/HelloWave";
import { Ionicons } from "@expo/vector-icons";

import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import ExploreBar from "@/components/explore/ExploreBar";
import RestaurantsView from "@/components/explore/RestaurantsView";
import {Restaurant,useRestaurantStore } from "@/zustand/restaurant";
import RestaurantsMapView from "@/components/explore/RestaurantsMapView";
import { useLocation } from "@/zustand/location";
import {router} from "expo-router";

interface FilterBarProps {
  restaurants: Restaurant[];
  onFilter: (filteredData: Restaurant[]) => void;
}

export default function ExploreScreen() {
  const [isMapView, setIsMapView] = useState(false);
  const [loading, setLoading] = useState(true);
  const fetchRestaurants = useRestaurantStore(
    (state) => state.fetchFakeRestaurants
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
    // handleGetLocation();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Updated userLocation in component:", userLocation);
      if (userLocation.latitude && userLocation.longitude) { 
        //await fetchRestaurants(userLocation); 
       // setFilteredRestaurants(restaurants);
        await fetchFakeRestaurants(); 
        setFilteredRestaurants(restaurants);
      }
    };
    fetchData();
  }, [userLocation]);

  // Retrieve restaurants from Zustand store
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);

  async function handleGetRestaurants() {
    // Show loading indicator
    setLoading(true);
    await fetchLocation();
    if (userLocation.latitude && userLocation.longitude) {
      //await fetchRestaurants(userLocation);
      await fetchFakeRestaurants();
    }
    console.log("userLocation", userLocation);
    // console.log(restaurants);
    setLoading(false);
  }
  const handleFilter = (filteredData: Restaurant[]) => {
    setFilteredRestaurants(filteredData);
  };

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
        <ExploreBar restaurants={restaurants} onFilter={handleFilter} />
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#000000"
            style={styles.loadingIndicator}
          />
        ) : isMapView ? (
          <RestaurantsMapView data={filteredRestaurants} router={router}/>
        ) : (
          <RestaurantsView data={filteredRestaurants} router={router} />
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
