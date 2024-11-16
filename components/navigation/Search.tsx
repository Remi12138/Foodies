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
import { Restaurant } from "@/zustand/restaurant";
import { useLocation } from "@/zustand/location"; 

const fetchCoordinatesFromAddress = async (address: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      const location = data[0];
      console.log("Latitude:", location.lat, "Longitude:", location.lon);
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } else {
      throw new Error("No results found for this address.");
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
  const { userLocation, setLocation: setUserLocation, fetchLocation } = useLocation(); 

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    const regex = new RegExp(term, "i");
    const filteredData = restaurants.filter((restaurant) =>
      restaurant.name.match(regex) ||
      restaurant.location.displayAddress.join(", ").match(regex) ||
      restaurant.categories.some((cat) => cat.title.match(regex))
    );

    onFilter(filteredData);
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
        }); // 更新用户位置
        console.log("User location updated:", coordinates);

        if (!recentLocations.includes(location)) {
          setRecentLocations([location, ...recentLocations].slice(0, 5)); // 更新最近地址列表
        }

        setIsModalVisible(false); // 关闭 Modal
        Keyboard.dismiss(); // 关闭键盘
      } else {
        console.error("Could not fetch coordinates for the provided address.");
      }
    } catch (error) {
      console.error("Error occurred while fetching location:", error);
    }
  };

  const handleRecentLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    handleLocationSubmit(); 
  };

  const handleUseSystemLocation = async () => {
    try {
      await fetchLocation(); 
      setIsModalVisible(false); 
      console.log("System location used:", userLocation);
    } catch (error) {
      console.error("Error fetching system location:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Location</Text>

            <TextInput
              style={styles.locationInput}
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
              <Text style={styles.systemLocationText}>Use System Location</Text>
            </TouchableOpacity>

            <Text style={styles.recentTitle}>Recent Locations</Text>
            <FlatList
              data={recentLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleRecentLocationSelect(item)}
                  style={styles.recentItem}
                >
                  <FontAwesome name="map-marker" size={20} color="#F4511E" />
                  <Text style={styles.recentText}>{item}</Text>
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
    borderColor: "gray",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
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
