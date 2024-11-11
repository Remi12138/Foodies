import { create } from "zustand";
import { BlogCover } from "./blog";

type CollectionStore = {
  // blogIds
  blogIds: string[];
  setBlogIds: (blogIds: string[]) => void;
  addBlogId: (blogId: string) => void;
  removeBlogId: (blogId: string) => void;
  // blogCovers
  blogCovers: BlogCover[];
  setBlogCovers: (blogCovers: BlogCover[]) => void;
  addBlogCover: (blogCover: BlogCover) => void;
  removeBlogCover: (id: string) => void;
};

export const useCollectionStore = create<CollectionStore>((set) => ({
  // blogIds
  blogIds: [],
  setBlogIds: (blogIds) => set(() => ({ blogIds })),
  addBlogId: (blogId) =>
    set((state) => ({ blogIds: [...state.blogIds, blogId] })),
  removeBlogId: (blogId) =>
    set((state) => ({ blogIds: state.blogIds.filter((id) => id !== blogId) })),
  // blogCovers
  blogCovers: [],
  setBlogCovers: (blogCovers) => set(() => ({ blogCovers })),
  addBlogCover: (blogCover) =>
    set((state) => ({ blogCovers: [...state.blogCovers, blogCover] })),
  removeBlogCover: (id) =>
    set((state) => ({
      blogCovers: state.blogCovers.filter(
        (blogCover) => blogCover.blog_id !== id
      ),
    })),
}));
