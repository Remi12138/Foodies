import { FIREBASE_STORAGE } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function uploadAvatar(avatar: string) {
  try {
    const avatarRef = ref(FIREBASE_STORAGE, `avatars/${Date.now()}.jpg`);
    // Convert the image URI to a blob
    const response = await fetch(avatar);
    const blob = await response.blob();

    // Upload the blob to Firebase Storage
    await uploadBytes(avatarRef, blob);

    // Get the public URL of the uploaded file
    const downloadURL = await getDownloadURL(avatarRef);

    console.log("Image uploaded successfully: ", downloadURL);
  } catch (error) {
    console.error("Error uploading avatar: ", error);
  }
}

export { uploadAvatar };
