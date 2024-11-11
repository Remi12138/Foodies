import StackHeader from "@/components/common/StackHeader";
import BlogFavoritesList from "@/components/community/blogCollection/BlogFavoritesList";
export default function CollectionsScreen() {
  return (
    <>
      <StackHeader title="My Collections" />
      <BlogFavoritesList />
    </>
  );
}
