import { useState } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import { Restaurant, useRestaurantStore } from "@/zustand/restaurant";
import RestaurantCard from "./RestaurantCard";
import React from "react";

function Restaurants({ data }: { data: Restaurant[] }) {
  const [refreshing, setRefreshing] = useState(false);
  const fetchFakeRestaurants = useRestaurantStore(
    (state) => state.fetchFakeRestaurants//update
  );
 const fetchRestaurants = useRestaurantStore(
    (state) => state.fetchRestaurants
  );
  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <RestaurantCard item={item} />
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRestaurants();
    await fetchFakeRestaurants();
    setRefreshing(false);
  };

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
  },
});

export default Restaurants;
