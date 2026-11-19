import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POLICIES, policyById, jurisdictionByCode, formatDate, hostOf } from "@/lib/data";
import {
  familyOf,
  FAMILY_LABEL,
  INSTRUMENT_LABEL,
  labelTheme,
  labelSector,
} from "@/lib/taxonomy";
import { StatusPill, ConfidenceMark, FamilyDot, ExternalLink, Eyebrow } from "@/components/ui";
import { CopyButton } from "@/components/CopyButton";

export function generateStaticParams() {
  return POLICIES.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = policyById(id);
  if (!p) return {};
  return { title: p.title, description: p.summary };
}

export default async function PolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = policyById(id);
  if (!p) notFound();
  const j = jurisdictionByCode(p.jurisdiction);
  const family = familyOf(p.instrument_type);
  const related = p.related.map((r) => policyById(r)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const siblings = POLICIES.filter((x) => x.jurisdiction === p.jurisdiction && x.id !== p.id).slice(0, 5);
  const timeline = p.timeline.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  const citation = `${p.issuing_body}. "${p.title}" (${formatDate(p.date, p.date_precision)}). ${p.source_url}`;

  return (
    <article className="mx-auto max-w-[1200px] px-4 pb-10 pt-8 sm:px-6">
      <nav className="text-[12.5px] text-ink-3" aria-label="Breadcrumb">
        <Link href="/explore" className="hover:text-ink">Policies</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/jurisdiction/${p.jurisdiction}`} className="hover:text-ink">{p.jurisdiction_name}</Link>
      </nav>

      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`fam-${family} inline-flex items-center gap-1.5 text-[12.5px] text-ink-2`}>
              <span className="dot" style={{ background: "var(--fam)" }} />
              {FAMILY_LABEL[family]} · {INSTRUMENT_LABEL[p.instrument_type]}
            </span>
            <StatusPill status={p.status} />
            <span className="chip">{p.binding === "binding" ? "Binding" : p.binding === "mixed" ? "Partly binding" : "Non-binding"}</span>
          </div>
          <h1 className="mt-3 font-serif text-[30px] font-medium leading-[1.15] text-ink sm:text-[38px]">{p.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-ink-2">
            <span>{p.issuing_body}</span>
            <span className="text-ink-3">·</span>
            <span className="font-mono tnum">{formatDate(p.date, p.date_precision)}</span>
            {j && (
              <>
                <span className="text-ink-3">·</span>
                <Link href={`/jurisdiction/${j.code}`} className="hover:text-ink">
                  {j.code === "IN" ? "Union" : j.name}
                </Link>
              </>
            )}
          </div>

          <p className="measure mt-6 text-[16px] leading-relaxed text-ink">{p.summary}</p>

          {p.key_provisions.length > 0 && (
            <section className="mt-8">
              <Eyebrow>Key provisions</Eyebrow>
              <ul className="measure mt-2 flex flex-col gap-2 text-[14.5px] leading-relaxed text-ink">
                {p.key_provisions.map((k, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-ink-3" aria-hidden />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {timeline.length > 0 && (
            <section className="mt-8">
              <Eyebrow>Timeline</Eyebrow>
              <ol className="mt-3 border-l border-line-strong pl-5">
                {timeline.map((t, i) => (
                  <li key={i} className="relative pb-4 last:pb-0">
                    <span className="absolute -left-[25px] top-[6px] h-2.5 w-2.5 rounded-full border-2 border-bg bg-ink" aria-hidden />
                    <div className="font-mono text-[12px] tnum text-ink-3">{formatDate(t.date)}</div>
                    <div className="text-[14px] text-ink">{t.event}</div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="mt-8">
            <Eyebrow>Sources</Eyebrow>
            <ul className="mt-2 flex flex-col gap-1.5 text-[14px]">
              <li className="flex flex-wrap items-baseline gap-2">
                <ExternalLink href={p.source_url}>{hostOf(p.source_url)}</ExternalLink>
                <span className="chip">{p.source_type}</span>
                {(p.source_type === "news" || p.source_type === "secondary") && (
                  <span className="text-[12.5px] text-ink-3">official document not found</span>
                )}
              </li>
              {p.secondary_sources.map((s) => (
                <li key={s}>
                  <ExternalLink href={s}>{hostOf(s)}</ExternalLink>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-[8px] border border-line bg-elev p-4">
            <div className="flex items-center justify-between gap-3">
              <ConfidenceMark level={p.confidence} />
              <span className="font-mono text-[11.5px] tnum text-ink-3">verified {p.last_verified}</span>
            </div>
            {p.confidence_note && <p className="mt-2 text-[14px] leading-relaxed text-ink">{p.confidence_note}</p>}
            <p className="mt-3 text-[12.5px] text-ink-3">
              Spotted an error?{" "}
              <a
                href={`https://github.com/dhruv-decoder/tp/issues/new?title=${encodeURIComponent(`Correction: ${p.title}`)}&body=${encodeURIComponent(`Entry: ${p.id}\n\nWhat is wrong:\n\nSource:\n`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Report a correction
              </a>
              .
            </p>
          </section>
        </div>

        <aside className="min-w-0 lg:border-l lg:border-line lg:pl-8">
          <Eyebrow>Themes</Eyebrow>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.themes.map((t) => (
              <Link key={t} href={`/explore?theme=${t}`} className="chip no-underline hover:border-ink">
                {labelTheme(t)}
              </Link>
            ))}
          </div>
          <Eyebrow>
            <span className="mt-5 block">Sectors</span>
          </Eyebrow>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {p.sectors.map((s) => (
              <Link key={s} href={`/explore?sector=${s}`} className="chip no-underline hover:border-ink">
                {labelSector(s)}
              </Link>
            ))}
          </div>

          {related.length > 0 && (
            <section className="mt-6">
              <Eyebrow>Related</Eyebrow>
              <ul className="mt-2 divide-y divide-line">
                {related.map((r) => (
                  <li key={r.id} className="py-2">
                    <Link href={`/policy/${r.id}`} className="group flex items-start gap-2 no-underline">
                      <FamilyDot family={familyOf(r.instrument_type)} />
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-medium leading-snug text-ink group-hover:text-accent">{r.title}</span>
                        <span className="block text-[12px] text-ink-3">
                          {r.jurisdiction_name} · {formatDate(r.date, r.date_precision)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {siblings.length > 0 && (
            <section className="mt-6">
              <Eyebrow>Also from {p.jurisdiction_name}</Eyebrow>
              <ul className="mt-2 divide-y divide-line">
                {siblings.map((r) => (
                  <li key={r.id} className="py-2">
                    <Link href={`/policy/${r.id}`} className="group flex items-start gap-2 no-underline">
                      <FamilyDot family={familyOf(r.instrument_type)} />
                      <span className="min-w-0">
                        <span className="block text-[13.5px] leading-snug text-ink group-hover:text-accent">{r.title}</span>
                        <span className="block text-[12px] text-ink-3">{formatDate(r.date, r.date_precision)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-6">
            <Eyebrow>Cite</Eyebrow>
            <p className="mt-2 break-words rounded-[6px] bg-sunken p-3 font-mono text-[11.5px] leading-relaxed text-ink-2">{citation}</p>
            <div className="mt-2 flex items-center gap-3 text-[12.5px]">
              <CopyButton text={citation} label="Copy citation" />
            </div>
          </section>
        </aside>
      </div>
    </article>
  );
}
