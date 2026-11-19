import type { Metadata } from "next";
import { TimelineClient } from "@/components/TimelineClient";
import { POLICIES, toLite, yearRange } from "@/lib/data";

export const metadata: Metadata = {
  title: "Timeline",
  description: "AI policies in India by date.",
};

export default function TimelinePage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 pb-5 pt-8 sm:px-6">
        <h1 className="font-serif text-[30px] font-medium leading-tight text-ink">Timeline</h1>
      </section>
      <TimelineClient policies={POLICIES.map(toLite)} years={yearRange()} />
    </>
  );
}
