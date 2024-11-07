import StackHeader from "@/components/common/StackHeader";
import BlogDetail from "@/components/community/blogDetail/BlogDetail";
import { useLocalSearchParams } from "expo-router";
export default function BlogScreen() {
  const { blogId, blogTitle } = useLocalSearchParams();

  // Fetch and display blog details using blogId...

  return (
    <>
      <StackHeader title={`${blogTitle}`} />
      <BlogDetail blogId={blogId.toString()} />
    </>
  );
}
