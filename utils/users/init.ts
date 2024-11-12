import { FIREBASE_DB } from "@/firebaseConfig";
import { UserPublicProfile } from "@/zustand/user";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { generateUniqueString14 } from "./cid";

async function initUserProfile(userUid: string) {
  console.log("Initializing user profile for user:", userUid);
  const userRef = doc(FIREBASE_DB, "users", userUid);
  const userDoc = await getDoc(userRef);

  // if not found, create a new user profile
  const cid = await generateUniqueString14(userUid);
  const userProfile = {
    name: "New User",
    avatar: "",
    cid: cid,
  } as UserPublicProfile;

  if (!userDoc.exists()) {
    await setDoc(userRef, userProfile);
  }

  return userProfile;
}

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

export { initUserProfile, initUserCollection };
