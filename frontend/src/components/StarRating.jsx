import { Star } from "lucide-react";

export default function StarRating({ value = 0, size = 18, showNumber = true }) {
  const v = Math.round(Number(value || 0));

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < v;
          return (
            <Star
              key={i}
              size={size}
              className={filled ? "text-amber-400 fill-amber-400 drop-shadow" : "text-white/30"}
            />
          );
        })}
      </div>

      {showNumber ? <span className="text-sm font-medium text-white/80">{v.toFixed(1)}</span> : null}
    </div>
  );
}

