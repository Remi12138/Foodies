import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
  Dimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import * as ImagePicker from "expo-image-picker";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import * as ImageManipulator from "expo-image-manipulator";
import { usePostStore } from "@/zustand/post";
import { ThemedText } from "@/components/ThemedText";

const { width, height } = Dimensions.get("window");

type DraftImage = string;

function PostImagePicker() {
  const {
    draft,
    addImage,
    setImages,
    loadDraftFromStorage,
    saveDraftToStorage,
  } = usePostStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    loadDraftFromStorage();
  }, []);

  async function pickImages() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 9 - draft.images.length,
    });

    if (!result.canceled) {
      const selectedImages = result.assets?.map((asset) => asset.uri) || [];
      for (const image of selectedImages) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          image,
          [{ resize: { width: 512 } }],
          {
            compress: 0.6,
            format: ImageManipulator.SaveFormat.PNG,
            base64: true,
          }
        );
        addImage(manipulatedImage.uri);
      }
      await saveDraftToStorage();
    }
  }

  function renderItem({ item, drag }: RenderItemParams<DraftImage>) {
    const index = draft.images.indexOf(item);
    const label =
      index === 0 ? "Cover" : `${index + 1}${getOrdinalSuffix(index + 1)}`;
    return (
      <View style={styles.imageWrapper}>
        <TouchableOpacity
          onPress={() => handleImagePress(item)}
          onLongPress={drag}
          delayLongPress={150}
          activeOpacity={1}
        >
          <Image source={{ uri: item }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.imageLabel}>{label}</Text>
      </View>
    );
  }

  function getOrdinalSuffix(number: number) {
    if (number === 1) return "st";
    if (number === 2) return "nd";
    if (number === 3) return "rd";
    return "th";
  }

  const handleImagePress = (image: string) => {
    if (currentImage === image) {
      openModal(image);
    } else {
      setCurrentImage(image);
    }
  };

  const openModal = (image: string) => {
    setCurrentImage(image);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentImage(null);
  };

  const deleteImage = () => {
    if (currentImage) {
      const updatedImages = draft.images.filter((img) => img !== currentImage);
      setImages(updatedImages);
      saveDraftToStorage();
      closeModal();
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemedView style={styles.imageContainer}>
        <DraggableFlatList
          data={draft.images}
          renderItem={renderItem}
          keyExtractor={(item, index) => `draggable-item-${index}`}
          horizontal
          onDragEnd={({ data }) => {
            setImages(data);
            saveDraftToStorage();
          }}
          ListFooterComponent={
            draft.images.length < 9 ? (
              <View style={styles.placeholderWrapper}>
                <TouchableOpacity
                  onPress={pickImages}
                  style={styles.imagePlaceholder}
                >
                  <Ionicons name="add" size={48} color="#ccc" />
                </TouchableOpacity>
                <ThemedText style={styles.placeholderLabel}>
                  {draft.images.length === 0
                    ? "Pick a Cover"
                    : `${9 - draft.images.length} Seats Available`}
                </ThemedText>
              </View>
            ) : null
          }
        />
      </ThemedView>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          {currentImage && (
            <Image
              source={{ uri: currentImage }}
              style={styles.fullScreenImage}
            />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  imageWrapper: {
    margin: 5,
    alignItems: "center",
  },
  placeholderWrapper: {
    alignItems: "center",
    margin: 5,
  },
  imagePlaceholder: {
    width: 135,
    height: 135,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  image: {
    width: 135,
    height: 135,
  },
  imageLabel: {
    marginTop: 5,
    fontSize: 10,
    color: "#FFF",
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 2,
    overflow: "hidden",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullScreenImage: {
    width: width,
    height: height,
    resizeMode: "contain",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingHorizontal: 20,
  },
  closeButton: {
    backgroundColor: "#000",
    padding: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    padding: 10,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostImagePicker;
