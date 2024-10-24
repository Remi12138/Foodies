import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, MapType } from "react-native-maps";

export type MarkerData = {
  key: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
};

type InteractiveMapViewProps = {
  center: {
    latitude: number;
    longitude: number;
  };
  markers: MarkerData[];
  mapType?: MapType;
};

function InteractiveMapView({
  center,
  markers,
  mapType = "standard",
}: InteractiveMapViewProps) {
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

export default InteractiveMapView;
