import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import {
  Modal,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchYelpBusinesses } from "@/utils/blogs/restaurant";
import { useTheme } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

interface PostResPickerProps {
  onRestaurantSelect: (restaurant: { id: string; name: string }) => void;
}

function PostResPicker({ onRestaurantSelect }: PostResPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    const response = await searchYelpBusinesses(query, "-73.99429", "40.70544");
    if (response.businesses) {
      setRestaurants(response.businesses);
    }
  };

  const handleRestaurantSelect = (restaurant: { id: string; name: string }) => {
    console.log("Selected Restaurant:", restaurant);
    onRestaurantSelect(restaurant); // Call the callback with the selected restaurant
    setModalVisible(false);
  };

  const textColor = useThemeColor({}, "text");

  return (
    <ThemedView>
      <Button title="Pick a Restaurant" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <ThemedView
          style={{ flex: 1, justifyContent: "flex-end", borderWidth: 1 }}
        >
          <ThemedView
            style={{
              height: "75%",
              padding: 16,
            }}
          >
            <ThemedView
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <TextInput
                autoFocus={true}
                placeholder="Search for a restaurant..."
                placeholderTextColor={textColor}
                style={[
                  {
                    flex: 1,
                    height: 40,
                    color: textColor,
                    borderColor: textColor,
                    borderWidth: 1,
                    paddingHorizontal: 8,
                  },
                ]}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
              <TouchableOpacity
                onPress={() => handleSearch(searchQuery)}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name="search" size={24} color={textColor} />
              </TouchableOpacity>
            </ThemedView>
            <FlatList
              data={restaurants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleRestaurantSelect(item)}>
                  <ThemedView
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <ThemedText>{item.name}</ThemedText>
                  </ThemedView>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

export default PostResPicker;
