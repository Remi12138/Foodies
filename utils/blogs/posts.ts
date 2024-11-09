import { PostDraft } from "@/zustand/post";
import { User } from "firebase/auth";
import { getFirestore, collection, addDoc, doc } from "firebase/firestore";

async function createPostRecord(draft: PostDraft, currentUser: User) {
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
}

export { createPostRecord };
