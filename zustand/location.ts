import { create } from "zustand";
import * as Location from "expo-location";

export interface userLocation {
  latitude: number;
  longitude: number;
}
type LocationState = {
  userLocation: userLocation;
  setLocation: (userLocation: userLocation) => void;
  fetchLocation: () => Promise<void>;
};
let hasFetchedLocation = false;
let cachedLocation: Location.LocationObject | null = null;

const getLocation = async (): Promise<Location.LocationObject> => {
    if (hasFetchedLocation) {
      console.log("Returning cached location:", cachedLocation);
      if (cachedLocation) {
        return cachedLocation; // Return the cached location if it exists
      } else {
        throw new Error("No cached location available.");
      }
    }
  
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }
  
    const location = await Location.getCurrentPositionAsync({});
    console.log("Fetched new location:", location);
    hasFetchedLocation = true;
    cachedLocation = location; // Cache the new location
    return location;
  };
  

export const useLocation = create<LocationState>((set) => ({
  userLocation: { latitude: 0, longitude: 0 },
  setLocation: (userLocation: userLocation) => {
    cachedLocation = {
      coords: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    } as Location.LocationObject; // Update the cache
    set(() => ({ userLocation }));
  },
  fetchLocation: async () => {
    try {
      const location = await getLocation();
      console.log("Location:", location);
      set(() => ({
        userLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  },
}));
