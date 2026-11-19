"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { IndiaMap, type MapTip } from "./IndiaMap";
import { StateWindow } from "./StateWindow";
import type { Jurisdiction } from "@/lib/types";
import type { PolicyLite } from "@/lib/data";
import { formatDate, levelFor } from "@/lib/data";
import { FAMILIES, FAMILY_SHORT, type Family } from "@/lib/taxonomy";
import { StatusPill, FamilyDot } from "./ui";

interface Props {
  policies: PolicyLite[];
  jurisdictions: Jurisdiction[];
  years: [number, number];
}

export function AtlasClient({ policies, jurisdictions, years }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [year, setYear] = useState<number>(years[1]);
  const [playing, setPlaying] = useState(false);
  const [fam, setFam] = useState<Family | "all">("all");
  const timer = useRef<number | null>(null);

  const jByCode = useMemo(() => new Map(jurisdictions.map((j) => [j.code, j])), [jurisdictions]);

  const filtered = useMemo(
    () => policies.filter((p) => Number(p.date.slice(0, 4)) <= year && (fam === "all" || p.family === fam)),
    [policies, year, fam],
  );

  const { levels, tips, counts } = useMemo(() => {
    const counts: Record<string, number> = {};
    const latest: Record<string, PolicyLite> = {};
    for (const p of filtered) {
      counts[p.jurisdiction] = (counts[p.jurisdiction] ?? 0) + 1;
      if (!latest[p.jurisdiction] || p.date > latest[p.jurisdiction].date) latest[p.jurisdiction] = p;
    }
    let max = 0;
    for (const [c, n] of Object.entries(counts)) if (c !== "IN" && n > max) max = n;
    const levels: Record<string, number> = {};
    const tips: Record<string, MapTip> = {};
    for (const j of jurisdictions) {
      if (j.code === "IN") continue;
      const n = counts[j.code] ?? 0;
      levels[j.code] = levelFor(n, max);
      const l = latest[j.code];
      tips[j.code] = {
        name: j.name,
        total: n,
        line: l ? `Latest: ${l.title} · ${formatDate(l.date, l.date_precision)}` : "None found",
      };
    }
    return { levels, tips, counts };
  }, [filtered, jurisdictions]);

  // play through years
  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => {
      setYear((y) => {
        if (y >= years[1]) {
          setPlaying(false);
          return y;
        }
        return y + 1;
      });
    }, 850);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [playing, years]);

  // escape closes the window
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // lock page scroll while the window is open
  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const states = jurisdictions.filter((j) => j.code !== "IN");

  const latest = useMemo(() => filtered.filter((p) => p.jurisdiction !== "IN").slice(0, 6), [filtered]);

  const sel = selected ? jByCode.get(selected) ?? null : null;
  const selPolicies = useMemo(
    () => (selected ? filtered.filter((p) => p.jurisdiction === selected) : []),
    [filtered, selected],
  );

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* controls */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Go to a state</span>
            <select
              className="h-8 appearance-none rounded-[8px] border border-line bg-elev pl-3 pr-8 text-[13px] text-ink"
              value=""
              onChange={(e) => e.target.value && setSelected(e.target.value)}
            >
              <option value="">Go to a state…</option>
              <option value="IN">Union (national)</option>
              {states
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((j) => (
                  <option key={j.code} value={j.code}>
                    {j.name} ({counts[j.code] ?? 0})
                  </option>
                ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M2 3.5 5 6.5 8 3.5" />
            </svg>
          </label>
          <button
            type="button"
            onClick={() => setSelected("IN")}
            className="h-8 rounded-[8px] border border-line bg-elev px-3 text-[13px] text-ink hover:bg-sunken"
          >
            Union (national)
          </button>
          <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
          <button type="button" className="chip" data-on={fam === "all"} onClick={() => setFam("all")}>
            All types
          </button>
          {FAMILIES.map((f) => (
            <button
              key={f}
              type="button"
              className={`chip fam-${f}`}
              data-on={fam === f}
              onClick={() => setFam(fam === f ? "all" : f)}
            >
              <span className="dot" style={{ background: "var(--fam)" }} aria-hidden />
              {FAMILY_SHORT[f]}
            </button>
          ))}
        </div>

        {/* map */}
        <div
          className={`relative mt-4 rounded-[12px] border border-line bg-elev px-4 pb-4 pt-6 sm:px-8 ${fam !== "all" ? `fam-${fam} fam-map` : ""}`}
        >
          <motion.p
            className="pointer-events-none absolute left-1/2 top-4 z-[1] -translate-x-1/2 rounded-full bg-ink px-3.5 py-1.5 text-[12.5px] text-bg shadow-[var(--shadow-1)]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: hovered ? 0 : 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            Click a state to see its top policies
          </motion.p>

          <IndiaMap
            levels={levels}
            tips={tips}
            selected={selected === "IN" ? null : selected}
            onSelect={setSelected}
            hovered={hovered}
            onHover={setHovered}
            className="mx-auto max-w-[640px]"
          />

          {/* legend */}
          <div className="pointer-events-none absolute bottom-24 left-6 hidden sm:block">
            <div className="eyebrow mb-1.5">Policies</div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-5 rounded-[2px]" style={{ background: "var(--map-empty)" }} />
              {[1, 2, 3, 4, 5, 6].map((l) => (
                <span key={l} className="h-3 w-5 rounded-[2px]" style={{ background: `var(--seq-${l})` }} />
              ))}
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-3">
              <span>none</span>
              <span>more</span>
            </div>
          </div>

          {/* time scrub */}
          <div className="mt-2 flex items-center gap-4 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => {
                if (!playing && year >= years[1]) setYear(years[0]);
                setPlaying((p) => !p);
              }}
              className="grid h-8 w-8 flex-none place-items-center rounded-full border border-line text-ink hover:bg-sunken"
              aria-label={playing ? "Pause" : "Play through years"}
            >
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <rect x="2" y="1.5" width="3" height="9" />
                  <rect x="7" y="1.5" width="3" height="9" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path d="M3 1.5v9l7-4.5z" />
                </svg>
              )}
            </button>
            <div className="min-w-0 flex-1">
              <input
                type="range"
                className="scrub"
                min={years[0]}
                max={years[1]}
                step={1}
                value={year}
                onChange={(e) => {
                  setPlaying(false);
                  setYear(Number(e.target.value));
                }}
                aria-label="Show policies up to year"
              />
              <div className="flex justify-between font-mono text-[10.5px] text-ink-3 tnum">
                <span>≤ {years[0]}</span>
                <span className="text-ink">
                  {year === years[0] ? `up to ${year}` : `through ${year}`}
                  {year === years[1] ? " (now)" : ""}
                </span>
                <span>{years[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* below the map: latest activity */}
      <section className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-6">
        <div>
          <div className="flex items-baseline justify-between">
            <div className="eyebrow">Latest</div>
            <Link href="/timeline" className="text-[12.5px] text-accent hover:underline">
              Timeline →
            </Link>
          </div>
          <ol className="mt-2 divide-y divide-line">
            {latest.map((p) => (
              <li key={p.id} className="py-2.5">
                <Link href={`/policy/${p.id}`} className="group block no-underline">
                  <div className="flex items-start gap-2">
                    <FamilyDot family={p.family} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium leading-snug text-ink group-hover:text-accent">
                        {p.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[12px] text-ink-3">
                        <span className="font-mono tnum">{formatDate(p.date, p.date_precision)}</span>
                        <span>·</span>
                        <span>{p.jurisdiction_name}</span>
                      </div>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <StateWindow
        jurisdiction={sel}
        policies={selPolicies}
        year={year}
        latestYear={years[1]}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
