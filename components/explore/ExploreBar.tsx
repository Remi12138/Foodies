import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from "react-native";
import Search from "@/components/navigation/Search";
import FilterBar from "@/components/explore/FilterBar";
import { Restaurant } from "@/zustand/restaurant";
import { FontAwesome } from "@expo/vector-icons";

interface ExploreBarProps {
  restaurants: Restaurant[];
  onFilter: (filteredData: Restaurant[]) => void;
}

const ExploreBar: React.FC<ExploreBarProps> = ({ restaurants, onFilter }) => {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // Extract unique categories from restaurants
  const categories = Array.from(
    new Set(restaurants.flatMap((restaurant) => restaurant.categories.map((cat) => cat.title)))
  );

  const toggleCategory = (category: string) => {
    const updatedCategories = activeCategories.includes(category)
      ? activeCategories.filter((c) => c !== category)
      : [...activeCategories, category];

    setActiveCategories(updatedCategories);

    // Filter restaurants by selected categories
    const filteredData = restaurants.filter((restaurant) =>
      restaurant.categories.some((cat) => updatedCategories.includes(cat.title))
    );
    onFilter(filteredData);
  };

  const resetFilters = () => {
    setActiveCategories([]);
    onFilter(restaurants); // Reset filtered data to show all restaurants
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search
          openLocatorDialog={() => {}}
          restaurants={restaurants}
          onFilter={onFilter}
        />
      </View>

      {/* Horizontal Category Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryBar}
      >
        {categories.slice(0, 6).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryItem,
              activeCategories.includes(category) && styles.activeCategoryItem,
            ]}
            onPress={() => toggleCategory(category)}
          >
            <FontAwesome name="cutlery" size={16} color="#F4511E" />
            <Text
              style={[
                styles.categoryText,
                activeCategories.includes(category) && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <FontAwesome name="refresh" size={16} color="#F4511E" />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>

        {/* "More" Button to Open Filter Modal */}
        <FilterBar restaurants={restaurants} onFilter={onFilter} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
  },
  searchContainer: {
    marginBottom: 8,
  },
  categoryBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeCategoryItem: {
    backgroundColor: "#FFB74D",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  activeCategoryText: {
    color: "#fff",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  resetText: {
    fontSize: 14,
    color: "#F4511E",
    marginLeft: 5,
  },
});

export default ExploreBar;
