import { StyleSheet, View, Text, Modal, Pressable, ActivityIndicator, TextInput } from "react-native";

import React, { useState, useEffect } from "react";
import { useLocation } from "@/zustand/location";



function LocatorDialog({
  modalVisible,
  closeLocatorDialog,
}: {
  modalVisible: boolean;
  closeLocatorDialog: () => void;
}) {
const [address, setAddress] = useState("");
   
const { fetchLocation,setLocation } = useLocation();


function switchSystemLocation() {
  fetchLocation(); 
  closeLocatorDialog(); 
}


function switchZipCode() {
  console.log("Switching to address input");
  fetchCoordinatesFromAddress(address).then((location) => {
    if (location) {
      setLocation(location);
      closeLocatorDialog(); 
    }
  });
}

const fetchCoordinatesFromAddress = async (address: string) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      const location = data[0];
      console.log("Latitude:", location.lat, "Longitude:", location.lon);
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } else {
      throw new Error("No results found for this address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
};




  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeLocatorDialog}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Choose Location Option</Text>
          <Pressable style={styles.optionButton} onPress={switchSystemLocation}>
            <Text style={styles.optionText}>Use System Location</Text>
          </Pressable>
          <Pressable style={styles.optionButton} onPress={() => {}}>
            <Text style={styles.optionText}>Use IP Geolocation</Text>
          </Pressable>
          <Pressable style={styles.optionButton} onPress={() => {}}>
            <Text style={styles.optionText}>Enter Zip Code</Text>
          </Pressable>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Address"
              value={address}
              onChangeText={setAddress}
              keyboardType="numeric"
            />
            <Pressable style={styles.submitButton} onPress={switchZipCode}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
          <Pressable style={styles.cancelButton} onPress={closeLocatorDialog}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 320,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    width: "100%",
    paddingVertical: 12,
    marginVertical: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    alignItems: "center",
  },
  optionText: {
    color: "#007aff",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    marginTop: 20,
  },
  cancelText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "500",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  input: {
    flex: 1, // 使输入框占满剩余空间
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333333",
  },
  
  submitButton: {
    backgroundColor: "#007aff",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  
  submitButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
});
export default LocatorDialog;
