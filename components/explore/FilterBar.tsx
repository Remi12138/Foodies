import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Modal from "react-native-modal";
import { useThemeColor } from "@/hooks/useThemeColor";

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

  const cardBackgroundColor = useThemeColor({ light: "#f9f9f9", dark: "#333" }, "background");
  const cardNameColor = useThemeColor({ light: "#333", dark: "#fff" }, "text");
  const optionBackgroundColor = useThemeColor({ light: "#E0E0E0", dark: "#000" }, "background");
  const selectedOptionBackgroundColor = useThemeColor({ light: "#F4511E", dark: "#F4511E" }, "background");
  const optionTextColor = useThemeColor({ light: "#333", dark: "#fff" }, "text");

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("price");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const sortOptions = ["Price", "Distance", "Rating"];
  const filters = [
    { label: "Pizza", icon: "pizza" },
    { label: "Chinese", icon: "rice" },
    { label: "American", icon: "food" },
    { label: "Cafes", icon: "coffee" },
    { label: "Beer Bar", icon: "beer" },
    { label: "Fast Food", icon: "french-fries" },
    { label: "Sandwiches", icon: "bread-slice" },
    { label: "Salad", icon: "leaf" },
    { label: "Halal", icon: "silverware" },
    { label: "Pakistani", icon: "silverware-fork-knife" },
    { label: "Italian", icon: "pasta" },
    { label: "Seafood", icon: "fish" },
    { label: "Desserts", icon: "cake" },
    { label: "BBQ", icon: "grill" },
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
    setSelectedSort("price");
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
          restaurant.categories.some((cat) => new RegExp(filter, "i").test(cat.title))
        )
      );
    }
  
    filteredData.sort((a, b) => {
      if (selectedSort === "price") {
        const priceA = a.price?.length || 0;
        const priceB = b.price?.length || 0;
        return isAscending ? priceA - priceB : priceB - priceA;
      } else if (selectedSort === "distance") {
        return isAscending ? a.distance - b.distance : b.distance - a.distance;
      } else if (selectedSort === "rating") {
        return isAscending ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0; 
    });
  
    onFilter(filteredData);
  };
  
  
  useEffect(() => {
    onFilter(restaurants);
  }, [restaurants]);

  return (
    <View>
      {/* "More" Icon Button */}
      <TouchableOpacity style={[
      styles.iconButton,
      { backgroundColor: cardBackgroundColor },
    ]} onPress={toggleModal}>
        <Icon name="filter-variant" size={20} color="#F4511E" />
        <Text style={styles.moreText}>More</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal} style={styles.modal}>
        <View style={[
      styles.modalContent,
      { backgroundColor: cardBackgroundColor },
    ]}>
          <Text style={[
      styles.modalTitle,
      { color: cardNameColor },
    ]}>Filter</Text>

          {/* Sort By Section */}
          <Text style={[
      styles.sectionTitle,
      { color: cardNameColor },
    ]}>Sort by</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.optionsContainer}>
            {sortOptions.map((option) => (
<TouchableOpacity
  key={option}
  style={[
    styles.optionButton,
    { backgroundColor: selectedSort === option.toLowerCase() ? selectedOptionBackgroundColor : optionBackgroundColor }, 
    selectedSort === option.toLowerCase() && styles.selectedOption, 
  ]}
  onPress={() => handleSelectSort(option)}
>
  <Text
    style={[
      styles.optionText,
      { color: selectedSort === option.toLowerCase() ? "#fff" : optionTextColor }, 
    ]}
  >
    {option}
  </Text>
</TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort Order Section */}
          <Text style={[
      styles.sectionTitle,
      { color: cardNameColor },
    ]}>Order</Text>
          <View style={styles.optionsContainer}>
          <View style={styles.optionsContainer}>
  <TouchableOpacity
    style={[
      styles.optionButton,
      {
        backgroundColor: isAscending
          ? selectedOptionBackgroundColor
          : optionBackgroundColor,
      },
    ]}
    onPress={() => setIsAscending(true)}
  >
    <Text
      style={[
        styles.optionText,
        { color: isAscending ? "#fff" : optionTextColor },
      ]}
    >
      Ascending
    </Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[
      styles.optionButton,
      {
        backgroundColor: !isAscending
          ? selectedOptionBackgroundColor
          : optionBackgroundColor,
      },
    ]}
    onPress={() => setIsAscending(false)}
  >
    <Text
      style={[
        styles.optionText,
        { color: !isAscending ? "#fff" : optionTextColor },
      ]}
    >
      Descending
    </Text>
  </TouchableOpacity>
</View>

          </View>

          {/* Category Filters Section */}
          <Text style={[
      styles.sectionTitle,
      { color: cardNameColor },
    ]}>Categories</Text>
<View style={styles.categoryContainer}>
  {filters.map((filter) => (
    <TouchableOpacity
      key={filter.label}
      style={[
        styles.categoryButton,
        {
          backgroundColor: selectedFilters.includes(filter.label)
            ? selectedOptionBackgroundColor
            : optionBackgroundColor,
        },
      ]}
      onPress={() => handleFilterPress(filter.label)}
    >
      <Icon
        name={filter.icon}
        size={20}
        color={
          selectedFilters.includes(filter.label) ? "#fff" : optionTextColor
        } // 动态图标颜色
      />
      <Text
        style={[
          styles.categoryText,
          {
            color: selectedFilters.includes(filter.label)
              ? "#fff"
              : optionTextColor, // 动态文本颜色
          },
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
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  moreText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#F4511E",
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    backgroundColor: "#f1f1f1",
  },
  selectedOption: {
    backgroundColor: "#F4511E",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOptionText: {
    color: "white",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
    backgroundColor: "#f1f1f1",
  },
  selectedCategory: {
    backgroundColor: "#F4511E",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  selectedCategoryText: {
    color: "white",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#333",
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F4511E",
    borderRadius: 20,
  },
  applyButtonText: {
    fontSize: 14,
    color: "white",
  },
});

export default FilterBar;
