import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Restaurant } from "@/zustand/restaurant";

interface SearchProps {
  openLocatorDialog: () => void;
  restaurants: Restaurant[];
  onFilter: (filteredData: Restaurant[]) => void;
}

const Search: React.FC<SearchProps> = ({ openLocatorDialog, restaurants, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    const regex = new RegExp(term, "i");
    const filteredData = restaurants.filter((restaurant) =>
      restaurant.name.match(regex) ||
      restaurant.location.address1.match(regex) ||
      restaurant.alias.match(regex)
    );

    onFilter(filteredData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by name, location, or alias..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 8,
  },
});

export default Search;