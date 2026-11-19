import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchSignals, FEEDS } from "@/lib/signals";
import { formatDate } from "@/lib/data";
import { SourcesPopover } from "@/components/SourcesPopover";

export const metadata: Metadata = {
  title: "News feed",
  description: "News releases on AI in India. Need additional verification before being added to the map.",
};

const SOURCES = FEEDS.map((f) => ({ name: f.name, home: f.home, viaGoogle: f.kind === "index" }));

async function Feed() {
  const { signals, fetchedAt } = await fetchSignals();
  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-line-strong pb-3">
        <span className="text-[13px] text-ink-2 tnum">
          Last checked {formatDate(fetchedAt.slice(0, 10))}, {fetchedAt.slice(11, 16)} UTC
        </span>
        <SourcesPopover sources={SOURCES} />
      </div>
      <ol className="divide-y divide-line">
        {signals.map((s, i) => (
          <li key={i} className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4">
            <span className="font-mono text-[12.5px] tnum text-ink-3">{s.date ? formatDate(s.date) : "—"}</span>
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
    <div className="mx-auto max-w-[920px] px-4 sm:px-6">
      <section className="pb-5 pt-8">
        <h1 className="font-serif text-[30px] font-medium leading-tight text-ink">News feed</h1>
        <p className="mt-1 text-[14.5px] text-ink-2">News releases. Need additional verification to be added to the map.</p>
      </section>
      <Suspense fallback={<div className="py-8 text-[14px] text-ink-3">Loading…</div>}>
        <Feed />
      </Suspense>
    </div>
  );
}
