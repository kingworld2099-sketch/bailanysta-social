export default function Loading() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3 px-4 py-6">
      <div className="skeleton h-24 w-full" />
      <div className="skeleton h-32 w-full" />
      <div className="skeleton h-32 w-full" />
    </div>
  );
}
