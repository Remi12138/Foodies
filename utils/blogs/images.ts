import { FIREBASE_STORAGE } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

async function uploadPostImages(
  images: string[],
  userUid: string,
  blogId: string
) {
  const uploadPostImagesPromises = images.map((image, index) => {
    const path = `blogs/${userUid}/${blogId}/post_${index}.png`;
    return uploadPostImage(image, path);
  });

  const downloadURLs = await Promise.all(uploadPostImagesPromises);
  return downloadURLs;
}

async function uploadPostImage(image: string, path: string) {
  let downloadURL = "";
  try {
    const postImageRef = ref(FIREBASE_STORAGE, path);
    // Convert the image URI to a blob
    const response = await fetch(image);
    const blob = await response.blob();

    // Upload the blob to Firebase Storage
    await uploadBytes(postImageRef, blob);

    // Get the public URL of the uploaded file
    downloadURL = await getDownloadURL(postImageRef);
  } catch (error) {
    console.error("An error occurred while uploading the post image", error);
  } finally {
    return downloadURL;
  }
}

export { uploadPostImages };
