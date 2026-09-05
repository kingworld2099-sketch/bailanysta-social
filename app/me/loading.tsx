import ProfileCardSkeleton from "@/components/ProfileCardSkeleton";
import PostCardSkeleton from "@/components/PostCardSkeleton";

export default function MeLoading() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <div className="skeleton h-4 w-32" />
      <ProfileCardSkeleton />
      <div className="card flex flex-col gap-2 p-4">
        <div className="skeleton h-9 w-full" />
        <div className="skeleton h-9 w-full" />
      </div>
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
