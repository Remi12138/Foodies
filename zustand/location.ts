import { create } from "zustand";
import * as Location from 'expo-location';



export interface userLocation {
    latitude: number;
    longitude: number;
}
type LocationState = {
    userLocation: userLocation;
    fetchLocation: () => Promise<void>;
};

const getLocation = async (): Promise<Location.LocationObject> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        throw new Error("Permission to access location was denied");
    }

    const location = await Location.getCurrentPositionAsync({});
    //console.log("Location:", location);
    return location;
}


export const useLocation = create<LocationState>((set) => ({
    userLocation: { latitude: 0, longitude: 0 },
    fetchLocation: async () => {
        try {
            const location = await getLocation();
            set(() => ({
                userLocation: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }
            }));
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    },
}));