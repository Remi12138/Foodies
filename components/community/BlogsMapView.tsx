import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, MapType } from "react-native-maps";
import { Blog } from "@/zustand/blog";

type Marker = {
  key: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
};

function extractLocations(blogs: Blog[]): Marker[] {
  return blogs.map((blog, index) => ({
    key: index.toString(),
    latitude: blog.location.lat,
    longitude: blog.location.lng,
    title: `Blog ${index + 1}`,
    description: `This is blog number ${index + 1}`,
  }));
}

function BlogsMapView({ data }: { data: Blog[] }) {
  const center = { latitude: 36.00325, longitude: -78.9411 }; // Central United States
  const mapType: MapType = "standard";
  const markers = extractLocations(data);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
});

export default BlogsMapView;
