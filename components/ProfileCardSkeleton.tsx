export default function ProfileCardSkeleton() {
  return (
    <div className="card flex flex-col gap-2 p-5" style={{ borderLeft: "4px solid var(--border)" }}>
      <div className="flex items-center gap-2">
        <div className="skeleton h-5 w-32" />
        <div className="skeleton h-5 w-20 !rounded-full" />
      </div>
      <div className="skeleton h-3.5 w-40" />
      <div className="skeleton h-3.5 w-48" />
      <div className="skeleton mt-2 h-10 w-32" />
    </div>
  );
}
