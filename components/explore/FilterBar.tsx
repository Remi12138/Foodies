import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

const FilterBar = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 10 }}>
      <TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }}>
        <Icon name="pizza" size={24} />
        <Text>Pizza</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: 'center', marginRight: 20 }}>
        <Icon name="rice" size={24} />
        <Text>Chinese</Text>
      </TouchableOpacity>
      {/* Add more filter options similarly */}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  filterText: {
    color: "#007aff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default FilterBar;
