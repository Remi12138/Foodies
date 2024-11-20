import { FIREBASE_DB, FIREBASE_STORAGE } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

async function uploadAvatar(avatar: string, userUid: string) {
  let downloadURL = "";

  try {
    const avatarRef = ref(FIREBASE_STORAGE, `avatars/${userUid}/avatar.jpg`);
    // Convert the image URI to a blob
    const response = await fetch(avatar);
    const blob = await response.blob();

    // Upload the blob to Firebase Storage
    await uploadBytes(avatarRef, blob);

    // Get the public URL of the uploaded file
    downloadURL = await getDownloadURL(avatarRef);

    // Update the user's avatar URI in Firestore
    updateAvatarURIFromDB(downloadURL, userUid);
    console.log("Image uploaded successfully: ", downloadURL);
  } catch (error) {
    console.error("Error uploading avatar: ", error);
  } finally {
    return downloadURL;
  }
}

async function updateAvatarURIFromDB(avatar: string, userUid: string) {
  try {
    const userDocRef = doc(FIREBASE_DB, "users", userUid);
    await updateDoc(userDocRef, { avatar: avatar });
  } catch (error) {
    console.error("Error updating user avatar in Firestore:", error);
  }
}

export { uploadAvatar };
