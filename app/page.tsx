import { AtlasClient } from "@/components/AtlasClient";
import { JURISDICTIONS, POLICIES, toLite, yearRange } from "@/lib/data";

export default function AtlasPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-4 pb-6 pt-10 sm:px-6">
        <h1 className="font-serif text-[34px] font-medium leading-[1.1] text-ink sm:text-[42px]">
          AI policy across Indian states
        </h1>
        <p className="mt-3 text-[16px] text-ink-2">{POLICIES.length} policies recorded</p>
      </section>

      <AtlasClient policies={POLICIES.map(toLite)} jurisdictions={JURISDICTIONS} years={yearRange()} />
    </>
  );
}
