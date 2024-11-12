import StackHeader from "@/components/common/StackHeader";
import BlogDetail from "@/components/community/blogDetail/BlogDetail";
import { useLocalSearchParams } from "expo-router";

export default function BlogScreen() {
  const { authorUid, blogId, blogTitle } = useLocalSearchParams();

  const author_id = Array.isArray(authorUid) ? authorUid[0] : authorUid;
  const blog_id = Array.isArray(blogId) ? blogId[0] : blogId;

  const MAX_TITLE_LENGTH = 30;
  const truncatedTitle =
    typeof blogTitle === "string"
      ? blogTitle.length > MAX_TITLE_LENGTH
        ? `${blogTitle.substring(0, MAX_TITLE_LENGTH)}...`
        : blogTitle
      : "";

  return (
    <>
      <StackHeader title={truncatedTitle} />
      <BlogDetail authorUid={author_id} blogId={blog_id} />
    </>
  );
}
