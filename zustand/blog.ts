import { create } from "zustand";
import { FIREBASE_DB } from "@/firebaseConfig";
import dummyBlogs from "@/dummy/blogs.json";
import { collection, getDocs, limit, query } from "firebase/firestore";

export type Blog = {
  id: string;
  author: string;
  content: string;
  title: string;
  restaurant: string;
  location: {
    Latitude: number;
    Longitude: number;
  };
  rate: string;
  image_cover: string;
  images: string[];
  created_at: string;
  updated_at: string;
};

type BlogStore = {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  addBlog: (blog: Blog) => void;
  removeBlog: (id: string) => void;
  fetchBlogs: () => Promise<void>;
  fetchFakeBlogs: () => Promise<void>;
};

const fetchBlogs = async () => {
  try {
    const blogPostsCollection = collection(FIREBASE_DB, "blogs");
    // Create a query to fetch the first 10 documents
    const blogsQuery = query(blogPostsCollection, limit(10));
    const querySnapshot = await getDocs(blogsQuery);
    const blogs = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Blog)
    );

    console.log("Fetched blogs from Firestore:", blogs);
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs from Firestore:", error);
  }
};

export const useBlogStore = create<BlogStore>()((set) => ({
  blogs: [],
  setBlogs: (blogs) => set(() => ({ blogs })),
  addBlog: (blog) => set((state) => ({ blogs: [...state.blogs, blog] })),
  removeBlog: (id) =>
    set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== id) })),
  fetchBlogs: async () => {
    const blogs = await fetchBlogs();
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
