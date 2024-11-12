import { FIREBASE_DB } from "@/firebaseConfig";
import { BlogCover } from "@/zustand/blog";
import { collection, getDocs, limit, query } from "firebase/firestore";

async function fetchBlogCovers(): Promise<BlogCover[] | void> {
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

    return blogCovers;
  } catch (error) {
    console.error("Error fetching blog covers from Firestore:", error);
  }
}

export { fetchBlogCovers };
