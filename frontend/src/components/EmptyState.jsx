export default function EmptyState({ title = "No results", subtitle = "Try adjusting your filters." }) {
  return (
    <div className="card p-6">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/60">{subtitle}</div>
    </div>
  );
}
