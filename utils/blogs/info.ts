import { FIREBASE_DB } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, DocumentReference, getDoc } from "firebase/firestore";

async function checkIfBlogIsLiked(blogId: string): Promise<boolean> {
  const currentUser = getAuth().currentUser;
  if (!currentUser) return false;

  const collectionRef = doc(
    FIREBASE_DB,
    "users",
    currentUser.uid,
    "collections",
    "blogs"
  );
  const collectionDoc = await getDoc(collectionRef);

  if (collectionDoc.exists()) {
    const collectionData = collectionDoc.data();
    const blogReferences: DocumentReference[] = collectionData.favorites;
    return blogReferences.some((ref) => ref.id === blogId);
  }
  return false;
}

export { checkIfBlogIsLiked };
