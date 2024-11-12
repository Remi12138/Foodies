import { FIREBASE_DB } from "@/firebaseConfig";
import { UserPublicProfile } from "@/zustand/user";
import { doc, getDoc, updateDoc } from "firebase/firestore";

async function fetchUserPublicProfile(
  userUid: string
): Promise<UserPublicProfile | null> {
  try {
    const userDocRef = doc(FIREBASE_DB, "users", userUid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserPublicProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user from Firestore:", error);
    return null;
  }
}

async function updateUserPublicProfileName(userUid: string, name: string) {
  try {
    const userDocRef = doc(FIREBASE_DB, "users", userUid);
    await updateDoc(userDocRef, { name: name });
  } catch (error) {
    console.error("Error updating user name in Firestore:", error);
  }
}

export { fetchUserPublicProfile, updateUserPublicProfileName };
