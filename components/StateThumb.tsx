import { STATE_SHAPES, SHAPE_BY_CODE, MAP_W, MAP_H } from "@/lib/geo";

/** Small locator map: all of India faint, one state filled. Server-rendered SVG. */
export function StateThumb({ code }: { code: string }) {
  const s = SHAPE_BY_CODE.get(code);
  if (!s) return null;
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-auto w-full max-w-[280px] justify-self-end" aria-hidden>
      {STATE_SHAPES.map((x) => (
        <path
          key={x.code}
          d={x.d}
          fill={x.code === code ? "var(--accent)" : "var(--map-empty)"}
          stroke="var(--map-stroke)"
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
