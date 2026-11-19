import { FAMILY_LABEL, type Family } from "@/lib/taxonomy";

export function FamilyBars({ counts, total }: { counts: { family: Family; n: number }[]; total: number }) {
  const max = Math.max(1, ...counts.map((c) => c.n));
  return (
    <ul className="mt-3 flex flex-col gap-2">
      {counts.map((c) => (
        <li key={c.family} className={`fam-${c.family} grid grid-cols-[150px_1fr_auto] items-center gap-3 text-[13px]`}>
          <span className="truncate text-ink-2">{FAMILY_LABEL[c.family]}</span>
          <span className="h-[10px] w-full overflow-hidden rounded-[2px] bg-sunken">
            <span
              className="block h-full rounded-[2px]"
              style={{ width: `${(c.n / max) * 100}%`, background: "var(--fam)" }}
            />
          </span>
          <span className="w-16 text-right font-mono text-[12px] tnum text-ink-2">
            {c.n} <span className="text-ink-3">{total ? Math.round((c.n / total) * 100) : 0}%</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
