import { create } from "zustand";
import dummyBlogs from "@/dummy/blogs.json";

export type Blog = {
  id: string;
  title: string;
  author: string;
  restaurantId: string;
  location: {
    lat: number;
    lng: number;
  };
  stars: string;
  content: string;
  imageCover: string;
  images: string[];
};

type BlogStore = {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  addBlog: (blog: Blog) => void;
  removeBlog: (id: string) => void;
  fetchBlogs: () => Promise<void>;
  fetchFakeBlogs: () => Promise<void>;
};

export const useBlogStore = create<BlogStore>()((set) => ({
  blogs: [],
  setBlogs: (blogs) => set(() => ({ blogs })),
  addBlog: (blog) => set((state) => ({ blogs: [...state.blogs, blog] })),
  removeBlog: (id) =>
    set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== id) })),
  fetchBlogs: async () => {
    const response = await fetch("https://api.example.com/blogs");
    const blogs = await response.json();
    set(() => ({ blogs }));
  },
  fetchFakeBlogs: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogs = dummyBlogs;
        set(() => ({ blogs }));
        console.log("Fetched fake blogs");
        resolve(); // Resolve after the timeout finishes
      }, 1000);
    });
  },
}));
