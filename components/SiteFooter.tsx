import Link from "next/link";
import { DATASET_VERSION, DATASET_UPDATED, policyCount } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-8 text-[13px] text-ink-2 sm:px-6 md:grid-cols-3">
        <div>
          <div className="font-serif text-[15px] text-ink">India AI Policy Atlas</div>
          <p className="mt-1 max-w-[40ch]">
            Union and state AI policy instruments with primary sources and stated confidence.
            Maintained by Secure AI Futures Lab.
          </p>
        </div>
        <div className="font-mono text-[12px] tnum">
          <div>Dataset {DATASET_VERSION}</div>
          <div>Updated {DATASET_UPDATED}</div>
          <div>{policyCount()} instruments</div>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
          <Link href="/method" className="hover:text-ink">Method</Link>
          <Link href="/api/policies" className="hover:text-ink">JSON API</Link>
          <Link href="/api/policies.csv" className="hover:text-ink">CSV</Link>
          <Link href="/method#contribute" className="hover:text-ink">Report a correction</Link>
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-4 pb-6 text-[12px] text-ink-3 sm:px-6">
        Map boundaries follow the Survey of India. Nothing here is legal advice; always read the primary source linked on each entry.
      </div>
    </footer>
  );
}
