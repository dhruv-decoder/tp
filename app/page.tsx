import { AtlasClient } from "@/components/AtlasClient";
import { JURISDICTIONS, POLICIES, toLite, yearRange } from "@/lib/data";

export default function AtlasPage() {
  const states = new Set(POLICIES.filter((p) => p.jurisdiction !== "IN").map((p) => p.jurisdiction)).size;

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 pb-6 pt-10 sm:px-6">
        <h1 className="font-serif text-[34px] font-medium leading-[1.1] text-ink sm:text-[42px]">
          AI policy across Indian states
        </h1>
        <p className="mt-3 text-[16px] text-ink-2">
          {POLICIES.length} policies from the Union and {states} of {JURISDICTIONS.length - 1} states and union
          territories.
        </p>
      </section>

      <AtlasClient policies={POLICIES.map(toLite)} jurisdictions={JURISDICTIONS} years={yearRange()} />
    </>
  );
}
