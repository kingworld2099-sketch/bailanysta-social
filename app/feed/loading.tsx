import PostCardSkeleton from "@/components/PostCardSkeleton";

export default function FeedLoading() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-5">
      <div className="card flex flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="skeleton h-9 w-full !rounded-full" />
          <div className="skeleton h-9 w-full !rounded-full" />
          <div className="skeleton h-9 w-full !rounded-full" />
          <div className="skeleton h-9 w-full !rounded-full" />
        </div>
        <div className="skeleton h-3.5 w-56" />
        <div className="flex items-center justify-between gap-3">
          <div className="skeleton h-9 w-40 !rounded-full" />
          <div className="skeleton h-9 w-28" />
        </div>
      </div>

      <div className="card flex flex-col gap-2 p-4">
        <div className="skeleton h-9 w-full" />
        <div className="skeleton h-9 w-full" />
      </div>

      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
