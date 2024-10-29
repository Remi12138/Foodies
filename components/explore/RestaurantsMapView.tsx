import { useEffect, useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import MapView, { Marker, MapType } from "react-native-maps";
import { Restaurant } from "@/zustand/restaurant";
import { useLocation } from "@/zustand/location";

type Marker = {
  key: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
};

function extractLocations(restaurants: Restaurant[]): Marker[] {
  return restaurants.map((restaurant, index) => ({
    key: index.toString(),
    latitude: restaurant.coordinates.latitude,
    longitude: restaurant.coordinates.longitude,
    title: restaurant.name,
    description: `${restaurant.categories[0].alias} • ${restaurant.rating} ⭐`,
  }));
}

function RestaurantsMapView({ data }: { data: Restaurant[] }) {
  const [mapType, setMapType] = useState<MapType>("standard");
  const [markers, setMarkers] = useState<Marker[]>([]);
  const { userLocation, fetchLocation } = useLocation();
 
  console.log(data); 
  useEffect(() => {
    fetchLocation(); 
  }, [fetchLocation]);

  useEffect(() => {
    setMarkers(extractLocations(data));
  }, [data]); 
  // setMarkers(extractLocations(data));
  const center = { latitude: userLocation.latitude, longitude: userLocation.longitude }; // Central United States
  //const markers = extractLocations(data);
  //console.log(data);
  const toggleMapType = () => {
    setMapType((prevMapType) =>
      prevMapType === "standard" ? "satellite" : "standard"
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 25,
          longitudeDelta: 40,
        }}
        mapType={mapType}
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
