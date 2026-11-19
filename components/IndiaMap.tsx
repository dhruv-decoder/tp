"use client";

import { useMemo, useRef, useState } from "react";
import { STATE_SHAPES, SHAPE_BY_CODE, MAP_W, MAP_H } from "@/lib/geo";

export interface MapTip {
  name: string;
  total: number;
  line?: string;
}

interface Props {
  levels: Record<string, number>;
  tips: Record<string, MapTip>;
  selected: string | null;
  onSelect: (code: string | null) => void;
  hovered?: string | null;
  onHover?: (code: string | null) => void;
  className?: string;
}

const LABEL_MIN_W = 34;

export function IndiaMap({ levels, tips, selected, onSelect, hovered, onHover, className }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ code: string; x: number; y: number; w: number } | null>(null);

  const transform = useMemo(() => {
    if (!selected) return { k: 1, tx: 0, ty: 0 };
    const s = SHAPE_BY_CODE.get(selected);
    if (!s) return { k: 1, tx: 0, ty: 0 };
    const [[x0, y0], [x1, y1]] = s.bbox;
    const bw = Math.max(x1 - x0, 1);
    const bh = Math.max(y1 - y0, 1);
    const k = Math.min(2.3, Math.max(1.15, 0.5 * Math.min(MAP_W / bw, MAP_H / bh)));
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    return { k, tx: MAP_W / 2 - cx * k, ty: MAP_H / 2 - cy * k };
  }, [selected]);

  function move(e: React.MouseEvent, code: string) {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    setTip({ code, x: e.clientX - r.left, y: e.clientY - r.top, w: r.width });
  }

  const tipData = tip ? tips[tip.code] : null;

  return (
    <div ref={wrap} className={`relative ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className={`h-auto w-full select-none ${selected ? "map-isolated" : ""}`}
        role="group"
        aria-label="Map of India by state and union territory"
        onMouseLeave={() => {
          setTip(null);
          onHover?.(null);
        }}
      >
        <g
          style={{
            transform: `translate(${transform.tx}px, ${transform.ty}px) scale(${transform.k})`,
            transformOrigin: "0 0",
            transition: "transform 640ms cubic-bezier(0.2, 0.7, 0.2, 1)",
          }}
        >
          {STATE_SHAPES.map((s) => {
            const lvl = levels[s.code] ?? 0;
            const isSel = selected === s.code;
            return (
              <path
                key={s.code}
                d={s.d}
                className="state-path"
                data-level={lvl || undefined}
                data-selected={isSel || undefined}
                data-hover={hovered === s.code || undefined}
                vectorEffect="non-scaling-stroke"
                role="button"
                tabIndex={0}
                aria-label={`${tips[s.code]?.name ?? s.name}: ${tips[s.code]?.total ?? 0} instruments`}
                aria-pressed={isSel}
                onClick={() => onSelect(isSel ? null : s.code)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(isSel ? null : s.code);
                  }
                }}
                onMouseEnter={(e) => {
                  move(e, s.code);
                  onHover?.(s.code);
                }}
                onMouseMove={(e) => move(e, s.code)}
              />
            );
          })}
          {/* labels */}
          {STATE_SHAPES.map((s) => {
            const [[x0], [x1]] = s.bbox;
            if (x1 - x0 < LABEL_MIN_W && selected !== s.code) return null;
            const lvl = levels[s.code] ?? 0;
            const dim = selected && selected !== s.code;
            return (
              <text
                key={`l-${s.code}`}
                x={s.centroid[0]}
                y={s.centroid[1]}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10 / Math.sqrt(transform.k)}
                fontFamily="var(--font-mono)"
                fill={lvl >= 4 ? "var(--bg-elev)" : "var(--ink-2)"}
                opacity={dim ? 0 : 0.9}
                style={{ pointerEvents: "none", transition: "opacity 320ms ease" }}
              >
                {s.code}
              </text>
            );
          })}
        </g>
      </svg>

      {tip && tipData && (
        <div
          className="pointer-events-none absolute z-10 w-max max-w-[260px] rounded-[6px] border border-line bg-elev px-3 py-2 shadow-[var(--shadow-2)]"
          style={{
            left: Math.max(0, Math.min(tip.x + 14, tip.w - 270)),
            top: tip.y + 14,
          }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[13px] font-medium text-ink">{tipData.name}</span>
            <span className="font-mono text-[12px] tnum text-ink-2">{tipData.total}</span>
          </div>
          {tipData.line && <div className="mt-0.5 text-[12px] leading-snug text-ink-2">{tipData.line}</div>}
        </div>
      )}
    </div>
  );
}
