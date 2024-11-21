import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import MapView, { Marker, MapType, Region } from "react-native-maps";
import { useLocation } from "@/zustand/location";
import { Restaurant } from "@/zustand/restaurant";
import { useRouter } from "expo-router";

interface RestaurantsMapViewProps {
  data: Restaurant[];
}

type Marker = {
  key: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
};

function extractLocations(restaurants: Restaurant[]): Marker[] {
  return restaurants
    .filter(
      (restaurant) =>
        restaurant.coordinates &&
        restaurant.coordinates.latitude !== undefined &&
        restaurant.coordinates.longitude !== undefined
    )
    .map((restaurant, index) => ({
      key: index.toString(),
      latitude: Number(restaurant.coordinates.latitude),
      longitude: Number(restaurant.coordinates.longitude),
      title: restaurant.name,
      description: `${restaurant.categories[0].title} • ${restaurant.rating} ⭐`,
    }));
}

// 计算餐厅的中心位置
function calculateCenter(restaurants: Restaurant[]): { latitude: number; longitude: number } {
  if (restaurants.length === 0) {
    // 设置默认中心位置为旧金山
    return { latitude: 37.7749, longitude: -122.4194 };
  }

  const totalLat = restaurants.reduce((sum, restaurant) => sum + Number(restaurant.coordinates.latitude), 0);
  const totalLon = restaurants.reduce((sum, restaurant) => sum + Number(restaurant.coordinates.longitude), 0);

  return {
    latitude: totalLat / restaurants.length,
    longitude: totalLon / restaurants.length,
  };
}

function RestaurantsMapView({ data }: RestaurantsMapViewProps) {
  const [mapType, setMapType] = useState<MapType>("standard");
  const [markers, setMarkers] = useState<Marker[]>([]);
  const router = useRouter();

  useEffect(() => {
    const validMarkers = extractLocations(data);
    setMarkers(validMarkers);

    const center = calculateCenter(data);
    console.log("Center location for map:", center);
  }, [data]);

  const center = data.length ? calculateCenter(data) : { latitude: 37.7749, longitude: -122.4194 };

  const toggleMapType = () => {
    setMapType((prevMapType) => (prevMapType === "standard" ? "satellite" : "standard"));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        mapType={mapType}
        showsUserLocation={true} // 显示用户当前位置
      >
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => router.push(`/explore/${marker.title}`)} // 跳转到动态路由
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title={mapType.toString()} onPress={toggleMapType} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    position: "absolute",
    width: "25%",
    bottom: 20,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});

export default RestaurantsMapView;
