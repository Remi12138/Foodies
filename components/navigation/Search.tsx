// components/Search.tsx
import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function Search({ openLocatorDialog }: { openLocatorDialog: () => void }) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor="#888888"
      />
      <TouchableOpacity
        style={styles.locatorButton}
        onPress={openLocatorDialog}
      >
        <Ionicons name="location-outline" size={24} color="#007aff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  locatorButton: {
    marginLeft: 8,
  },
});

export default Search;
