import { Post } from "@/zustand/post";

function draftValidate(draft: Post) {
  if (!draft.title || draft.title.trim() === "") {
    return "Title must not be empty";
  }
  if (!draft.images || draft.images.length === 0) {
    return "At least one image is required";
  }
  if (!draft.content || draft.content.trim() === "") {
    return "Content cannot be empty";
  }

  return "validated";
}

export { draftValidate };
