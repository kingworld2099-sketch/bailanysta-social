export default function PostCardSkeleton() {
  return (
    <div className="card p-4" style={{ borderLeft: "4px solid var(--border)" }}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-5 w-16 !rounded-full" />
        </div>
        <div className="skeleton h-3 w-14" />
      </div>
      <div className="mb-2 flex flex-col gap-2">
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-4/5" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
        <div className="skeleton h-4 w-10" />
        <div className="skeleton h-4 w-24" />
      </div>
    </div>
  );
}
