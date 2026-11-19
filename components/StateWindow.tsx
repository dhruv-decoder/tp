"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Jurisdiction } from "@/lib/types";
import type { PolicyLite } from "@/lib/data";
import { briefingScore, formatDate } from "@/lib/data";
import { FAMILY_SHORT, INSTRUMENT_LABEL, statusGroup } from "@/lib/taxonomy";
import { StatusPill, ConfidenceMark } from "./ui";

const TOP_N = 5;

interface Props {
  jurisdiction: Jurisdiction | null;
  policies: PolicyLite[];
  year: number;
  latestYear: number;
  onClose: () => void;
}

/** Floating briefing for one state: headline numbers, then the top instruments, revealed one by one. */
export function StateWindow({ jurisdiction, policies, year, latestYear, onClose }: Props) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  const top = useMemo(
    () =>
      policies
        .slice()
        .sort((a, b) => briefingScore(b) - briefingScore(a) || (a.date < b.date ? 1 : -1))
        .slice(0, TOP_N),
    [policies],
  );
  const active = policies.filter((p) => statusGroup(p.status) === "active").length;
  const pending = policies.filter((p) => statusGroup(p.status) === "pending").length;
  const first = policies.reduce<PolicyLite | null>((m, p) => (!m || p.date < m.date ? p : m), null);

  useEffect(() => {
    if (jurisdiction) closeRef.current?.focus({ preventScroll: true });
  }, [jurisdiction]);

  return (
    <AnimatePresence>
      {jurisdiction && (
        <motion.div
          key="scrim"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgb(10_12_16/0.38)] backdrop-blur-[3px] sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            key={jurisdiction.code}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sw-title"
            className="relative flex max-h-[88vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[16px] border border-line bg-elev shadow-[var(--shadow-2)] sm:rounded-[16px]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="border-b border-line px-6 pb-5 pt-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="eyebrow">
                    {jurisdiction.type === "union" ? "Government of India" : jurisdiction.type === "ut" ? "Union territory" : "State"}
                    {jurisdiction.type !== "union" && ` · ${jurisdiction.region}`}
                    {year < latestYear && ` · up to ${year}`}
                  </div>
                  <h2 id="sw-title" className="mt-1 font-serif text-[30px] leading-tight text-ink sm:text-[34px]">
                    {jurisdiction.type === "union" ? "Union (national)" : jurisdiction.name}
                  </h2>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="grid h-9 w-9 flex-none place-items-center rounded-full border border-line text-ink-2 hover:bg-sunken hover:text-ink focus-visible:rounded-full"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    <path d="M2 2l10 10M12 2 2 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <Num value={policies.length} label="instruments" />
                <Num value={active} label="in force / adopted" />
                <Num value={pending} label="draft / proposed" />
              </div>
              {first && (
                <p className="mt-3 text-[12.5px] text-ink-3">
                  Earliest on record: {formatDate(first.date, first.date_precision)}
                </p>
              )}
            </div>

            {/* top instruments */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              {top.length === 0 ? (
                <p className="py-6 text-[14px] leading-relaxed text-ink-2">
                  No AI-specific instrument found
                  {year < latestYear ? ` up to ${year}` : ""}. Absence here means we found nothing official, not that
                  nothing exists.{" "}
                  <Link href="/method#contribute" className="text-accent">
                    Report one
                  </Link>
                  .
                </p>
              ) : (
                <>
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="eyebrow">
                      Top {top.length} of {policies.length}
                    </div>
                    <div className="text-[11.5px] text-ink-3">ranked by status, type, source, recency</div>
                  </div>
                  <ol className="mt-3 space-y-2.5">
                    {top.map((p, i) => (
                      <motion.li
                        key={p.id}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.09, duration: 0.36, ease: [0.2, 0.7, 0.2, 1] }}
                      >
                        <Link
                          href={`/policy/${p.id}`}
                          className={`brief-card group block rounded-[10px] border border-line bg-bg px-4 py-3.5 no-underline fam-${p.family}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 font-mono text-[12px] text-ink-3 tnum">{i + 1}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-ink-3">
                                <span className="inline-flex items-center gap-1.5 font-medium" style={{ color: "var(--fam)" }}>
                                  <span className="dot" style={{ background: "var(--fam)" }} aria-hidden />
                                  {INSTRUMENT_LABEL[p.instrument_type] ?? FAMILY_SHORT[p.family]}
                                </span>
                                <span>·</span>
                                <span className="font-mono tnum">{formatDate(p.date, p.date_precision)}</span>
                              </div>
                              <div className="mt-1 text-[15px] font-medium leading-snug text-ink group-hover:text-accent">
                                {p.title}
                              </div>
                              <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{p.summary}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                <StatusPill status={p.status} />
                                <ConfidenceMark level={p.confidence} />
                                <span className="truncate text-[12px] text-ink-3">{p.issuing_body}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.li>
                    ))}
                  </ol>
                </>
              )}
            </div>

            {/* footer */}
            <motion.div
              className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-sunken/50 px-6 py-4 sm:px-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 + top.length * 0.09 }}
            >
              <span className="text-[12px] text-ink-3">Esc to close</span>
              <Link
                href={`/jurisdiction/${jurisdiction.code}`}
                className="inline-flex items-center gap-2 rounded-[8px] bg-ink px-4 py-2 text-[13.5px] font-medium text-bg no-underline hover:opacity-90"
              >
                See all {policies.length} for {jurisdiction.type === "union" ? "the Union" : jurisdiction.name}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Num({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-serif text-[26px] leading-none tnum text-ink">{value}</div>
      <div className="mt-1 text-[12px] text-ink-3">{label}</div>
    </div>
  );
}
