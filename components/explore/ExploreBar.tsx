import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Search from "@/components/navigation/Search";
import LocatorDialog from "@/components/navigation/LocatorDialog";
import FilterBar from "@/components/explore/FilterBar";
import { Restaurant } from "@/zustand/restaurant";

interface ExploreBarProps {
  restaurants: Restaurant[];
  onFilter: (filteredData: Restaurant[]) => void;
}

const ExploreBar: React.FC<ExploreBarProps> = ({ restaurants, onFilter }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openLocatorDialog = () => {
    setModalVisible(true);
  };

  const closeLocatorDialog = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.searchContainer}>
          <Search openLocatorDialog={openLocatorDialog} />
        </View>
        <View style={styles.filterContainer}>
          <FilterBar restaurants={restaurants} onFilter={onFilter} />
        </View>
      </View>
      <LocatorDialog
        modalVisible={modalVisible}
        closeLocatorDialog={closeLocatorDialog}
      />
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1, // Makes the search bar take up available space
  },
  filterContainer: {
    paddingLeft: 8, // Adds space between search and filter icon
  },
});

export default ExploreBar;
