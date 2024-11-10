import { create } from "zustand";
import { FIREBASE_DB } from "@/firebaseConfig";
import { collection, getDocs, limit, query } from "firebase/firestore";

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
  fetchBlogCovers: () => Promise<BlogCover[] | void>;
};

const fetchBlogCovers = async (): Promise<BlogCover[] | void> => {
  try {
    const blogCoversCollection = collection(FIREBASE_DB, "blog_covers");
    const blogsQuery = query(blogCoversCollection, limit(10));
    const querySnapshot = await getDocs(blogsQuery);

    const blogCovers: BlogCover[] = querySnapshot.docs.map((doc) => {
      const blogCoverData = doc.data();
      return {
        blog_id: doc.id,
        ...blogCoverData,
      } as BlogCover;
    });
    console.log("Blog covers fetched:", blogCovers);

    return blogCovers;
  } catch (error) {
    console.error("Error fetching blog covers from Firestore:", error);
  }
};

// const fetchBlogs = async (): Promise<Blog[] | void> => {
//   try {
//     const blogPostsCollection = collection(FIREBASE_DB, "blogs");
//     // Create a query to fetch the first 10 documents
//     const blogsQuery = query(blogPostsCollection, limit(10));
//     const querySnapshot = await getDocs(blogsQuery);

//     const blogs: Blog[] = await Promise.all(
//       querySnapshot.docs.map(async (doc) => {
//         const blogData = doc.data();

//         // Extract the author reference from the blog
//         const authorRef = blogData.author_ref;
//         let authorData: UserPublicProfile | null = null;

//         if (authorRef) {
//           // Fetch the author document using the author reference
//           const authorDoc = await getDoc(authorRef);
//           const authorDataA = authorDoc.data();
//           if (authorDoc.exists()) {
//             authorData = {
//               uid: authorDoc.id,
//               ...(authorDataA || {}),
//             } as UserPublicProfile;
//           } else {
//             console.error("Author document does not exist");
//           }
//         }

//         return {
//           id: doc.id,
//           ...blogData,
//           author: authorData!,
//         } as Blog;
//       })
//     );
//     return blogs;
//   } catch (error) {
//     console.error("Error fetching blogs from Firestore:", error);
//   }
// };

// const fetchBlog = async (
//   userUid: string,
//   blogId: string
// ): Promise<Blog | null> => {
//   try {
//     // Get the blog document reference
//     const blogDocRef = doc(FIREBASE_DB, "users", userUid, "blogs", blogId);
//     const blogDoc = await getDoc(blogDocRef);

//     if (blogDoc.exists()) {
//       const blogData = blogDoc.data();

//       // Extract the author reference from the blog
//       const authorRef = blogData?.author_ref;

//       if (authorRef) {
//         // Fetch the author document using the author reference
//         const authorDoc = await getDoc(authorRef);
//         const authorDataA = authorDoc.data();

//         if (authorDoc.exists()) {
//           const authorData = {
//             uid: authorDoc.id,
//             ...(authorDataA || {}),
//           } as UserPublicProfile;

//           // Combine blog data and author object into one Blog object
//           return {
//             id: blogDoc.id,
//             ...blogData,
//             author: authorData,
//           } as Blog;
//         } else {
//           console.error("Author document does not exist");
//           return null;
//         }
//       } else {
//         console.error("No author reference found in the blog document");
//         return null;
//       }
//     } else {
//       console.log(`No blog found with ID: ${blogId}`);
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching blog from Firestore:", error);
//     return null;
//   }
// };

export const useBlogStore = create<BlogStore>()((set) => ({
  blogs: [],
  setBlogs: (blogs) => set(() => ({ blogs })),
  addBlog: (blog) => set((state) => ({ blogs: [...state.blogs, blog] })),
  removeBlog: (id) =>
    set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== id) })),
  blogCovers: [],
  setBlogCovers: (blogCovers) => set(() => ({ blogCovers })),
  fetchBlogCovers: async () => {
    const blogCovers = await fetchBlogCovers();
    if (blogCovers) {
      set(() => ({ blogCovers }));
    }
  },
}));
