export default function Avatar({ name = "User", role = "USER", size = 40 }) {
  const initials = String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className="grid place-items-center rounded-2xl ss-surface-2"
      style={{ width: size, height: size }}
      title={`${name} • ${role}`}
    >
      <div className="text-sm font-extrabold tracking-wide">{initials || "U"}</div>
    </div>
  );
}
