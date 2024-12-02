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

function PostResPicker() {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    const response = await searchYelpBusinesses(query, "-73.99429", "40.70544");
    if (response.businesses) {
      setRestaurants(response.businesses);
    }
  };

  const handleRestaurantSelect = (restaurantId: string) => {
    console.log("Selected Restaurant ID:", restaurantId);
    setModalVisible(false);
  };

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
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View
            style={{
              height: "75%",
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <TextInput
                autoFocus={true}
                placeholder="Search for a restaurant..."
                style={{
                  flex: 1,
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  paddingHorizontal: 8,
                }}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
              <TouchableOpacity
                onPress={() => handleSearch(searchQuery)}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name="search" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={restaurants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleRestaurantSelect(item.id)}
                >
                  <View
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <Text>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

export default PostResPicker;
