import { FIREBASE_DB } from "@/firebaseConfig";
import { BlogCover } from "@/zustand/blog";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

function checkIfBlogIsLikedLocal(
  blogCoverIds: string[],
  blogId: string
): boolean {
  return blogCoverIds.includes(blogId);
}

async function initBlogCollections(
  userUid: string,
  setBlogIds: (blogIds: string[]) => void,
  setBlogCovers: (blogCovers: BlogCover[]) => void
) {
  const favoriteBlogCoverIds = await fetchFavoriteBlogCoverIds(userUid);
  setBlogIds(favoriteBlogCoverIds);
  const blogFavorites = await fetchFavoriteBlogs(favoriteBlogCoverIds);
  if (blogFavorites) {
    setBlogCovers(blogFavorites);
    // update BlogIds by removing any invalid blog
    const validBlogIds = blogFavorites.map((blog) => blog.blog_id);
    setBlogIds(validBlogIds);
    // sync latest favoriteBlogCoverIds with server
    if (validBlogIds.length !== favoriteBlogCoverIds.length) {
      updateFavoriteBlogCoverIds(userUid, validBlogIds);
    }
  }
}

async function fetchFavoriteBlogCoverIds(userId: string) {
  let favorites: string[] = [];
  try {
    const collectionRef = doc(FIREBASE_DB, `users/${userId}/collections/blogs`);
    const collectionDoc = await getDoc(collectionRef);
    favorites = collectionDoc.data()?.favorites;
  } catch (error) {
    console.error("Error fetching user collections: ", error);
  } finally {
    return favorites;
  }
}

async function updateFavoriteBlogCoverIds(
  userId: string,
  favBlogIds: string[]
) {
  try {
    const collectionRef = doc(FIREBASE_DB, `users/${userId}/collections/blogs`);
    await setDoc(collectionRef, {
      favorites: favBlogIds,
    });
  } catch (error) {
    console.error("Error updating user blog collections: ", error);
  }
}

async function fetchFavoriteBlogs(favBlogIds: string[]) {
  let blogsFilteredData: BlogCover[] = [];
  try {
    if (favBlogIds.length > 0) {
      const blogsRef = collection(FIREBASE_DB, "blog_covers");
      const q = query(blogsRef, where(documentId(), "in", favBlogIds));
      const querySnapshot = await getDocs(q);
      const blogsDataRes = querySnapshot.docs.map((doc) => ({
        blog_id: doc.id,
        ...doc.data(),
      }));
      blogsFilteredData = blogsDataRes.filter(
        (blog) => blog !== null
      ) as BlogCover[];
    }
  } catch (error) {
    console.error("Error fetching user collections: ", error);
  } finally {
    return blogsFilteredData;
  }
}

export {
  initBlogCollections,
  fetchFavoriteBlogCoverIds,
  updateFavoriteBlogCoverIds,
  fetchFavoriteBlogs,
  checkIfBlogIsLikedLocal,
};
