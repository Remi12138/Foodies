import { FIREBASE_STORAGE } from "@/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

async function uploadPostImages(
  images: string[],
  userUid: string,
  blogId: string
) {
  const uploadPromises = images.map((image, index) => {
    const path = `blogs/${userUid}/${blogId}/post_${index}.jpg`;
    return uploadPostImage(image, path);
  });

  const downloadURLs = await Promise.all(uploadPromises);
  return downloadURLs;
}

async function uploadPostImage(image: string, path: string) {
  let downloadURL = "";
  try {
    const postCoverRef = ref(FIREBASE_STORAGE, path);
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

export { uploadPostImages };
