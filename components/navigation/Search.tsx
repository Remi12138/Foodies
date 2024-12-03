import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Restaurant,useRestaurantStore } from "@/zustand/restaurant";
import { useLocation } from "@/zustand/location"; 
import * as Location from 'expo-location';
import { transformToRestaurant } from "@/zustand/restaurant";
import { useThemeColor } from "@/hooks/useThemeColor";
const addRestaurant = useRestaurantStore.getState().addRestaurant;
const fetchCoordinatesFromAddress = async (address: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      const location = data[0];
      console.log("Latitude:", location.lat, "Longitude:", location.lon);
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } 
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
};

interface SearchProps {
  openLocatorDialog: () => void;
  restaurants: Restaurant[];
  onFilter: (filteredData: Restaurant[]) => void;
}

const Search: React.FC<SearchProps> = ({ openLocatorDialog, restaurants, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("Default Location");
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [recentLocations, setRecentLocations] = useState<string[]>([
    "Los Angeles, CA",
    "Durham, NC",
    "Chapel Hill, NC",
    "Raleigh, NC",
    "San Francisco, CA",
  ]); 
  const { userLocation, setLocation: setUserLocation } = useLocation(); 
  const cardBackgroundColor = useThemeColor({ light: "#fff", dark: "#000" }, "background");
  const cardTextColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");
  const borderColor = useThemeColor({ light: "gray", dark: "#666" }, "background");
  const modalBackgroundColor = useThemeColor({ light: "white", dark: "#333" }, "background");
  const modalOverlayColor = useThemeColor({ light: "rgba(0, 0, 0, 0.5)", dark: "rgba(255, 255, 255, 0.1)" }, "background");
     
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
  
    const regex = new RegExp(term, "i");
    let filteredData = restaurants.filter(
      (restaurant) =>
        restaurant.name.match(regex) ||
        restaurant.location.displayAddress.join(", ").match(regex) ||
        restaurant.categories.some((cat) => cat.title.match(regex))
    );
  
    const postRequestData = async (term:string,url: string, latitude: number, longitude: number) => {
      // Construct URLSearchParams
      const params = new URLSearchParams({
        term: term, // Fixed search term
        latitude: latitude.toString(), // User's current latitude
        longitude: longitude.toString(), // User's current longitude
        radius: "10000", // Search radius in meters
        limit: "10", // Limit results to 10
      });
  
      // Construct full URL
      const fullUrl = `${url}?${params.toString()}`;
      const apiKey =
        "-fn0ifdZSmgiv2Q90tLr4j6kt0I6mlVQEFvF-xrdqEpUmzyg_UkDPn0L1TkkLX0QZSdP2sw-4teU3BeP-0YoG21ro7bA4B4i4C8aNOt9KBPci1GFJCqkCr4_Nk5GZ3Yx";
      // Request options
      const opts = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`, // Add "Bearer " before the API key
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 20 * 1000, // Set timeout for 20 seconds
      };
  
      try {
        // Perform the fetch request
        const response = await fetch(fullUrl, opts);
        if (response.ok) {
          const responseJson = await response.json();
          console.log("Response Code:", responseJson.code);
          console.log("Response Message:", responseJson.message);
          console.log("Restaurant Data:", responseJson.businesses); // Yelp returns 'businesses'
          // Process the API response into a format compatible with `filteredData`
          const apiFilteredData = responseJson.businesses.map(transformToRestaurant);
  
          // Add the API data to the top of the existing filteredData
          const updatedData = [...apiFilteredData];
          onFilter(updatedData); // Call onFilter with the updated data
  
          // Update Zustand store with the new restaurants
          apiFilteredData.forEach((restaurant: Restaurant) => {
            addRestaurant(restaurant); // Add one by one
          });
  
          console.log("Added restaurants to zustand store and updated UI with API data");
        } else {
          // Log detailed error response
          const errorResponse = await response.text();
          console.error(`HTTP Error: ${response.status}`);
          console.error("Error Details:", errorResponse);
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }
    };
  
    // Example Usage
    const apiUrl = "https://api.yelp.com/v3/businesses/search"; // Replace with correct API endpoint
    // const latitude = 36.019; // Replace with actual latitude
    // const longitude = -78.94836; // Replace with actual longitude
  
    if (filteredData.length === 0 && term.trim() !== "") {
      // If no local match, fetch from API
      await postRequestData(term,apiUrl, userLocation.latitude, userLocation.longitude);
    } else {
      // If local match exists, show it directly
      onFilter(filteredData);
    }
  };
  


  const handleLocationSubmit = async () => {
    try {
      if (!location.trim()) {
        console.warn("Location input is empty.");
        return;
      }

      const coordinates = await fetchCoordinatesFromAddress(location);
      if (coordinates) {
        setUserLocation({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }); 
        console.log("User location updated:", coordinates);

        if (!recentLocations.includes(location)) {
          setRecentLocations([location, ...recentLocations].slice(0, 5)); // Update recent locations list
        }

        setIsModalVisible(false); 
        Keyboard.dismiss(); 
      } 
    } catch (error) {
      console.error("Error occurred while fetching location:", error);
    }
  };

  const handleRecentLocationSelect = async (selectedLocation: string) => {
    setLocation(selectedLocation);
    //await handleLocationSubmit();
  };

  const handleUseSystemLocation = async () => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
  
      // Fetch the current position
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
  
      // Update the user's location in the Zustand store
      setUserLocation({ latitude, longitude });
  
      console.log('System location used:', { latitude, longitude });
  
      // Close the modal
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to fetch system location:', error);
    }
  };
  
  

  return (
    <View style={[
      styles.container,
      { backgroundColor: cardBackgroundColor },
    ]}>
      <View style={[
      styles.searchContainer,
      { borderColor: borderColor },
    ]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor={cardTextColor}
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsModalVisible(true)}
        >
          <FontAwesome name="map-marker" size={24} color="#F4511E" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[
      styles.modalOverlay,
      { backgroundColor: modalOverlayColor },
    ]}>
          <View style={[
      styles.modalContent,
      { backgroundColor: modalBackgroundColor },
    ]}>
            <Text style={[
      styles.modalTitle,
      { color: cardTextColor },
    ]}>Set Location</Text>

            <TextInput
              style={[
                styles.locationInput,
                { color: cardTextColor },
              ]}
              placeholder="Enter location..."
              value={location}
              onChangeText={setLocation}
              onSubmitEditing={handleLocationSubmit}
            />

            <TouchableOpacity
              onPress={handleUseSystemLocation}
              style={styles.systemLocationContainer}
            >
              <FontAwesome name="location-arrow" size={20} color="#F4511E" />
              <Text style={[
      styles.systemLocationText,
      { color: cardTextColor },
    ]}>Use System Location</Text>
            </TouchableOpacity>

            <Text style={[
      styles.recentTitle,
      { color: cardTextColor },
    ]}>Recent Locations</Text>
            <FlatList
              data={recentLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleRecentLocationSelect(item)}
                  style={styles.recentItem}
                >
                  <FontAwesome name="map-marker" size={20} color="#F4511E" />
                  <Text style={[
      styles.recentText,
      { color: cardTextColor },
    ]}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Modal Footer Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLocationSubmit}>
                <Text style={styles.submitButton}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    position: "relative", 
    flexDirection: "row",
    alignItems: "center",
    //borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  iconButton: {
    padding: 10,
  },
  iconInsideSearch: {
    position: "absolute",
    right: 60, 
    top: "50%", 
    transform: [{ translateY: -10 }], 
  
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
   // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
   // backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  locationInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 10,
  },
  systemLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  systemLocationText: {
    fontSize: 16,
    color: "#F4511E",
    marginLeft: 8,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  recentText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    fontSize: 16,
    color: "#ff3b30",
  },
  submitButton: {
    fontSize: 16,
    color: "#007aff",
  },
});

export default Search;
