import { create } from "zustand";

export type BlogCover = {
  blog_id: string;
  post_title: string;
  post_image_cover: string;
  post_likes_count: number;
  author_id: string;
  author_name: string;
  author_avatar: string;
};

export type Blog = {
  id: string;
  post_title: string;
  post_content: string;
  post_image_cover: string;
  post_images: string[];
  post_likes_count: number;
  created_at: string;
  updated_at: string;
};

type BlogStore = {
  blogs: Blog[];
  setBlogs: (blogs: Blog[]) => void;
  addBlog: (blog: Blog) => void;
  removeBlog: (id: string) => void;
  blogCovers: BlogCover[];
  setBlogCovers: (blogCovers: BlogCover[]) => void;
  blogCollections: BlogCover[];
  setBlogCollections: (blogCollections: BlogCover[]) => void;
};

export const useBlogStore = create<BlogStore>()((set) => ({
  blogs: [],
  setBlogs: (blogs) => set(() => ({ blogs })),
  addBlog: (blog) => set((state) => ({ blogs: [...state.blogs, blog] })),
  removeBlog: (id) =>
    set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== id) })),
  // blogCovers
  blogCovers: [],
  setBlogCovers: (blogCovers) => set(() => ({ blogCovers })),
  // blogCollections
  blogCollections: [],
  setBlogCollections: (blogCollections) => set(() => ({ blogCollections })),
}));
