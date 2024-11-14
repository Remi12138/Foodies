import { useEffect, useState } from "react";
import { StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { Restaurant, useRestaurantStore } from "@/zustand/restaurant";
import RestaurantCard from "./RestaurantCard";
import React from "react";
import { useLocation } from "@/zustand/location";
import { useRouter } from "expo-router"; // 导入 useRouter 钩子

interface RestaurantsViewProps {
  data: Restaurant[];
}

function RestaurantsView({ data }: RestaurantsViewProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { userLocation, fetchLocation } = useLocation();
  const router = useRouter(); // 初始化 router

  const fetchFakeRestaurants = useRestaurantStore(
    (state) => state.fetchFakeRestaurants
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFakeRestaurants();
    setRefreshing(false);
  };

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => router.push(`/explore/${item.name}`)} // 导航到餐厅详情页面
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
    marginTop: 60, // 添加 marginTop 以向下移动列表
  },
  cardContainer: {
    marginBottom: 10,
  },
});

export default RestaurantsView;