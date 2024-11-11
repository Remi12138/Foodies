import { FIREBASE_DB } from "@/firebaseConfig";
import { BlogCover } from "@/zustand/blog";
import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
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
  const [blogFavorites, outdatedBlogs] = await fetchFavoriteBlogs(
    favoriteBlogCoverIds
  );
  if (blogFavorites) {
    setBlogCovers(blogFavorites);
    // sync latest favoriteBlogCoverIds with server
    if (outdatedBlogs.length > 0) {
      outdatedBlogs.forEach((blogId) => {
        updateFavoriteBlogIdFromServer(userUid, blogId, "remove");
      });
    }
  }
}

async function fetchFavoriteBlogCoverIds(userId: string) {
  let favorites: string[] = [];
  try {
    const collectionRef = doc(FIREBASE_DB, `users/${userId}/collections/blogs`);
    const collectionDoc = await getDoc(collectionRef);

    // if not found, create a new collection
    if (!collectionDoc.exists()) {
      await setDoc(collectionRef, {
        isPublic: false,
      });
      return favorites;
    }

    const collectionIndexRef = collection(collectionRef, "index");
    const querySnapshot = await getDocs(
      query(collectionIndexRef, orderBy("added_at", "desc"), limit(10))
    );
    favorites = querySnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error("Error fetching user collections: ", error);
  } finally {
    return favorites;
  }
}

async function updateFavoriteBlogIdFromServer(
  userId: string,
  favBlogId: string,
  action: "add" | "remove"
) {
  try {
    const collectionRef = doc(
      FIREBASE_DB,
      `users/${userId}/collections/blogs/index/${favBlogId}`
    );
    if (action === "add") {
      await setDoc(collectionRef, {
        added_at: new Date(),
      });
    } else if (action === "remove") {
      await deleteDoc(collectionRef);
    }
  } catch (error) {
    console.error("Error updating user blog collections: ", error);
  }
}

async function fetchFavoriteBlogs(
  favBlogIds: string[]
): Promise<[BlogCover[], string[]]> {
  let blogsFilteredData: BlogCover[] = [];
  let blogsOutdated: string[] = [];

  try {
    if (favBlogIds.length > 0) {
      const blogsRef = collection(FIREBASE_DB, "blog_covers");

      // Handle more than 10 IDs by batching the queries.
      const batchSize = 10;
      const batches = [];
      for (let i = 0; i < favBlogIds.length; i += batchSize) {
        const batchIds = favBlogIds.slice(i, i + batchSize);
        const q = query(blogsRef, where(documentId(), "in", batchIds));
        batches.push(getDocs(q));
      }

      // Wait for all the batched queries to complete
      const querySnapshots = await Promise.all(batches);

      // Collect all valid blog data and outdated IDs
      const fetchedBlogIds = new Set<string>();

      querySnapshots.forEach((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          blogsFilteredData.push({
            blog_id: doc.id,
            ...doc.data(),
          } as BlogCover);
          fetchedBlogIds.add(doc.id);
        });
      });

      // Find outdated blog IDs (those that were not fetched)
      blogsOutdated = favBlogIds.filter(
        (blogId) => !fetchedBlogIds.has(blogId)
      );
    }
  } catch (error) {
    console.error("Error fetching user collections: ", error);
  }

  return [blogsFilteredData, blogsOutdated];
}

export {
  initBlogCollections,
  fetchFavoriteBlogCoverIds,
  updateFavoriteBlogIdFromServer,
  fetchFavoriteBlogs,
  checkIfBlogIsLikedLocal,
};
