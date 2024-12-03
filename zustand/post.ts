import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Post = {
  title: string;
  content: string;
  images: string[];
  rtt_yelp_id: string;
};

type PostStore = {
  draft: Post;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  addImage: (image: string) => void;
  removeImage: (index: number) => void;
  setImages: (images: string[]) => void;
  setRttYelpId: (rtt_yelp_id: string) => void;
  resetDraft: () => void;
  saveDraftToStorage: () => Promise<void>;
  loadDraftFromStorage: () => Promise<void>;
};

const defaultDraft: Post = {
  title: "",
  content: "",
  images: [],
  rtt_yelp_id: "",
};

export const usePostStore = create<PostStore>()((set) => ({
  draft: defaultDraft,
  setTitle: (title) => set((state) => ({ draft: { ...state.draft, title } })),
  setContent: (content) =>
    set((state) => ({ draft: { ...state.draft, content } })),
  setRttYelpId: (rtt_yelp_id) =>
    set((state) => ({ draft: { ...state.draft, rtt_yelp_id } })),
  addImage: (image) =>
    set((state) => ({
      draft: {
        ...state.draft,
        images: [...state.draft.images, image],
      },
    })),
  removeImage: (index) =>
    set((state) => {
      const updatedImages = state.draft.images.filter((_, i) => i !== index);
      return {
        draft: {
          ...state.draft,
          images: updatedImages,
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
