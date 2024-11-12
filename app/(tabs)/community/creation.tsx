import StackHeader from "@/components/common/StackHeader";
import PostCreate from "@/components/community/post/postCreation/PostCreate";

const BlogCreationScreen = () => {
  return (
    <>
      <StackHeader title="Write a post" />
      <PostCreate />
    </>
  );
};

export default BlogCreationScreen;
