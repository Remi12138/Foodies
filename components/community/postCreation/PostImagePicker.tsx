import { useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import * as ImagePicker from "expo-image-picker";
import { usePostStore } from "@/zustand/post";

function PostImagePicker() {
  const {
    draft,
    setImageCover,
    addImage,
    loadDraftFromStorage,
    saveDraftToStorage,
  } = usePostStore();

  useEffect(() => {
    // Load images from AsyncStorage when the component mounts
    loadDraftFromStorage();
  }, []);

  const pickImages = async () => {
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
      const selectedImages = result.assets.map((asset) => asset.uri);
      selectedImages.forEach((image, index) => {
        if (draft.images.length === 0 && index === 0) {
          setImageCover(image); // Set the first image as the cover image if none exists
        }
        addImage(image);
      });

      await saveDraftToStorage();
    }
  };

  return (
    <ThemedView style={styles.imageContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.imageRow}>
          {draft.images.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
          ))}
          {draft.images.length < 9 && (
            <TouchableOpacity
              onPress={pickImages}
              style={styles.imagePlaceholder}
            >
              <Ionicons name="add" size={48} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

export default PostImagePicker;
