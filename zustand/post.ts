import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PostDraft = {
  title: string;
  content: string;
  restaurant: string;
  location: {
    Latitude: number;
    Longitude: number;
  };
  rate: string;
  image_cover: string;
  images: string[];
};

type PostStore = {
  draft: PostDraft;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setRestaurant: (restaurant: string) => void;
  setLocation: (latitude: number, longitude: number) => void;
  setRate: (rate: string) => void;
  setImageCover: (imageCover: string) => void;
  addImage: (image: string) => void;
  removeImage: (index: number) => void;
  resetDraft: () => void;
  saveDraftToStorage: () => Promise<void>;
  loadDraftFromStorage: () => Promise<void>;
};

const defaultDraft: PostDraft = {
  title: "",
  content: "",
  restaurant: "",
  location: {
    Latitude: 0,
    Longitude: 0,
  },
  rate: "",
  image_cover: "",
  images: [],
};

export const usePostStore = create<PostStore>()((set) => ({
  draft: defaultDraft,
  setTitle: (title) => set((state) => ({ draft: { ...state.draft, title } })),
  setContent: (content) =>
    set((state) => ({ draft: { ...state.draft, content } })),
  setRestaurant: (restaurant) =>
    set((state) => ({ draft: { ...state.draft, restaurant } })),
  setLocation: (latitude, longitude) =>
    set((state) => ({
      draft: {
        ...state.draft,
        location: { Latitude: latitude, Longitude: longitude },
      },
    })),
  setRate: (rate) => set((state) => ({ draft: { ...state.draft, rate } })),
  setImageCover: (imageCover) =>
    set((state) => ({ draft: { ...state.draft, image_cover: imageCover } })),
  addImage: (image) =>
    set((state) => ({
      draft: {
        ...state.draft,
        images: [...state.draft.images, image],
        image_cover:
          state.draft.images.length === 0 ? image : state.draft.image_cover,
      },
    })),
  removeImage: (index) =>
    set((state) => {
      const updatedImages = state.draft.images.filter((_, i) => i !== index);
      return {
        draft: {
          ...state.draft,
          images: updatedImages,
          image_cover:
            index === 0 && updatedImages.length > 0
              ? updatedImages[0]
              : state.draft.image_cover,
        },
      };
    }),
  resetDraft: () => set(() => ({ draft: defaultDraft })),
  saveDraftToStorage: async () => {
    try {
      const state = usePostStore.getState();
      await AsyncStorage.setItem("postDraft", JSON.stringify(state.draft));
    } catch (error) {
      console.error("Error saving post draft to storage:", error);
    }
  },
  loadDraftFromStorage: async () => {
    try {
      const storedDraft = await AsyncStorage.getItem("postDraft");
      if (storedDraft) {
        set(() => ({ draft: JSON.parse(storedDraft) }));
      }
    } catch (error) {
      console.error("Error loading post draft from storage:", error);
    }
  },
}));
