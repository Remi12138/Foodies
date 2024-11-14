import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';

interface Restaurant {
  price?: string;
  distance: number;
  rating: number;
  categories: { title: string }[];
}

interface FilterBarProps {
  restaurants: Restaurant[];
  onFilter: (filteredData: Restaurant[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ restaurants, onFilter }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('price');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]); 
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const sortOptions = ['Price', 'Distance', 'Rating'];
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelectSort = (option: string) => {
    setSelectedSort(option.toLowerCase());
  };


  const handleFilterPress = (category: string) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(category)) {
     
        return prevFilters.filter((filter) => filter !== category);
      } else {
       
        return [...prevFilters, category];
      }
    });
  };

  const handleClear = () => {
    setSelectedSort('price');
    setSelectedFilters([]);
    setIsAscending(true);
    onFilter(restaurants); 
  };

  const handleApply = () => {
    toggleModal();
    let filteredData = [...restaurants];

    if (selectedFilters.length > 0) {
      filteredData = filteredData.filter((restaurant) =>
        selectedFilters.some((filter) =>
          restaurant.categories.some((cat) => new RegExp(filter, 'i').test(cat.title))
        )
      );
    }

    onFilter(filteredData);
  };

  useEffect(() => {
    let sortedData = [...restaurants];

    if (selectedSort === 'price') {
      sortedData.sort((a, b) => (a.price?.length || 0) - (b.price?.length || 0));
    } else if (selectedSort === 'distance') {
      sortedData.sort((a, b) => a.distance - b.distance);
    } else if (selectedSort === 'rating') {
      sortedData.sort((a, b) => a.rating - b.rating);
    }

    if (!isAscending) {
      sortedData.reverse();
    }

    onFilter(sortedData);
  }, [selectedSort, isAscending, restaurants]);

  return (
    <View>
      {/* Filter and Sort Button */}
      <View style={styles.sortContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
          <Icon name="filter-variant" size={24} color="#8B4513" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter</Text>

          {/* Sort By Section */}
          <Text style={styles.sectionTitle}>Sort by</Text>
          <View style={styles.optionsContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, selectedSort === option.toLowerCase() && styles.selectedOption]}
                onPress={() => handleSelectSort(option)}
              >
                <Text style={[styles.optionText, selectedSort === option.toLowerCase() && styles.selectedOptionText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort Order Section */}
          <Text style={styles.sectionTitle}>Order</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, isAscending && styles.selectedOption]}
              onPress={() => setIsAscending(true)}
            >
              <Text style={[styles.optionText, isAscending && styles.selectedOptionText]}>Ascending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, !isAscending && styles.selectedOption]}
              onPress={() => setIsAscending(false)}
            >
              <Text style={[styles.optionText, !isAscending && styles.selectedOptionText]}>Descending</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filters Section */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.categoryButton, selectedFilters.length === 0 && styles.selectedCategory]}
              onPress={() => setSelectedFilters([])}
            >
              <Text style={[styles.categoryText, selectedFilters.length === 0 && styles.selectedCategoryText]}>All</Text>
            </TouchableOpacity>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.label}
                style={[
                  styles.categoryButton,
                  selectedFilters.includes(filter.label) && styles.selectedCategory,
                ]}
                onPress={() => handleFilterPress(filter.label)}
              >
                <Icon
                  name={filter.icon}
                  size={20}
                  color={selectedFilters.includes(filter.label) ? '#fff' : '#000'}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedFilters.includes(filter.label) && styles.selectedCategoryText,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer Buttons */}
          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#F4511E',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 4,
    backgroundColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#F4511E',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    backgroundColor: '#F0F0F0',
  },
  selectedCategory: {
    backgroundColor: '#F4511E',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  selectedCategoryText: {
    color: 'white',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#333',
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F4511E',
    borderRadius: 5,
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default FilterBar;



