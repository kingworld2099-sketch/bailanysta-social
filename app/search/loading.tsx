import PostCardSkeleton from "@/components/PostCardSkeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <div className="flex gap-2">
        <div className="skeleton h-11 flex-1" />
        <div className="skeleton h-11 w-24" />
      </div>
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
