"use client";

import type { Jurisdiction } from "@/lib/types";
import type { MapTip } from "./IndiaMap";

interface Props {
  jurisdictions: Jurisdiction[];
  levels: Record<string, number>;
  tips: Record<string, MapTip>;
  selected: string | null;
  onSelect: (code: string | null) => void;
  onHover?: (code: string | null) => void;
}

const COLS = 7;
const ROWS = 8;

export function TileMap({ jurisdictions, levels, tips, selected, onSelect, onHover }: Props) {
  const tiles = jurisdictions.filter((j) => j.tile);
  return (
    <div
      className="mx-auto grid w-full max-w-[560px] gap-1.5"
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      role="group"
      aria-label="Tile map of India"
      onMouseLeave={() => onHover?.(null)}
    >
      {tiles.map((j) => {
        const [c, r] = j.tile as [number, number];
        const lvl = levels[j.code] ?? 0;
        const isSel = selected === j.code;
        const dim = selected && !isSel;
        const t = tips[j.code];
        return (
          <button
            key={j.code}
            type="button"
            onClick={() => onSelect(isSel ? null : j.code)}
            onMouseEnter={() => onHover?.(j.code)}
            aria-pressed={isSel}
            aria-label={`${j.name}: ${t?.total ?? 0} instruments`}
            title={`${j.name} · ${t?.total ?? 0}`}
            className="state-path relative aspect-square rounded-[4px] border-0 p-0 text-left transition-[opacity,transform] duration-300"
            data-level={lvl || undefined}
            data-selected={isSel || undefined}
            style={{
              gridColumn: c + 1,
              gridRow: r + 1,
              opacity: dim ? 0.18 : 1,
              transform: isSel ? "scale(1.08)" : undefined,
              boxShadow: isSel ? "0 0 0 2px var(--ink)" : undefined,
              stroke: "none",
            }}
          >
            <span
              className="absolute left-1.5 top-1 font-mono text-[10px] leading-none"
              style={{ color: lvl >= 4 ? "var(--bg-elev)" : "var(--ink-2)" }}
            >
              {j.code}
            </span>
            <span
              className="absolute bottom-1 right-1.5 font-mono text-[11px] leading-none tnum"
              style={{ color: lvl >= 4 ? "var(--bg-elev)" : "var(--ink-3)" }}
            >
              {t?.total ? t.total : ""}
            </span>
          </button>
        );
      })}
    </div>
  );
}
