export default function RatingSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Select rating"
      className="
        w-full min-w-35
        input
        px-4 py-3
        rounded-2xl
        bg-white/10
        border border-white/20
        text-white
        focus:outline-none
        focus:ring-2 focus:ring-cyan-300/50
        hover:bg-white/15
        transition
      "
    >
      <option value={0}>Select ⭐</option>
      {[1, 2, 3, 4, 5].map((n) => (
        <option key={n} value={n}>
          {n} Star{n > 1 ? "s" : ""}
        </option>
      ))}
    </select>
  );
}
