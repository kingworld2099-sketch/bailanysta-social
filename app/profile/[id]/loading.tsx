import ProfileCardSkeleton from "@/components/ProfileCardSkeleton";
import PostCardSkeleton from "@/components/PostCardSkeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-6">
      <div className="skeleton h-4 w-32" />
      <ProfileCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
