import type { Metadata } from "next";
import Link from "next/link";
import { JURISDICTIONS, POLICIES, countBy, levelFor } from "@/lib/data";
import { labelTheme } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Matrix",
  description: "Which jurisdictions address which AI policy themes.",
};

export default function MatrixPage() {
  const themeCounts = Object.entries(countBy(POLICIES, (p) => p.themes)).sort((a, b) => b[1] - a[1]);
  const themes = themeCounts.map(([t]) => t);
  const cols = JURISDICTIONS.filter((j) => POLICIES.some((p) => p.jurisdiction === j.code)).sort((a, b) => {
    if (a.code === "IN") return -1;
    if (b.code === "IN") return 1;
    const na = POLICIES.filter((p) => p.jurisdiction === a.code).length;
    const nb = POLICIES.filter((p) => p.jurisdiction === b.code).length;
    return nb - na || a.name.localeCompare(b.name);
  });

  const cell: Record<string, Record<string, number>> = {};
  for (const p of POLICIES) {
    cell[p.jurisdiction] ??= {};
    for (const t of p.themes) cell[p.jurisdiction][t] = (cell[p.jurisdiction][t] ?? 0) + 1;
  }
  const maxState = Math.max(1, ...cols.filter((c) => c.code !== "IN").flatMap((c) => Object.values(cell[c.code] ?? {})));
  const maxUnion = Math.max(1, ...Object.values(cell["IN"] ?? {}));

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 pb-5 pt-8 sm:px-6">
        <h1 className="font-serif text-[30px] font-medium leading-tight text-ink">Matrix</h1>
        <p className="mt-1 max-w-[60ch] text-[14px] text-ink-2">
          Themes down, jurisdictions across. A cell is the number of instruments that touch that theme. Union and
          state columns are shaded on separate scales.
        </p>
      </section>
      <div className="mx-auto max-w-[1440px] overflow-x-auto px-4 sm:px-6">
        <table className="border-separate border-spacing-0 text-[12.5px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-bg pr-4 text-left font-medium text-ink-3">Theme</th>
              {cols.map((c) => (
                <th key={c.code} className="h-[96px] w-[34px] min-w-[34px] align-bottom font-normal">
                  <Link
                    href={`/jurisdiction/${c.code}`}
                    className="block origin-bottom-left -rotate-[60deg] translate-x-[14px] whitespace-nowrap text-[12px] text-ink-2 hover:text-ink"
                    title={c.name}
                  >
                    {c.code === "IN" ? "Union" : c.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {themes.map((t) => (
              <tr key={t}>
                <th className="sticky left-0 z-10 bg-bg pr-4 text-left font-normal text-ink-2">
                  <Link href={`/explore?theme=${t}`} className="whitespace-nowrap hover:text-ink">
                    {labelTheme(t)}
                  </Link>
                  <span className="ml-2 font-mono text-[11px] tnum text-ink-3">{themeCounts.find((x) => x[0] === t)?.[1]}</span>
                </th>
                {cols.map((c) => {
                  const n = cell[c.code]?.[t] ?? 0;
                  const lvl = levelFor(n, c.code === "IN" ? maxUnion : maxState);
                  return (
                    <td key={c.code} className="p-[2px]">
                      {n ? (
                        <Link
                          href={`/explore?j=${c.code}&theme=${t}`}
                          className="grid h-[30px] w-[30px] place-items-center rounded-[3px] font-mono text-[11px] tnum no-underline"
                          style={{ background: `var(--seq-${lvl})`, color: lvl >= 4 ? "var(--bg-elev)" : "var(--ink-2)" }}
                          title={`${c.name} · ${labelTheme(t)} · ${n}`}
                        >
                          {n}
                        </Link>
                      ) : (
                        <span className="block h-[30px] w-[30px] rounded-[3px]" style={{ background: "var(--map-empty)", opacity: 0.5 }} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
