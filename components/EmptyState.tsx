export default function EmptyState({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 p-8 text-center">
      <div className="text-4xl">🌙</div>
      <p style={{ color: "var(--fg-muted)" }}>{title}</p>
      {action}
    </div>
  );
}
