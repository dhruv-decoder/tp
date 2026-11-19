import { Suspense } from "react";
import type { Metadata } from "next";
import { CompareClient } from "@/components/CompareClient";
import { JURISDICTIONS, POLICIES, toLite, countBy } from "@/lib/data";

export const metadata: Metadata = {
  title: "Compare",
  description: "Compare AI policy coverage across Indian states and the Union.",
};

export default function ComparePage() {
  const themes = Object.entries(countBy(POLICIES, (p) => p.themes))
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
  return (
    <>
      <section className="mx-auto max-w-[1440px] px-4 pb-5 pt-8 sm:px-6">
        <h1 className="font-serif text-[30px] font-medium leading-tight text-ink">Compare</h1>
      </section>
      <Suspense fallback={null}>
        <CompareClient policies={POLICIES.map(toLite)} jurisdictions={JURISDICTIONS} themes={themes} />
      </Suspense>
    </>
  );
}
