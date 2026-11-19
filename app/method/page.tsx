import type { Metadata } from "next";
import Link from "next/link";
import { CHANGELOG, DATASET_VERSION, DATASET_UPDATED, POLICIES, countBy } from "@/lib/data";
import { CONFIDENCE_LABEL, CONFIDENCE_HELP, FAMILIES, FAMILY_LABEL, INSTRUMENT_LABEL, familyOf } from "@/lib/taxonomy";
import type { InstrumentType } from "@/lib/types";
import { ConfidenceMark, Eyebrow, ExternalLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Method",
  description: "How instruments are selected, sourced, dated and labelled; how to use the data and report corrections.",
};

const REPO = "https://github.com/dhruv-decoder/tp";

export default function MethodPage() {
  const conf = countBy(POLICIES, (p) => p.confidence);
  const src = countBy(POLICIES, (p) => p.source_type);
  const typesByFamily = FAMILIES.map((f) => ({
    f,
    types: (Object.keys(INSTRUMENT_LABEL) as InstrumentType[]).filter((t) => familyOf(t) === f),
  }));

  return (
    <article className="mx-auto max-w-[1440px] px-4 pb-10 pt-8 sm:px-6">
      <h1 className="font-serif text-[30px] font-medium leading-tight text-ink">Method</h1>
      <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="measure min-w-0 text-[15px] leading-relaxed text-ink">
          <section id="scope">
            <h2 className="font-serif text-[22px] text-ink">What counts</h2>
            <p className="mt-2 text-ink-2">
              An entry is a specific instrument issued by a public authority in India that addresses AI directly, or that
              governs AI systems in a way the authority itself made explicit. The Union, all 28 states and 8 union
              territories, sectoral regulators, Parliament, courts and India&apos;s formal international commitments are in
              scope.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-2">
              <li>Included: Acts, rules, amendments, bills, ordinances, gazette notifications, cabinet-approved policies, drafts out for consultation, strategies, frameworks, guidelines, advisories, standards, government-commissioned committee reports, regulator circulars, court rulings that set AI-relevant precedent, funded missions and schemes, institutions created, declarations India signed or hosted, curriculum mandates, procurement rules.</li>
              <li>Excluded: speeches, single-company MoUs, hackathons and summits without policy content, think-tank papers not commissioned by government. These may appear as secondary sources.</li>
              <li>An Act, its Rules and each amendment are separate entries, linked through the related list.</li>
            </ul>
          </section>

          <section id="families" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Families and types</h2>
            <p className="mt-2 text-ink-2">
              Every instrument has one type. Types roll up into seven families, which carry the colour used on every chart.
            </p>
            <ul className="mt-3 space-y-2">
              {typesByFamily.map(({ f, types }) => (
                <li key={f} className={`fam-${f} flex items-start gap-2 text-[14px]`}>
                  <span className="dot mt-[7px]" style={{ background: "var(--fam)" }} />
                  <span>
                    <span className="font-medium text-ink">{FAMILY_LABEL[f]}</span>
                    <span className="text-ink-2"> · {types.map((t) => INSTRUMENT_LABEL[t]).join(", ")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section id="status" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Status and binding</h2>
            <p className="mt-2 text-ink-2">
              Status reflects the instrument&apos;s own life cycle as of the last verification date, not its practical
              effect. &quot;In force&quot; is used for law that has commenced; &quot;adopted&quot; for policies, guidelines and
              reports formally released; &quot;draft&quot;, &quot;consultation&quot;, &quot;proposed&quot; and &quot;announced&quot; for
              instruments that are not yet final. Binding means the instrument creates enforceable obligations on
              someone other than the issuing body.
            </p>
          </section>

          <section id="confidence" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Confidence</h2>
            <p className="mt-2 text-ink-2">
              Each entry carries a confidence label and a note that says what was and was not verified. The label is
              about our sourcing, not about the instrument&apos;s importance.
            </p>
            <ul className="mt-3 space-y-3">
              {(["high", "medium", "low"] as const).map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <ConfidenceMark level={c} withLabel={false} />
                  <span>
                    <span className="font-medium text-ink">{CONFIDENCE_LABEL[c]}</span>
                    <span className="ml-2 font-mono text-[12px] tnum text-ink-3">{conf[c] ?? 0}</span>
                    <span className="block text-[14px] text-ink-2">{CONFIDENCE_HELP[c]}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[14px] text-ink-2">
              Low-confidence entries are kept visible on purpose. Hiding them would make the map look more certain than
              the public record is. Treat them as leads.
            </p>
          </section>

          <section id="dates" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Dates</h2>
            <p className="mt-2 text-ink-2">
              The primary date is the day the instrument was notified, released or approved, whichever the source
              supports. When only a month or year is documented, the entry says so and the date is shown at that
              precision. Commencement, consultation deadlines and amendments live in the entry timeline.
            </p>
          </section>

          <section id="sources" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Sources</h2>
            <p className="mt-2 text-ink-2">
              Primary sources are preferred in this order: the Gazette of India or a state gazette, the issuing body&apos;s
              own site, PIB or a state information department, Parliament or court records. News and commentary are
              used to discover instruments and are retained as secondary sources.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(src)
                .sort((a, b) => b[1] - a[1])
                .map(([k, v]) => (
                  <span key={k} className="chip">
                    {k} <span className="font-mono tnum text-ink-3">{v}</span>
                  </span>
                ))}
            </div>
          </section>

          <section id="updates" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Updates</h2>
            <p className="mt-2 text-ink-2">
              Three mechanisms keep the dataset current. The <Link href="/signals" className="text-accent">Signals</Link> page
              polls official feeds on each visit and surfaces releases that mention AI. A daily job reads those feeds and
              a set of official pages, extracts candidate instruments with a language model, and opens a review request in
              the repository; nothing enters the dataset without a human reading the source. Corrections from readers go
              through the same review.
            </p>
            <p className="mt-2 text-ink-2">
              Every release gets a version stamp. The current dataset is <span className="font-mono text-ink">{DATASET_VERSION}</span>,
              updated {DATASET_UPDATED}.
            </p>
          </section>

          <section id="contribute" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Report a correction or a missing instrument</h2>
            <p className="mt-2 text-ink-2">
              Open an issue with the entry id (or the instrument&apos;s name), what is wrong, and a link to the source.
              Each entry page has a prefilled link.
            </p>
            <p className="mt-2">
              <ExternalLink href={`${REPO}/issues/new`}>Open an issue on GitHub</ExternalLink>
            </p>
          </section>

          <section id="api" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Data and API</h2>
            <p className="mt-2 text-ink-2">The full dataset is available under CC BY 4.0. Cite as &quot;India AI Policy Atlas, Secure AI Futures Lab, {DATASET_VERSION}&quot;.</p>
            <pre className="mt-3 overflow-x-auto rounded-[6px] bg-sunken p-3 font-mono text-[12.5px] leading-relaxed text-ink-2">
{`GET /api/policies            all entries (JSON)
GET /api/policies?j=TN       one jurisdiction
GET /api/policies/{id}       one entry
GET /api/policies.csv        CSV; same filters`}
            </pre>
          </section>

          <section id="changelog" className="mt-10">
            <h2 className="font-serif text-[22px] text-ink">Changelog</h2>
            <ol className="mt-3 space-y-3">
              {CHANGELOG.map((c) => (
                <li key={c.version} className="border-l-2 border-line pl-4">
                  <div className="font-mono text-[12px] tnum text-ink-3">
                    {c.date} · {c.version}
                  </div>
                  <div className="text-[14px] text-ink">{c.summary}</div>
                  {c.added && c.added.length > 0 && (
                    <div className="mt-1 text-[13px] text-ink-2">Added: {c.added.join(", ")}</div>
                  )}
                  {c.updated && c.updated.length > 0 && (
                    <div className="mt-0.5 text-[13px] text-ink-2">Updated: {c.updated.join(", ")}</div>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="min-w-0 lg:border-l lg:border-line lg:pl-8">
          <Eyebrow>On this page</Eyebrow>
          <ul className="mt-2 flex flex-col gap-1.5 text-[13.5px]">
            {[
              ["scope", "What counts"],
              ["families", "Families and types"],
              ["status", "Status and binding"],
              ["confidence", "Confidence"],
              ["dates", "Dates"],
              ["sources", "Sources"],
              ["updates", "Updates"],
              ["contribute", "Corrections"],
              ["api", "Data and API"],
              ["changelog", "Changelog"],
            ].map(([id, l]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-ink-2 hover:text-ink">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Eyebrow>Maintainer</Eyebrow>
            <p className="mt-1 text-[13.5px] text-ink-2">Secure AI Futures Lab</p>
            <p className="mt-1 text-[13.5px]">
              <ExternalLink href={REPO}>Source repository</ExternalLink>
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
