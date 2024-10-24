import { StyleSheet, View, Text, Modal, Pressable } from "react-native";

function LocatorDialog({
  modalVisible,
  closeLocatorDialog,
}: {
  modalVisible: boolean;
  closeLocatorDialog: () => void;
}) {
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
          <Pressable style={styles.optionButton} onPress={() => {}}>
            <Text style={styles.optionText}>Use System Location</Text>
          </Pressable>
          <Pressable style={styles.optionButton} onPress={() => {}}>
            <Text style={styles.optionText}>Use IP Geolocation</Text>
          </Pressable>
          <Pressable style={styles.optionButton} onPress={() => {}}>
            <Text style={styles.optionText}>Enter Zip Code</Text>
          </Pressable>
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
});

export default LocatorDialog;
