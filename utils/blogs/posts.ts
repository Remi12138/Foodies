import { FIREBASE_DB } from "@/firebaseConfig";
import { Blog, BlogCover } from "@/zustand/blog";
import { Post } from "@/zustand/post";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

async function fetchPostRecord(
  userUid: string,
  blogId: string
): Promise<Blog | null> {
  try {
    const blogDocRef = doc(FIREBASE_DB, `users/${userUid}/blogs/${blogId}`);
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

async function createPostRecord(draft: Post, userId: string) {
  const current_time = new Date();
  let draftBlog = {
    post: draft,
    likes_count: 0,
    is_public: true,
    created_at: current_time,
    updated_at: current_time,
  } as Blog;

  try {
    const blogsCollectionRef = collection(FIREBASE_DB, `users/${userId}/blogs`);
    const blog = await addDoc(blogsCollectionRef, draftBlog);
    if (blog && draftBlog.is_public) {
      draftBlog.id = blog.id;
      createBlogCoverRecord(draftBlog, userId);
    }
  } catch (error) {
    console.error("An error occurred while creating the post", error);
  }
}

async function destroyPostRecord(userUid: string, blogId: string) {
  try {
    const postRef = doc(FIREBASE_DB, `users/${userUid}/blogs/${blogId}`);
    await deleteDoc(postRef);
    destroyBlogCoverRecord(blogId);
  } catch (error) {
    console.error("An error occurred while destroying the post", error);
  }
}

async function createBlogCoverRecord(blog: Blog, userId: string) {
  let blogCoverData = {
    post_title: blog.post.title,
    post_image_cover: blog.post.image_cover,
    post_likes_count: blog.likes_count,
    author_id: userId,
    author_name: "John Doe",
    author_avatar: "",
  } as BlogCover;

  try {
    const blogCoverDocRef = doc(FIREBASE_DB, "blog_covers", blog.id);
    await setDoc(blogCoverDocRef, blogCoverData);
  } catch (error) {
    console.error("An error occurred while creating the post cover", error);
  }
}

async function destroyBlogCoverRecord(blogId: string) {
  try {
    const blogCoverRef = doc(FIREBASE_DB, "blog_covers", blogId);
    await deleteDoc(blogCoverRef);
  } catch (error) {
    console.error("An error occurred while destroying the post cover", error);
  }
}

export {
  fetchPostRecord,
  createPostRecord,
  destroyPostRecord,
  createBlogCoverRecord,
  destroyBlogCoverRecord,
};
