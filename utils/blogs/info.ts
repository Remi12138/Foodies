import { FIREBASE_DB } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

async function checkIfBlogIsLiked(blogId: string): Promise<boolean> {
  const currentUser = getAuth().currentUser;
  if (!currentUser) return false;

  const collectionRef = doc(
    FIREBASE_DB,
    `users/${currentUser.uid}/collections/blogs`
  );
  const collectionDoc = await getDoc(collectionRef);

  if (collectionDoc.exists()) {
    const likedPosts: string[] = collectionDoc.data().favorites;
    return likedPosts.some((str) => str === blogId);
  }
  return false;
}

export { checkIfBlogIsLiked };
