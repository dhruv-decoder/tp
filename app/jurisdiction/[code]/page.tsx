import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JURISDICTIONS, jurisdictionByCode, policiesFor, formatDate, countBy, POLICIES } from "@/lib/data";
import { familyOf, FAMILIES, FAMILY_LABEL, statusGroup, labelTheme, INSTRUMENT_LABEL } from "@/lib/taxonomy";
import { StatusPill, ConfidenceMark, FamilyDot, Eyebrow, Stat } from "@/components/ui";
import { StateThumb } from "@/components/StateThumb";

export function generateStaticParams() {
  return JURISDICTIONS.map((j) => ({ code: j.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const j = jurisdictionByCode(code);
  if (!j) return {};
  const n = policiesFor(code).length;
  return {
    title: j.code === "IN" ? "Union of India" : j.name,
    description: `${n} AI policy instruments for ${j.name}, with sources.`,
  };
}

export default async function JurisdictionPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const j = jurisdictionByCode(code);
  if (!j) notFound();
  const list = policiesFor(code);
  const active = list.filter((p) => statusGroup(p.status) === "active").length;
  const pending = list.filter((p) => statusGroup(p.status) === "pending").length;
  const binding = list.filter((p) => p.binding === "binding").length;
  const themes = Object.entries(countBy(list, (p) => p.themes)).sort((a, b) => b[1] - a[1]);
  const byFamily = FAMILIES.map((f) => ({ f, items: list.filter((p) => familyOf(p.instrument_type) === f) })).filter(
    (g) => g.items.length > 0,
  );
  const earliest = list.length ? list[list.length - 1] : null;
  const latest = list.length ? list[0] : null;

  // neighbours by count for context
  const ranks = JURISDICTIONS.filter((x) => x.code !== "IN")
    .map((x) => ({ code: x.code, name: x.name, n: POLICIES.filter((p) => p.jurisdiction === x.code).length }))
    .sort((a, b) => b.n - a.n);
  const rank = ranks.findIndex((r) => r.code === code) + 1;

  return (
    <article className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-6">
      <nav className="text-[12.5px] text-ink-3" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Atlas</Link>
        <span className="mx-1.5">/</span>
        <span>{j.code === "IN" ? "Union" : j.type === "ut" ? "Union territory" : "State"}</span>
      </nav>

      <header className="mt-3 grid gap-6 border-b border-line pb-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <h1 className="font-serif text-[34px] font-medium leading-tight text-ink sm:text-[42px]">
            {j.code === "IN" ? "Union of India" : j.name}
          </h1>
          <div className="mt-1 text-[13.5px] text-ink-2">
            {j.code === "IN" ? "Central ministries, regulators, Parliament and courts" : `${j.region} · ${j.capital}`}
            {j.code !== "IN" && rank > 0 && list.length > 0 && (
              <span className="text-ink-3"> · ranked {rank} of {ranks.length} by instrument count</span>
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat label="Instruments" value={list.length} />
            <Stat label="Active" value={active} hint={pending ? `${pending} pending` : undefined} />
            <Stat label="Binding" value={binding} />
            <Stat
              label="Span"
              value={earliest && latest ? `${earliest.date.slice(0, 4)}–${latest.date.slice(2, 4)}` : "—"}
              hint={latest ? `latest ${formatDate(latest.date, latest.date_precision)}` : undefined}
            />
          </div>
        </div>
        {j.code !== "IN" && <StateThumb code={j.code} />}
      </header>

      {list.length === 0 ? (
        <p className="mt-8 max-w-[60ch] text-[15px] text-ink-2">
          No AI-specific instrument found for {j.name} in official sources as of the current dataset. General IT or
          startup policies that do not address AI are out of scope. If you know of one,{" "}
          <Link href="/method#contribute" className="text-accent">report it</Link>.
        </p>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            {byFamily.map((g) => (
              <section key={g.f} className="mb-8">
                <div className={`fam-${g.f} flex items-center gap-2`}>
                  <span className="dot" style={{ background: "var(--fam)" }} />
                  <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink-2">{FAMILY_LABEL[g.f]}</h2>
                  <span className="font-mono text-[12px] tnum text-ink-3">{g.items.length}</span>
                </div>
                <ol className="mt-2 divide-y divide-line border-y border-line">
                  {g.items.map((p) => (
                    <li key={p.id} className="py-3">
                      <Link href={`/policy/${p.id}`} className="group grid gap-1 no-underline sm:grid-cols-[110px_1fr_auto] sm:gap-4">
                        <span className="font-mono text-[12.5px] tnum text-ink-3">{formatDate(p.date, p.date_precision)}</span>
                        <span className="min-w-0">
                          <span className="block text-[15px] font-medium leading-snug text-ink group-hover:text-accent">{p.title}</span>
                          <span className="mt-0.5 block text-[12.5px] text-ink-3">
                            {p.issuing_body} · {INSTRUMENT_LABEL[p.instrument_type]}
                          </span>
                          <span className="mt-1 block max-w-[70ch] text-[13.5px] leading-relaxed text-ink-2">{p.summary}</span>
                        </span>
                        <span className="flex items-start gap-2 sm:flex-col sm:items-end">
                          <StatusPill status={p.status} />
                          <ConfidenceMark level={p.confidence} withLabel={false} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
          <aside className="min-w-0 lg:border-l lg:border-line lg:pl-8">
            <Eyebrow>Themes covered</Eyebrow>
            <ul className="mt-2 flex flex-col gap-1.5">
              {themes.map(([t, n]) => (
                <li key={t} className="flex items-center justify-between gap-3 text-[13px]">
                  <Link href={`/explore?j=${j.code}&theme=${t}`} className="text-ink-2 hover:text-ink">
                    {labelTheme(t)}
                  </Link>
                  <span className="font-mono text-[12px] tnum text-ink-3">{n}</span>
                </li>
              ))}
            </ul>
            {j.code !== "IN" && (
              <div className="mt-6">
                <Eyebrow>Compare</Eyebrow>
                <p className="mt-1 text-[13px] text-ink-2">
                  <Link href={`/compare?a=${j.code}`} className="text-accent hover:underline">
                    Put {j.name} next to another state →
                  </Link>
                </p>
              </div>
            )}
            <div className="mt-6">
              <Eyebrow>Download</Eyebrow>
              <p className="mt-1 flex gap-3 text-[13px]">
                <Link href={`/api/policies?j=${j.code}`} className="text-accent hover:underline">JSON</Link>
                <Link href={`/api/policies.csv?j=${j.code}`} className="text-accent hover:underline">CSV</Link>
              </p>
            </div>
          </aside>
        </div>
      )}
      <div className="mt-6 sr-only">
        <FamilyDot family="law" />
      </div>
    </article>
  );
}
