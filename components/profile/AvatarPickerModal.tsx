import { Modal, View, Image, Button, StyleSheet } from "react-native";

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
          <Button title="Upload" onPress={() => {}} />
          <Button title="Cancel" onPress={onClose} />
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
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});
