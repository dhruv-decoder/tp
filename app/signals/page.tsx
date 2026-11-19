import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchSignals, FEEDS } from "@/lib/signals";
import { ExternalLink, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "News feed",
  description: "Official press releases and circulars that mention AI, polled from government feeds.",
};

async function Feed() {
  const { signals, errors, fetchedAt } = await fetchSignals();
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px] text-ink-3">
        <span className="tnum">
          {signals.length} items · checked {fetchedAt.slice(0, 16).replace("T", " ")} UTC
        </span>
        {errors.length > 0 && <span>{errors.length} source(s) unavailable</span>}
      </div>
      <ol className="mt-3 divide-y divide-line border-y border-line">
        {signals.map((s, i) => (
          <li key={i} className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4">
            <span className="font-mono text-[12.5px] tnum text-ink-3">{s.date ?? "—"}</span>
            <span className="min-w-0">
              <a href={s.link} target="_blank" rel="noopener noreferrer" className="block text-[14.5px] font-medium leading-snug text-ink hover:text-accent">
                {s.title}
              </a>
              <span className="mt-0.5 block text-[12.5px] text-ink-3">{s.source}</span>
            </span>
          </li>
        ))}
        {signals.length === 0 && <li className="py-8 text-center text-[14px] text-ink-3">Nothing new.</li>}
      </ol>
    </>
  );
}

export default function SignalsPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 pb-5 pt-8 sm:px-6">
        <h1 className="font-serif text-[30px] font-medium leading-tight text-ink">News feed</h1>
        <p className="mt-1 max-w-[62ch] text-[14px] text-ink-2">
          New official releases that mention AI. Not yet reviewed; real policies are added to the map after a check.
        </p>
      </section>
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <Suspense fallback={<div className="py-8 text-[14px] text-ink-3">Loading…</div>}>
            <Feed />
          </Suspense>
        </div>
        <aside className="min-w-0 lg:border-l lg:border-line lg:pl-8">
          <Eyebrow>Sources checked</Eyebrow>
          <ul className="mt-2 flex flex-col gap-1.5 text-[13.5px]">
            {FEEDS.map((f) => (
              <li key={f.url} className="flex items-center gap-2">
                <ExternalLink href={f.home}>{f.name}</ExternalLink>
                {f.kind === "index" && <span className="text-[11.5px] text-ink-3">via Google News</span>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-2">Checked every hour.</p>
        </aside>
      </div>
    </>
  );
}
