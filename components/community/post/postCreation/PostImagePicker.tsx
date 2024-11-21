import { useEffect } from "react";
import { StyleSheet, TouchableOpacity, Image, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import * as ImagePicker from "expo-image-picker";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import * as ImageManipulator from "expo-image-manipulator";
import { usePostStore } from "@/zustand/post";

type DraftImage = string;

function PostImagePicker() {
  const {
    draft,
    addImage,
    setImages,
    loadDraftFromStorage,
    saveDraftToStorage,
  } = usePostStore();

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
          [{ resize: { width: 256 } }],
          {
            compress: 0.7,
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
        <TouchableOpacity onLongPress={drag}>
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
                <Text style={styles.placeholderLabel}>
                  {draft.images.length === 0
                    ? "Pick a Cover"
                    : `${9 - draft.images.length} Seats Available`}
                </Text>
              </View>
            ) : null
          }
        />
      </ThemedView>
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
    color: "#333",
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
});

export default PostImagePicker;
