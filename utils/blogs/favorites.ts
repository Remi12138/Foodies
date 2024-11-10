import { FIREBASE_DB } from "@/firebaseConfig";
import { BlogCover } from "@/zustand/blog";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

async function fetchFavoriteBlogs(userId: string) {
  try {
    const collectionRef = doc(FIREBASE_DB, `users/${userId}/collections/blogs`);
    const collectionDoc = await getDoc(collectionRef);

    if (collectionDoc.exists()) {
      const collectedBlogIds = collectionDoc.data().favorites;
      if (collectedBlogIds.length > 0) {
        const blogsRef = collection(FIREBASE_DB, "blog_covers");
        const q = query(blogsRef, where(documentId(), "in", collectedBlogIds));
        const querySnapshot = await getDocs(q);
        const blogsData = querySnapshot.docs.map((doc) => ({
          blog_id: doc.id,
          ...doc.data(),
        }));
        return blogsData.filter((blog) => blog !== null) as BlogCover[];
      }
    }
  } catch (error) {
    console.error("Error fetching user collections: ", error);
  }
}

export { fetchFavoriteBlogs };
