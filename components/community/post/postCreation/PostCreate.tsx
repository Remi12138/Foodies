import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import PostImagePicker from "./PostImagePicker";
import { ThemedView } from "@/components/ThemedView";
import { usePostStore } from "@/zustand/post";
import PostBtnSubmit from "./PostBtnSubmit";
import { debounce } from "lodash";
import { useThemeColor } from "@/hooks/useThemeColor";
import PostResPicker from "./PostResPicker";

function PostCreate() {
  const {
    draft,
    setTitle,
    setContent,
    setRttYelpId,
    loadDraftFromStorage,
    saveDraftToStorage,
  } = usePostStore();

  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    loadDraftFromStorage();
  }, []);

  const handleTitleChange = (title: string) => {
    setTitle(title);
    debouncedSaveDraft();
  };

  const handleContentChange = (content: string) => {
    setContent(content);
    debouncedSaveDraft();
  };

  const debouncedSaveDraft = debounce(() => {
    saveDraftToStorage();
  }, 5000);

  const handleRestaurantSelect = (
    restaurant: { id: string; name: string } | null
  ) => {
    setSelectedRestaurant(restaurant);
    setRttYelpId(restaurant ? restaurant.id : "");
    debouncedSaveDraft();
  };

  const textColor = useThemeColor({}, "text");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <PostImagePicker />
          <TextInput
            style={[
              styles.titleInput,
              { color: textColor, borderColor: textColor },
            ]}
            placeholder="Add a title"
            placeholderTextColor={textColor}
            value={draft.title}
            onChangeText={handleTitleChange}
          />
          <TextInput
            style={[
              styles.contentInput,
              { color: textColor, borderColor: textColor },
            ]}
            placeholder="Add content"
            placeholderTextColor={textColor}
            value={draft.content}
            onChangeText={handleContentChange}
            multiline
          />
          <PostResPicker
            onRestaurantSelect={handleRestaurantSelect}
            selectedRestaurant={selectedRestaurant}
          />
        </ScrollView>
        <PostBtnSubmit />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "bold",
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 10,
  },
  contentInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    height: 200,
    textAlignVertical: "top",
  },
  rttInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 10,
  },
});

export default PostCreate;
