import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

interface AvatarPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  userAvatar: string;
}

export default function AvatarPickerModal({
  isVisible,
  onClose,
  userAvatar,
}: AvatarPickerModalProps) {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.avatarPickerContainer}>
          <Image
            source={
              userAvatar !== ""
                ? { uri: userAvatar }
                : require("@/assets/images/avatar-placeholder.jpg")
            }
            style={styles.modalAvatar}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={() => {}}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  avatarPickerContainer: {
    width: 320,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 35,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  uploadButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginRight: 10,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#aaaaaa",
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    color: "white",
  },
});
