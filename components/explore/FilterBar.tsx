// import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 
// import { Restaurant } from "@/zustand/restaurant";
// import React, { useEffect, useState } from 'react';
// import { Picker } from '@react-native-picker/picker';

// interface ExploreBarProps {
//   restaurants: Restaurant[];
//   onFilter: (filteredData: Restaurant[]) => void;
// }

// const FilterBar: React.FC<ExploreBarProps> = ({ restaurants, onFilter }) => {
//   const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
//   const [sortOption, setSortOption] = useState<string>('default');
//   const [isAscending, setIsAscending] = useState<boolean>(true);
//   useEffect(() => {
//     let sortedData = [...restaurants];

//     if (sortOption === 'price') {
//       sortedData.sort((a, b) => (a.price?.length || 0) - (b.price?.length || 0));
//     } else if (sortOption === 'distance') {
//       sortedData.sort((a, b) => a.distance - b.distance);
//     }else if (sortOption === 'rating') {
//       sortedData.sort((a, b) => a.rating - b.rating);
//     }

//     if (!isAscending) {
//       sortedData.reverse();
//     }

//     onFilter(sortedData);
//   }, [sortOption, isAscending, restaurants]);

//   console.log('restaurants:', restaurants);
//   const filters = [
//     { label: 'Pizza', icon: 'pizza' },
//     { label: 'Chinese', icon: 'rice' },
//     { label: 'American', icon: 'food' },
//     { label: 'Cafes', icon: 'coffee' },
//     { label: 'Beer Bar', icon: 'beer' },
//     { label: 'Fast Food', icon: 'french-fries' },
//     { label: 'Sandwiches', icon: 'bread-slice' },
//     { label: 'Salad', icon: 'leaf' },
//   ];

//   const handleFilter = (searchTerm: string) => {
//     const regex = new RegExp(searchTerm, 'i');
//     console.log('searchTerm:', searchTerm);
//     console.log(restaurants);
//     const filteredData = restaurants.filter((restaurant) =>
//       restaurant.categories.some((category) => regex.test(category.title ?? ''))
//     );
//     onFilter(filteredData);
//   };

//   const handleFilterPress = (category: string | null) => {
//     setSelectedFilter(category);
//     if (category) {
//       handleFilter(category);
//     } else {
//       onFilter(restaurants);
//     }
//   };

//   return (
//     <View>
//         {/* Sort Dropdown */}
//       <View style={styles.sortContainer}>
//         <Picker
//           selectedValue={sortOption}
//           onValueChange={(itemValue) => setSortOption(itemValue)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Sort by Default" value="default" />
//           <Picker.Item label="Sort by Price" value="price" />
//           <Picker.Item label="Sort by Distance" value="distance" />
//           <Picker.Item label="Sort by Rating" value="rating" />
//         </Picker>
//         <TouchableOpacity onPress={() => setIsAscending(!isAscending)} style={styles.sortOrderButton}>
//           <Text style={styles.sortOrderText}>{isAscending ? "Ascending" : "Descending"}</Text>
//         </TouchableOpacity>
//       </View>
//       {/* Filter Bar */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.filterContainer}
//       >
//         <TouchableOpacity
//           style={styles.filterButton}
//           onPress={() => handleFilterPress(null)}
//         >
//           <Text style={styles.filterText}>All</Text>
//         </TouchableOpacity>
//         {filters.map((filter) => (
//           <TouchableOpacity
//             key={filter.label}
//             style={[
//               styles.filterButton,
//               selectedFilter === filter.label && { backgroundColor: '#FFA500' },
//             ]}
//             onPress={() => handleFilterPress(filter.label)}
//           >
//             <Icon name={filter.icon} size={24} color={selectedFilter === filter.label ? '#fff' : '#000'} />
//             <Text style={[styles.filterText, selectedFilter === filter.label && { color: '#fff' }]}>{filter.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   sortContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   picker: {
//     flex: 1,
//     marginRight: 8,
//   },
//   sortOrderButton: {
//     padding: 10,
//     backgroundColor: '#FFB74D',
//     borderRadius: 5,
//   },
//   sortOrderText: {
//     color: '#8B4513',
//     fontWeight: '600',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   filterButton: {
//     alignItems: 'center',
//     marginRight: 20,
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     backgroundColor: '#FFD580',
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 3,
//   },
//   filterText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#8B4513',
//   },
// });

// export default FilterBar;
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import Modal from 'react-native-modal';

// interface FilterBarProps {
//   onApplyFilter: (filter: { sort: string; topics: string[] }) => void;
// }

// const FilterBar: React.FC<FilterBarProps> = ({ onApplyFilter }) => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [selectedSort, setSelectedSort] = useState('Relevance');
//   const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  
//   const sortOptions = ['Relevance', 'Newest', 'Highest', 'Lowest'];
//   const topics = ['pool', 'water aerobics', 'chain', 'sauna', 'physical therapy', 'equipment'];

//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

//   const handleSelectSort = (option: React.SetStateAction<string>) => {
//     setSelectedSort(option);
//   };

//   const handleSelectTopic = (topic: string) => {
//     setSelectedTopics((prev) =>
//       prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
//     );
//   };

//   const handleClear = () => {
//     setSelectedSort('Relevance');
//     setSelectedTopics([]);
//   };

//   const handleApply = () => {
//     onApplyFilter({ sort: selectedSort, topics: selectedTopics });
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
//         <Text style={styles.filterButtonText}>Filter</Text>
//       </TouchableOpacity>

//       <Modal
//         isVisible={isModalVisible}
//         onBackdropPress={toggleModal}
//         style={styles.modal}
//       >
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Filter</Text>

//           {/* Sort By Section */}
//           <Text style={styles.sectionTitle}>Sort by</Text>
//           <View style={styles.optionsContainer}>
//             {sortOptions.map((option) => (
//               <TouchableOpacity
//                 key={option}
//                 style={[
//                   styles.optionButton,
//                   selectedSort === option && styles.selectedOption,
//                 ]}
//                 onPress={() => handleSelectSort(option)}
//               >
//                 <Text
//                   style={[
//                     styles.optionText,
//                     selectedSort === option && styles.selectedOptionText,
//                   ]}
//                 >
//                   {option}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           {/* Topics Section */}
//           <Text style={styles.sectionTitle}>Topics</Text>
//           <ScrollView contentContainerStyle={styles.optionsContainer} horizontal>
//             {topics.map((topic) => (
//               <TouchableOpacity
//                 key={topic}
//                 style={[
//                   styles.topicButton,
//                   selectedTopics.includes(topic) && styles.selectedTopic,
//                 ]}
//                 onPress={() => handleSelectTopic(topic)}
//               >
//                 <Text
//                   style={[
//                     styles.topicText,
//                     selectedTopics.includes(topic) && styles.selectedTopicText,
//                   ]}
//                 >
//                   {topic}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           {/* Footer Buttons */}
//           <View style={styles.footerButtons}>
//             <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
//               <Text style={styles.clearButtonText}>Clear</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
//               <Text style={styles.applyButtonText}>Apply</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//   },
//   filterButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#FFB74D',
//     borderRadius: 20,
//   },
//   filterButtonText: {
//     color: '#8B4513',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   modal: {
//     justifyContent: 'flex-end',
//     margin: 0,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginVertical: 10,
//   },
//   optionsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   optionButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 5,
//     margin: 4,
//     backgroundColor: '#F0F0F0',
//   },
//   selectedOption: {
//     backgroundColor: '#FFB74D',
//   },
//   optionText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   selectedOptionText: {
//     color: 'white',
//   },
//   topicButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     margin: 4,
//     backgroundColor: '#F0F0F0',
//   },
//   selectedTopic: {
//     backgroundColor: '#FFB74D',
//   },
//   topicText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   selectedTopicText: {
//     color: 'white',
//   },
//   footerButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   clearButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#E0E0E0',
//     borderRadius: 5,
//   },
//   clearButtonText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   applyButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: '#007AFF',
//     borderRadius: 5,
//   },
//   applyButtonText: {
//     fontSize: 16,
//     color: 'white',
//   },
// });

// export default FilterBar;
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
  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const sortOptions = ['Relevance', 'Newest', 'Highest', 'Lowest'];
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
    setSelectedSort(option);
  };

  const handleFilterPress = (category: string | null) => {
    setSelectedFilter(category);
    if (category) {
      const regex = new RegExp(category, 'i');
      const filteredData = restaurants.filter((restaurant) =>
        restaurant.categories.some((cat) => regex.test(cat.title ?? ''))
      );
      onFilter(filteredData);
    } else {
      onFilter(restaurants);
    }
  };

  const handleClear = () => {
    setSelectedSort('default');
    setSelectedFilter(null);
    setIsAscending(true);
  };

  const handleApply = () => {
    toggleModal();
    handleFilterPress(selectedFilter);
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
                style={[styles.optionButton, selectedSort === option && styles.selectedOption]}
                onPress={() => handleSelectSort(option)}
              >
                <Text style={[styles.optionText, selectedSort === option && styles.selectedOptionText]}>
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
              style={[styles.categoryButton, selectedFilter === null && styles.selectedCategory]}
              onPress={() => handleFilterPress(null)}
            >
              <Text style={[styles.categoryText, selectedFilter === null && styles.selectedCategoryText]}>All</Text>
            </TouchableOpacity>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.label}
                style={[styles.categoryButton, selectedFilter === filter.label && styles.selectedCategory]}
                onPress={() => handleFilterPress(filter.label)}
              >
                <Icon name={filter.icon} size={20} color={selectedFilter === filter.label ? '#fff' : '#000'} />
                <Text style={[styles.categoryText, selectedFilter === filter.label && styles.selectedCategoryText]}>
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
    backgroundColor: '#FFD580',
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
    backgroundColor: '#FFB74D',
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
    backgroundColor: '#FFD580',
  },
  selectedCategory: {
    backgroundColor: '#FFB74D',
  },
  categoryText: {
    fontSize: 14,
    color: '#8B4513',
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
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default FilterBar;
