"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PolicyLite } from "@/lib/data";
import { formatDate } from "@/lib/data";
import { FAMILIES, FAMILY_SHORT, FAMILY_LABEL, statusGroup, type Family } from "@/lib/taxonomy";
import { StatusPill, FamilyDot } from "./ui";

interface Props {
  policies: PolicyLite[];
  years: [number, number];
}

const LANES: { key: string; label: string; match: (p: PolicyLite) => boolean }[] = [
  { key: "union-law", label: "Union · law & courts", match: (p) => p.jurisdiction === "IN" && (p.family === "law" || p.family === "judicial") },
  { key: "union-policy", label: "Union · policy & guidance", match: (p) => p.jurisdiction === "IN" && (p.family === "policy" || p.family === "guidance" || p.family === "institution") },
  { key: "union-delib", label: "Union · consultations & reports", match: (p) => p.jurisdiction === "IN" && p.family === "deliberation" },
  { key: "intl", label: "International", match: (p) => p.family === "international" },
  { key: "states", label: "States & UTs", match: (p) => p.jurisdiction !== "IN" && p.family !== "international" },
];

export function TimelineClient({ policies, years }: Props) {
  const [fam, setFam] = useState<Family | "all">("all");
  const [hover, setHover] = useState<PolicyLite | null>(null);
  const [selYear, setSelYear] = useState<number | null>(null);

  const visible = useMemo(() => policies.filter((p) => fam === "all" || p.family === fam), [policies, fam]);

  // histogram per year, stacked by family
  const hist = useMemo(() => {
    const out: Record<number, Record<Family, number>> = {};
    for (let y = years[0]; y <= years[1]; y++) out[y] = Object.fromEntries(FAMILIES.map((f) => [f, 0])) as Record<Family, number>;
    for (const p of visible) {
      const y = Math.max(years[0], Number(p.date.slice(0, 4)));
      if (out[y]) out[y][p.family] += 1;
    }
    return out;
  }, [visible, years]);
  const histMax = Math.max(1, ...Object.values(hist).map((r) => Object.values(r).reduce((a, b) => a + b, 0)));

  // strip plot geometry
  const W = 1200;
  const padL = 190;
  const padR = 24;
  const laneH = 64;
  const H = LANES.length * laneH + 40;
  const t0 = new Date(`${years[0]}-01-01`).getTime();
  const t1 = new Date(`${years[1]}-12-31`).getTime();
  const x = (d: string) => padL + 10 + (Math.max(0, new Date(d).getTime() - t0) / (t1 - t0)) * (W - padL - padR - 10);

  const dots = useMemo(() => {
    // simple collision avoidance: stack dots vertically within a lane when x overlaps
    const res: { p: PolicyLite; cx: number; cy: number }[] = [];
    LANES.forEach((lane, li) => {
      const items = visible.filter(lane.match).sort((a, b) => (a.date < b.date ? -1 : 1));
      const placed: { cx: number; cy: number }[] = [];
      for (const p of items) {
        const cx = x(p.date);
        let row = 0;
        // find a free row (alternate above/below centre)
        const offsets = [0, -1, 1, -2, 2, -3, 3, -4, 4];
        for (const o of offsets) {
          const cy = 20 + li * laneH + laneH / 2 + o * 9;
          if (!placed.some((q) => Math.abs(q.cx - cx) < 8 && Math.abs(q.cy - cy) < 8)) {
            row = o;
            break;
          }
        }
        const cy = 20 + li * laneH + laneH / 2 + row * 9;
        placed.push({ cx, cy });
        res.push({ p, cx, cy });
      }
    });
    return res;
  }, [visible, x]);

  const yearList = useMemo(() => {
    const ys: number[] = [];
    for (let y = years[0]; y <= years[1]; y++) ys.push(y);
    return ys;
  }, [years]);

  const listed = useMemo(
    () => (selYear ? visible.filter((p) => Math.max(years[0], Number(p.date.slice(0, 4))) === selYear) : visible.slice(0, 40)),
    [visible, selYear, years],
  );

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-line pb-3">
        <button type="button" className="chip" data-on={fam === "all"} onClick={() => setFam("all")}>
          All
        </button>
        {FAMILIES.map((f) => (
          <button key={f} type="button" className={`chip fam-${f}`} data-on={fam === f} onClick={() => setFam(fam === f ? "all" : f)}>
            <span className="dot" style={{ background: "var(--fam)" }} aria-hidden />
            {FAMILY_SHORT[f]}
          </button>
        ))}
        <span className="ml-auto font-mono text-[12px] tnum text-ink-3">{visible.length} instruments</span>
      </div>

      {/* histogram */}
      <div className="mt-6">
        <div className="eyebrow">Instruments per year</div>
        <div className="mt-2 flex items-end gap-1.5 sm:gap-2" style={{ height: 190 }}>
          {yearList.map((y) => {
            const row = hist[y];
            const total = Object.values(row).reduce((a, b) => a + b, 0);
            const on = selYear === y;
            return (
              <button
                key={y}
                type="button"
                onClick={() => setSelYear(on ? null : y)}
                className="group flex h-full flex-1 flex-col justify-end"
                aria-pressed={on}
                aria-label={`${y}: ${total} instruments`}
              >
                <span className="mb-1 text-center font-mono text-[11px] tnum text-ink-2 opacity-0 transition-opacity group-hover:opacity-100 aria-pressed:opacity-100" style={{ opacity: on ? 1 : undefined }}>
                  {total}
                </span>
                <span className="flex w-full flex-col-reverse overflow-hidden rounded-t-[3px]" style={{ height: `${(total / histMax) * 100}%`, minHeight: total ? 2 : 0, opacity: selYear && !on ? 0.35 : 1 }}>
                  {FAMILIES.map((f) =>
                    row[f] ? (
                      <span
                        key={f}
                        className={`fam-${f} block w-full`}
                        style={{ height: `${(row[f] / total) * 100}%`, background: "var(--fam)", boxShadow: "0 -1px 0 var(--bg)" }}
                      />
                    ) : null,
                  )}
                </span>
                <span className={`mt-1.5 text-center font-mono text-[11px] tnum ${on ? "text-ink" : "text-ink-3"}`}>{y === years[0] ? `≤${String(y).slice(2)}` : String(y).slice(2)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* strip plot */}
      <div className="mt-10 overflow-x-auto">
        <div className="eyebrow">Every instrument by date</div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-auto w-full min-w-[900px]" role="img" aria-label="Timeline of instruments by lane">
          {yearList.map((y) => {
            const gx = x(`${y}-01-01`);
            return (
              <g key={y}>
                <line x1={gx} x2={gx} y1={14} y2={H - 20} stroke="var(--line)" strokeDasharray="2 4" />
                <text x={gx + 3} y={10} fontSize={10} fontFamily="var(--font-mono)" fill="var(--ink-3)">
                  {y === years[0] ? `≤ ${y}` : y}
                </text>
              </g>
            );
          })}
          {LANES.map((lane, li) => (
            <g key={lane.key}>
              <line x1={padL} x2={W - padR} y1={20 + li * laneH + laneH / 2} y2={20 + li * laneH + laneH / 2} stroke="var(--line-strong)" />
              <text x={0} y={20 + li * laneH + laneH / 2 + 4} fontSize={12} fill="var(--ink-2)" fontFamily="var(--font-sans)">
                {lane.label}
              </text>
            </g>
          ))}
          {dots.map(({ p, cx, cy }) => {
            const g = statusGroup(p.status);
            const dim = selYear && Math.max(years[0], Number(p.date.slice(0, 4))) !== selYear;
            return (
              <Link key={p.id} href={`/policy/${p.id}`}>
                <circle
                  className={`fam-${p.family}`}
                  cx={cx}
                  cy={cy}
                  r={hover?.id === p.id ? 6.5 : 4.5}
                  fill={g === "pending" ? "var(--bg)" : "var(--fam)"}
                  stroke="var(--fam)"
                  strokeWidth={g === "pending" ? 1.8 : 0}
                  opacity={dim ? 0.15 : 0.9}
                  style={{ transition: "r 120ms ease, opacity 200ms ease" }}
                  onMouseEnter={() => setHover(p)}
                  onMouseLeave={() => setHover(null)}
                />
              </Link>
            );
          })}
        </svg>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink-3" /> active or adopted
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-ink-3" /> draft, consultation or proposed
          </span>
          <span className="ml-auto h-5 truncate">
            {hover ? (
              <>
                <span className="text-ink">{hover.title}</span> · {hover.jurisdiction_name} · {formatDate(hover.date, hover.date_precision)}
              </>
            ) : (
              "Hover a dot. Click a bar to filter by year."
            )}
          </span>
        </div>
      </div>

      {/* list */}
      <div className="mt-10">
        <div className="flex items-baseline justify-between">
          <div className="eyebrow">{selYear ? `${selYear} · ${listed.length} instruments` : "Most recent 40"}</div>
          {selYear && (
            <button type="button" onClick={() => setSelYear(null)} className="text-[12.5px] text-accent hover:underline">
              Show all years
            </button>
          )}
        </div>
        <ol className="mt-2 divide-y divide-line border-y border-line">
          {listed.map((p) => (
            <li key={p.id} className="py-3">
              <Link href={`/policy/${p.id}`} className="group grid gap-1 no-underline sm:grid-cols-[110px_1fr_auto] sm:gap-4">
                <span className="font-mono text-[12.5px] tnum text-ink-3">{formatDate(p.date, p.date_precision)}</span>
                <span className="min-w-0">
                  <span className="flex items-start gap-2">
                    <FamilyDot family={p.family} />
                    <span className="block text-[14.5px] font-medium leading-snug text-ink group-hover:text-accent">{p.title}</span>
                  </span>
                  <span className="mt-0.5 block pl-[18px] text-[12.5px] text-ink-3">
                    {p.jurisdiction_name} · {p.issuing_body} · {FAMILY_LABEL[p.family]}
                  </span>
                </span>
                <StatusPill status={p.status} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
