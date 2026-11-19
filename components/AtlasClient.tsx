"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { IndiaMap, type MapTip } from "./IndiaMap";
import { TileMap } from "./TileMap";
import type { Jurisdiction } from "@/lib/types";
import type { PolicyLite } from "@/lib/data";
import { formatDate, levelFor } from "@/lib/data";
import { FAMILIES, FAMILY_SHORT, statusGroup, type Family } from "@/lib/taxonomy";
import { StatusPill, FamilyDot, ConfidenceMark } from "./ui";

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
  const [mode, setMode] = useState<"geo" | "tiles">("geo");
  const [fam, setFam] = useState<Family | "all">("all");
  const timer = useRef<number | null>(null);

  const jByCode = useMemo(() => new Map(jurisdictions.map((j) => [j.code, j])), [jurisdictions]);

  const filtered = useMemo(
    () =>
      policies.filter((p) => Number(p.date.slice(0, 4)) <= year && (fam === "all" || p.family === fam)),
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
        line: l ? `${l.title} · ${formatDate(l.date, l.date_precision)}` : "No instrument found",
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

  // escape to release
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const statesWithAny = jurisdictions.filter((j) => j.code !== "IN" && (counts[j.code] ?? 0) > 0).length;
  const unionCount = counts["IN"] ?? 0;
  const stateTotal = filtered.filter((p) => p.jurisdiction !== "IN").length;
  const active = filtered.filter((p) => statusGroup(p.status) === "active").length;
  const pending = filtered.filter((p) => statusGroup(p.status) === "pending").length;

  const sel = selected ? jByCode.get(selected) : null;
  const selPolicies = useMemo(
    () => (selected ? filtered.filter((p) => p.jurisdiction === selected) : []),
    [filtered, selected],
  );
  const latest = useMemo(() => filtered.slice(0, 7), [filtered]);

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* ---------- map column ---------- */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
            <div className="flex overflow-hidden rounded-[6px] border border-line text-[12.5px]">
              <button
                type="button"
                onClick={() => setMode("geo")}
                className={`px-3 py-1 ${mode === "geo" ? "bg-ink text-bg" : "text-ink-2 hover:bg-sunken"}`}
                aria-pressed={mode === "geo"}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setMode("tiles")}
                className={`px-3 py-1 ${mode === "tiles" ? "bg-ink text-bg" : "text-ink-2 hover:bg-sunken"}`}
                aria-pressed={mode === "tiles"}
              >
                Tiles
              </button>
            </div>
            <div className="ml-1 flex flex-wrap gap-1.5">
              <button type="button" className="chip" data-on={fam === "all"} onClick={() => setFam("all")}>
                All
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
            {selected && (
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="ml-auto rounded-[6px] border border-line px-2.5 py-1 text-[12.5px] text-ink-2 hover:bg-sunken"
              >
                Release · Esc
              </button>
            )}
          </div>

          <div className="relative mt-3">
            {mode === "geo" ? (
              <IndiaMap
                levels={levels}
                tips={tips}
                selected={selected}
                onSelect={setSelected}
                hovered={hovered}
                onHover={setHovered}
                className="mx-auto max-w-[760px]"
              />
            ) : (
              <div className="py-6">
                <TileMap
                  jurisdictions={jurisdictions}
                  levels={levels}
                  tips={tips}
                  selected={selected}
                  onSelect={setSelected}
                  onHover={setHovered}
                />
              </div>
            )}

            {/* legend */}
            <div className="pointer-events-none absolute bottom-2 left-0 hidden items-end gap-3 sm:flex">
              <div>
                <div className="eyebrow mb-1.5">Instruments</div>
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
            </div>
          </div>

          {/* time scrub */}
          <div className="mt-4 flex items-center gap-4 border-t border-line pt-4">
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
                id="year-scrub"
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
                aria-label="Show instruments up to year"
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

        {/* ---------- panel ---------- */}
        <aside className="min-w-0 lg:sticky lg:top-[72px] lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto lg:border-l lg:border-line lg:pl-8">
          {sel ? (
            <div key={sel.code}>
              <div className="eyebrow">{sel.type === "ut" ? "Union territory" : "State"} · {sel.region}</div>
              <h2 className="mt-1 font-serif text-[28px] leading-tight text-ink">{sel.name}</h2>
              <div className="mt-3 grid grid-cols-3 gap-3 border-y border-line py-3">
                <Mini label="Instruments" value={selPolicies.length} />
                <Mini label="Active" value={selPolicies.filter((p) => statusGroup(p.status) === "active").length} />
                <Mini label="Draft / proposed" value={selPolicies.filter((p) => statusGroup(p.status) === "pending").length} />
              </div>
              {selPolicies.length === 0 ? (
                <p className="mt-4 text-[13.5px] text-ink-2">
                  No AI-specific instrument found for {sel.name}
                  {year < years[1] ? ` up to ${year}` : ""}. If you know of one, see{" "}
                  <Link href="/method#contribute" className="text-accent">how to report it</Link>.
                </p>
              ) : (
                <ol className="mt-2 divide-y divide-line">
                  {selPolicies.map((p) => (
                    <li key={p.id} className="py-3">
                      <Link href={`/policy/${p.id}`} className="group block no-underline">
                        <div className="flex items-start gap-2">
                          <FamilyDot family={p.family} />
                          <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-medium leading-snug text-ink group-hover:text-accent">
                              {p.title}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-3">
                              <span className="font-mono tnum">{formatDate(p.date, p.date_precision)}</span>
                              <span>·</span>
                              <span className="truncate">{p.issuing_body}</span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2">
                              <StatusPill status={p.status} />
                              <ConfidenceMark level={p.confidence} withLabel={false} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
              <Link
                href={`/jurisdiction/${sel.code}`}
                className="mt-4 inline-flex items-center gap-1 text-[13.5px] text-accent hover:underline"
              >
                Full dossier for {sel.name} →
              </Link>
            </div>
          ) : (
            <div>
              <div className="eyebrow">As of {year}{fam !== "all" ? ` · ${FAMILY_SHORT[fam]} only` : ""}</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-5 border-b border-line pb-5">
                <Big value={unionCount} label="Union instruments" />
                <Big value={stateTotal} label="State & UT instruments" />
                <Big value={`${statesWithAny}/${jurisdictions.length - 1}`} label="States & UTs with at least one" />
                <Big value={active} label="Active" hint={`${pending} draft or proposed`} />
              </div>
              <div className="mt-5">
                <div className="flex items-baseline justify-between">
                  <div className="eyebrow">Most recent</div>
                  <Link href="/timeline" className="text-[12.5px] text-accent hover:underline">
                    Timeline →
                  </Link>
                </div>
                <ol className="mt-1 divide-y divide-line">
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
              <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">
                Click a state to isolate it. Drag the year to see adoption over time. Switch to tiles to give small states equal weight.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function Mini({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="font-serif text-[22px] leading-none tnum text-ink">{value}</div>
      <div className="mt-1 text-[11.5px] text-ink-3">{label}</div>
    </div>
  );
}

function Big({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div>
      <div className="font-serif text-[34px] leading-none tnum text-ink">{value}</div>
      <div className="mt-1.5 text-[12.5px] text-ink-2">{label}</div>
      {hint && <div className="text-[11.5px] text-ink-3">{hint}</div>}
    </div>
  );
}
