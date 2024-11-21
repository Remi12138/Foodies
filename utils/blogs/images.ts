import { FIREBASE_STORAGE } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

async function uploadPostCover(image: string, userUid: string, blogId: string) {
  let downloadURL = "";
  try {
    const postCoverRef = ref(
      FIREBASE_STORAGE,
      `blogs/${userUid}/${blogId}/cover.jpg`
    );
    // Convert the image URI to a blob
    const response = await fetch(image);
    const blob = await response.blob();

    // Upload the blob to Firebase Storage
    await uploadBytes(postCoverRef, blob);

    // Get the public URL of the uploaded file
    downloadURL = await getDownloadURL(postCoverRef);
    console.log("ImageCover uploaded successfully: ", downloadURL);
  } catch (error) {
    console.error("An error occurred while uploading the post cover", error);
  } finally {
    return downloadURL;
  }
}

export { uploadPostCover };
