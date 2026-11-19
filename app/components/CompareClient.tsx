"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo } from "react";
import type { Jurisdiction } from "@/lib/types";
import type { PolicyLite } from "@/lib/data";
import { formatDate } from "@/lib/data";
import { FAMILIES, FAMILY_SHORT, statusGroup, labelTheme } from "@/lib/taxonomy";
import { StatusPill, FamilyDot } from "./ui";

interface Props {
  policies: PolicyLite[];
  jurisdictions: Jurisdiction[];
  themes: string[];
}

const SLOTS = ["a", "b", "c"] as const;

export function CompareClient({ policies, jurisdictions, themes }: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const picks = SLOTS.map((s) => sp.get(s) ?? "");

  function setSlot(i: number, code: string) {
    const next = new URLSearchParams(sp.toString());
    if (code) next.set(SLOTS[i], code);
    else next.delete(SLOTS[i]);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const cols = useMemo(
    () =>
      picks.map((code) => {
        const j = jurisdictions.find((x) => x.code === code);
        const items = policies.filter((p) => p.jurisdiction === code);
        const themeSet = new Set(items.flatMap((p) => p.themes));
        return { code, j, items, themeSet };
      }),
    [picks, jurisdictions, policies],
  );

  const any = cols.some((c) => c.j);

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cols.map((c, i) => (
          <div key={i} className="min-w-0">
            <select
              id={`cmp-${i}`}
              value={c.code}
              onChange={(e) => setSlot(i, e.target.value)}
              className="h-10 w-full rounded-[6px] border border-line bg-elev px-3 text-[14px] text-ink"
              aria-label={`Jurisdiction ${i + 1}`}
            >
              <option value="">{i === 0 ? "Choose a jurisdiction" : "Add another"}</option>
              {jurisdictions.map((j) => (
                <option key={j.code} value={j.code}>
                  {j.code === "IN" ? "Union" : j.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {!any ? (
        <p className="mt-10 text-[14px] text-ink-3">Pick two or three jurisdictions to compare coverage, status and themes.</p>
      ) : (
        <>
          {/* headline numbers */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {cols.map((c, i) =>
              c.j ? (
                <div key={i} className="min-w-0 border-t-2 border-ink pt-3">
                  <Link href={`/jurisdiction/${c.code}`} className="font-serif text-[22px] text-ink hover:text-accent">
                    {c.j.code === "IN" ? "Union" : c.j.name}
                  </Link>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Num v={c.items.length} l="Instruments" />
                    <Num v={c.items.filter((p) => statusGroup(p.status) === "active").length} l="Active" />
                    <Num v={c.items.filter((p) => p.binding === "binding").length} l="Binding" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {FAMILIES.map((f) => {
                      const n = c.items.filter((p) => p.family === f).length;
                      return n ? (
                        <span key={f} className={`chip fam-${f}`}>
                          <span className="dot" style={{ background: "var(--fam)" }} />
                          {FAMILY_SHORT[f]} {n}
                        </span>
                      ) : null;
                    })}
                  </div>
                  <div className="mt-2 text-[12.5px] text-ink-3">
                    {c.items.length ? (
                      <>
                        First {formatDate(c.items[c.items.length - 1].date, "month")} · latest {formatDate(c.items[0].date, "month")}
                      </>
                    ) : (
                      "No instrument found"
                    )}
                  </div>
                </div>
              ) : (
                <div key={i} className="hidden md:block" />
              ),
            )}
          </div>

          {/* theme coverage grid */}
          <div className="mt-10">
            <div className="eyebrow">Theme coverage</div>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[12px] text-ink-3">
                    <th className="py-1.5 pr-4 font-normal">Theme</th>
                    {cols.map((c, i) => (
                      <th key={i} className="w-[140px] py-1.5 pr-4 font-normal">
                        {c.j ? (c.j.code === "IN" ? "Union" : c.j.name) : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {themes
                    .filter((t) => cols.some((c) => c.themeSet.has(t)))
                    .map((t) => (
                      <tr key={t} className="border-t border-line">
                        <td className="py-1.5 pr-4 text-ink-2">{labelTheme(t)}</td>
                        {cols.map((c, i) => {
                          const n = c.items.filter((p) => p.themes.includes(t)).length;
                          return (
                            <td key={i} className="py-1.5 pr-4">
                              {c.j ? (
                                n ? (
                                  <Link href={`/explore?j=${c.code}&theme=${t}`} className="inline-flex items-center gap-1.5 text-ink hover:text-accent">
                                    <span className="h-2.5 w-2.5 rounded-[2px] bg-accent" />
                                    <span className="font-mono text-[12px] tnum">{n}</span>
                                  </Link>
                                ) : (
                                  <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: "var(--map-empty)" }} />
                                )
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* lists */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {cols.map((c, i) =>
              c.j ? (
                <div key={i} className="min-w-0">
                  <div className="eyebrow">{c.j.code === "IN" ? "Union" : c.j.name} · instruments</div>
                  <ol className="mt-2 divide-y divide-line border-y border-line">
                    {c.items.map((p) => (
                      <li key={p.id} className="py-2.5">
                        <Link href={`/policy/${p.id}`} className="group flex items-start gap-2 no-underline">
                          <FamilyDot family={p.family} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13.5px] font-medium leading-snug text-ink group-hover:text-accent">{p.title}</span>
                            <span className="block font-mono text-[11.5px] tnum text-ink-3">{formatDate(p.date, p.date_precision)}</span>
                          </span>
                          <StatusPill status={p.status} />
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <div key={i} className="hidden md:block" />
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Num({ v, l }: { v: number; l: string }) {
  return (
    <div>
      <div className="font-serif text-[24px] leading-none tnum text-ink">{v}</div>
      <div className="mt-1 text-[11.5px] text-ink-3">{l}</div>
    </div>
  );
}
