import { FIREBASE_DB } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function initUserCollection(userUid: string) {
  console.log("Initializing user collection for user:", userUid);
  const collectionRef = doc(FIREBASE_DB, `users/${userUid}/collections/blogs`);
  const collectionDoc = await getDoc(collectionRef);

  // if not found, create a new collection
  if (!collectionDoc.exists()) {
    await setDoc(collectionRef, {
      isPublic: false,
    });
  }
}

export { initUserCollection };
