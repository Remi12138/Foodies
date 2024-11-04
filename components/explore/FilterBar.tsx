import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { Restaurant } from "@/zustand/restaurant";
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';

interface ExploreBarProps {
  restaurants: Restaurant[];
  onFilter: (filteredData: Restaurant[]) => void;
}

const FilterBar: React.FC<ExploreBarProps> = ({ restaurants, onFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  const [isAscending, setIsAscending] = useState<boolean>(true);
  useEffect(() => {
    let sortedData = [...restaurants];

    if (sortOption === 'price') {
      sortedData.sort((a, b) => (a.price?.length || 0) - (b.price?.length || 0));
    } else if (sortOption === 'distance') {
      sortedData.sort((a, b) => a.distance - b.distance);
    }else if (sortOption === 'rating') {
      sortedData.sort((a, b) => a.rating - b.rating);
    }

    if (!isAscending) {
      sortedData.reverse();
    }

    onFilter(sortedData);
  }, [sortOption, isAscending, restaurants]);

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
        {/* Sort Dropdown */}
      <View style={styles.sortContainer}>
        <Picker
          selectedValue={sortOption}
          onValueChange={(itemValue) => setSortOption(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Sort by Default" value="default" />
          <Picker.Item label="Sort by Price" value="price" />
          <Picker.Item label="Sort by Distance" value="distance" />
          <Picker.Item label="Sort by Rating" value="rating" />
        </Picker>
        <TouchableOpacity onPress={() => setIsAscending(!isAscending)} style={styles.sortOrderButton}>
          <Text style={styles.sortOrderText}>{isAscending ? "Ascending" : "Descending"}</Text>
        </TouchableOpacity>
      </View>
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  picker: {
    flex: 1,
    marginRight: 8,
  },
  sortOrderButton: {
    padding: 10,
    backgroundColor: '#FFB74D',
    borderRadius: 5,
  },
  sortOrderText: {
    color: '#8B4513',
    fontWeight: '600',
  },
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
