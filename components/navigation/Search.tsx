import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocation } from "@/zustand/location"; 

interface SearchProps {
  restaurants: any[];
  onFilter: (filteredData: any[]) => void;
}

const Search: React.FC<SearchProps> = ({ restaurants, onFilter }) => {
  const { setLocation } = useLocation(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocationName] = useState("Los Angeles, CA"); 
  const [showDefaultLocationBox, setShowDefaultLocationBox] = useState(false); 
  const [showLocationInput, setShowLocationInput] = useState(false); 
  const [recentLocations, setRecentLocations] = useState<string[]>([
    "Los Angeles, CA",
    "Durham, NC",
    "Chapel Hill, NC",
    "Raleigh, NC",
    "Carrboro, NC",
    "Research Triangle, Durham, NC",
    "Morrisville, NC",
  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const regex = new RegExp(term, "i");
    interface Restaurant {
      name: string;
      location: {
        displayAddress: string[];
      };
      categories: {
        title: string;
      }[];
    }

    const filteredData = restaurants.filter((restaurant: Restaurant) =>
      restaurant.name.match(regex) ||
      restaurant.location.displayAddress.join(", ").match(regex) ||
      restaurant.categories.some((cat) => cat.title.match(regex))
    );
    onFilter(filteredData);
  };

  const fetchCoordinatesFromAddress = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "YourAppName/1.0 (your-email@example.com)", 
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (Array.isArray(data) && data.length > 0) {
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


  const handleLocationSubmit = async () => {
    const coordinates = await fetchCoordinatesFromAddress(location);
    if (coordinates) {
      setLocation(coordinates); 
      if (!recentLocations.includes(location)) {
        setRecentLocations([location, ...recentLocations].slice(0, 7)); 
      }
      setShowLocationInput(false); 
      Keyboard.dismiss(); 
    }
  };


  const handleRecentLocationSelect = (selectedLocation: string) => {
    setLocationName(selectedLocation);
    handleLocationSubmit();
  };

  const handleDismiss = () => {
    setShowDefaultLocationBox(false); 
    setShowLocationInput(false); 
    Keyboard.dismiss(); 
  };

  const handleDefaultLocationBoxPress = () => {
    setShowDefaultLocationBox(false); 
    setShowLocationInput(true); 
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          value={searchTerm}
          onChangeText={handleSearch}
          onFocus={() => {
            setShowDefaultLocationBox(true); 
            setShowLocationInput(false); 
          }}
        />

        {showDefaultLocationBox && (
          <TouchableOpacity onPress={handleDefaultLocationBoxPress} style={styles.locationBox}>
            <FontAwesome name="map-marker" size={16} color='#F4511E' />
            <Text style={styles.locationText}>{location}</Text>
          </TouchableOpacity>
        )}

        {showLocationInput && (
          <TextInput
            style={styles.locationInput}
            placeholder="Enter location..."
            value={location}
            onChangeText={setLocationName}
            onSubmitEditing={handleLocationSubmit} 
          />
        )}

        {showLocationInput && (
          <View style={styles.recentLocationContainer}>
            <FlatList
              data={recentLocations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleRecentLocationSelect(item)} style={styles.locationItem}>
                  <FontAwesome name="location-arrow" size={20} color='#F4511E' style={styles.locationIcon} />
                  <Text style={styles.locationText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 10,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  locationInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
    marginBottom: 10,
  },
  recentLocationContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingVertical: 10,
    position: 'absolute',
    top: 100,
    width: '100%',
    zIndex: 1,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
});

export default Search;
