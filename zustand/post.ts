import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Post = {
  title: string;
  content: string;
  image_cover: string;
  images: string[];
};

type PostStore = {
  draft: Post;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setImageCover: (imageCover: string) => void;
  addImage: (image: string) => void;
  removeImage: (index: number) => void;
  setImages: (images: string[]) => void;
  resetDraft: () => void;
  saveDraftToStorage: () => Promise<void>;
  loadDraftFromStorage: () => Promise<void>;
};

const defaultDraft: Post = {
  title: "",
  content: "",
  image_cover: "https://picsum.photos/id/4/200",
  images: [],
};

export const usePostStore = create<PostStore>()((set) => ({
  draft: defaultDraft,
  setTitle: (title) => set((state) => ({ draft: { ...state.draft, title } })),
  setContent: (content) =>
    set((state) => ({ draft: { ...state.draft, content } })),
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
  setImages: (images) =>
    set((state) => ({
      draft: {
        ...state.draft,
        images,
        image_cover: images.length > 0 ? images[0] : "",
      },
    })),
  resetDraft: () => {
    set(() => ({ draft: defaultDraft }));
    try {
      AsyncStorage.removeItem("postDraft");
    } catch (error) {
      console.error("Error resetting post draft storage:", error);
    }
  },
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
