import { FIREBASE_DB } from "@/firebaseConfig";
import { UserPublicProfile } from "@/zustand/user";
import { doc, getDoc } from "firebase/firestore";

async function fetchUserPublicProfile(
  userUid: string
): Promise<UserPublicProfile | null> {
  try {
    const userDocRef = doc(FIREBASE_DB, "users", userUid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return {
        uid: userDoc.id,
        ...userDoc.data(),
      } as UserPublicProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user from Firestore:", error);
    return null;
  }
}

export { fetchUserPublicProfile };
