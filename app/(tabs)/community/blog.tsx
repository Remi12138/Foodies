import StackHeader from "@/components/common/StackHeader";
import BlogDetail from "@/components/community/blogDetail/BlogDetail";
import { useLocalSearchParams } from "expo-router";

export default function BlogScreen() {
  const { blogId, blogTitle } = useLocalSearchParams();

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
      <BlogDetail blogId={Array.isArray(blogId) ? blogId[0] : blogId} />
    </>
  );
}
