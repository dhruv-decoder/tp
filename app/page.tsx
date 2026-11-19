import Link from "next/link";
import { AtlasClient } from "@/components/AtlasClient";
import { FamilyBars } from "@/components/FamilyBars";
import { JURISDICTIONS, POLICIES, toLite, yearRange, countBy } from "@/lib/data";
import { familyOf, statusGroup, FAMILIES } from "@/lib/taxonomy";
import { StatusPill, FamilyDot } from "@/components/ui";
import { formatDate } from "@/lib/data";

export default function AtlasPage() {
  const lite = POLICIES.map(toLite);
  const years = yearRange();
  const byFamily = countBy(POLICIES, (p) => familyOf(p.instrument_type));
  const pending = POLICIES.filter((p) => statusGroup(p.status) === "pending").slice(0, 8);
  
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 pb-6 pt-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[62ch]">
            <h1 className="font-serif text-[34px] font-medium leading-[1.1] text-ink sm:text-[44px]">
              Where India regulates AI, and how firmly.
            </h1>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
              {POLICIES.length} instruments across the Union and {JURISDICTIONS.length - 1} states and union territories,
              each linked to its primary source and labelled with how sure we are.
            </p>
          </div>
        </div>
      </section>

      <AtlasClient policies={lite} jurisdictions={JURISDICTIONS} years={years} />

      <section className="mx-auto mt-16 grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-3">
        <div>
          <div className="eyebrow">By instrument family</div>
          <FamilyBars counts={FAMILIES.map((f) => ({ family: f, n: byFamily[f] ?? 0 }))} total={POLICIES.length} />
          <p className="mt-3 text-[12.5px] text-ink-3">
            Binding law is a small share. Most of India&apos;s AI governance sits in non-binding guidance, strategies and
            regulator circulars.
          </p>
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <div className="eyebrow">Pending: drafts, consultations, bills</div>
            <Link href="/explore?status=pending" className="text-[12.5px] text-accent hover:underline">
              All pending →
            </Link>
          </div>
          <ol className="mt-2 grid gap-x-8 sm:grid-cols-2">
            {pending.map((p) => (
              <li key={p.id} className="border-b border-line py-3">
                <Link href={`/policy/${p.id}`} className="group block no-underline">
                  <div className="flex items-start gap-2">
                    <FamilyDot family={familyOf(p.instrument_type)} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium leading-snug text-ink group-hover:text-accent">
                        {p.title}
                      </div>
                      <div className="mt-0.5 text-[12px] text-ink-3">
                        <span className="font-mono tnum">{formatDate(p.date, p.date_precision)}</span> · {p.jurisdiction_name} · {p.issuing_body}
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
    </>
  );
}
