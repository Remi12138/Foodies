import { useEffect, useState } from "react";
import { StyleSheet, FlatList, RefreshControl, TouchableOpacity, View, Text } from "react-native";
import { Restaurant, useRestaurantStore } from "@/zustand/restaurant";
import RestaurantCard from "./RestaurantCard";
import React from "react";
import { useLocation } from "@/zustand/location";
import { useRouter } from "expo-router"; 

interface RestaurantsViewProps {
  data: Restaurant[];
}

function RestaurantsView({ data }: RestaurantsViewProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { userLocation, fetchLocation } = useLocation();
  const router = useRouter(); 

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const fetchFakeRestaurants = useRestaurantStore(
    (state) => state.fetchFakeRestaurants
  );
  const fetchRestaurants = useRestaurantStore(
    (state) => state.fetchRestaurants
  );


  const onRefresh = async () => {
    setRefreshing(true);
   // await fetchFakeRestaurants();
   await fetchRestaurants(userLocation);
    setRefreshing(false);
  };

  if (!userLocation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User location not available</Text>
      </View>
    );
  }

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => router.push(`/explore/${item.name}`)} 
    >
      <RestaurantCard item={item} />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderRestaurantCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 60,
  },
  cardContainer: {
    marginBottom: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default RestaurantsView;