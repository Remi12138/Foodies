import { FIREBASE_DB } from "@/firebaseConfig";
import { Blog } from "@/zustand/blog";
import { PostDraft } from "@/zustand/post";
import { User } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

async function fetchPostRecord(
  userUid: string,
  blogId: string
): Promise<Blog | null> {
  try {
    const blogDocRef = doc(FIREBASE_DB, "users", userUid, "blogs", blogId);
    const blogDoc = await getDoc(blogDocRef);

    if (blogDoc.exists()) {
      const blogData = blogDoc.data();

      return {
        id: blogDoc.id,
        ...blogData,
      } as Blog;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching blog from Firestore:", error);
    return null;
  }
}

async function createPostRecord(draft: PostDraft, currentUser: User) {
  try {
    const firestore = getFirestore();
    const postsCollectionRef = collection(firestore, "blogs");
    const creation_time = new Date();

    const postData = {
      title: draft.title,
      content: draft.content,
      image_cover: "https://picsum.photos/id/4/200",
      images: [],
      created_at: creation_time,
      updated_at: creation_time,
      author_ref: doc(firestore, `users/${currentUser.uid}`),
    };

    await addDoc(postsCollectionRef, postData);
  } catch (error) {
    console.error("An error occurred while creating the post");
  }
}

async function destroyPostRecord(blogId: string) {
  try {
    const firestore = getFirestore();
    const postRef = doc(firestore, `blogs/${blogId}`);
    await deleteDoc(postRef);
  } catch (error) {
    console.error("An error occurred while destroying the post");
  }
}

export { fetchPostRecord, createPostRecord, destroyPostRecord };
