import { Suspense } from "react";
import type { Metadata } from "next";
import { ExploreClient } from "@/components/ExploreClient";
import { JURISDICTIONS, POLICIES, toLite, countBy } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore",
  description: "Filter and download every AI policy instrument in India.",
};

export default function ExplorePage() {
  const lite = POLICIES.map(toLite);
  const themes = Object.entries(countBy(POLICIES, (p) => p.themes))
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
  const sectors = Object.entries(countBy(POLICIES, (p) => p.sectors))
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => s);
  const jurisdictions = JURISDICTIONS.filter((j) => lite.some((p) => p.jurisdiction === j.code));

  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 pb-5 pt-8 sm:px-6">
        <h1 className="font-serif text-[30px] font-medium leading-tight text-ink">Explore</h1>
      </section>
      <Suspense fallback={<div className="mx-auto max-w-[1440px] px-4 text-ink-3 sm:px-6">Loading…</div>}>
        <ExploreClient policies={lite} jurisdictions={jurisdictions} themes={themes} sectors={sectors} />
      </Suspense>
    </>
  );
}
