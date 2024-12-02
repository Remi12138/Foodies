import { useState } from "react";
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView, FlatList } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const { width, height } = Dimensions.get("window");

interface BlogImageModalProps {
  images: string[];
}

function BlogImageModal({ images }: BlogImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setCurrentImage(image);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentImage(null);
  };

  const textcolor = useThemeColor({}, "text");

  return (
    <GestureHandlerRootView>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => openModal(item)}
            onPress={() => openModal(item)}
            delayPressIn={150} // Prevents showing press effect immediately
            activeOpacity={1} // Avoids image blink effect when swiping
          >
            <Image source={{ uri: item }} style={styles.sliderImage} />
          </TouchableOpacity>
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(newIndex);
        }}
      />
      <ThemedView style={styles.paginationContainerCloser}>
        {images.map((_, index) => (
          <ThemedView
            key={index}
            style={[
              styles.dot,
              { opacity: currentIndex === index ? 1 : 0.4 },
              { backgroundColor: textcolor },
            ]}
          />
        ))}
      </ThemedView>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          {currentImage && (
            <Image
              source={{ uri: currentImage }}
              style={styles.fullScreenImage}
            />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    marginHorizontal: 4,
  },
  paginationContainerCloser: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
  },
  sliderImage: {
    width,
    height: height / 2.5,
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
  closeButton: {
    position: "absolute",
    width: 100,
    bottom: 40,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BlogImageModal;
