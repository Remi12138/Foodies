import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { Restaurant } from "@/zustand/restaurant";
import React, { useState } from 'react';

interface ExploreBarProps {
  restaurants: Restaurant[];
  onFilter: (filteredData: Restaurant[]) => void;
}

const FilterBar: React.FC<ExploreBarProps> = ({ restaurants, onFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  console.log('restaurants:', restaurants);
  const filters = [
    { label: 'Pizza', icon: 'pizza' },
    { label: 'Chinese', icon: 'rice' },
    { label: 'American', icon: 'food' },
    { label: 'Cafes', icon: 'coffee' },
    { label: 'Beer Bar', icon: 'beer' },
    { label: 'Fast Food', icon: 'french-fries' },
    { label: 'Sandwiches', icon: 'bread-slice' },
    { label: 'Salad', icon: 'leaf' },
  ];

  const handleFilter = (searchTerm: string) => {
    const regex = new RegExp(searchTerm, 'i');
    console.log('searchTerm:', searchTerm);
    console.log(restaurants);
    const filteredData = restaurants.filter((restaurant) =>
      restaurant.categories.some((category) => regex.test(category.title ?? ''))
    );
    onFilter(filteredData);
  };

  const handleFilterPress = (category: string | null) => {
    setSelectedFilter(category);
    if (category) {
      handleFilter(category);
    } else {
      onFilter(restaurants);
    }
  };

  return (
    <View>
      {/* Filter Bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => handleFilterPress(null)}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.label}
            style={[
              styles.filterButton,
              selectedFilter === filter.label && { backgroundColor: '#FFA500' },
            ]}
            onPress={() => handleFilterPress(filter.label)}
          >
            <Icon name={filter.icon} size={24} color={selectedFilter === filter.label ? '#fff' : '#000'} />
            <Text style={[styles.filterText, selectedFilter === filter.label && { color: '#fff' }]}>{filter.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  filterButton: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFD580',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
  },
});

export default FilterBar;
