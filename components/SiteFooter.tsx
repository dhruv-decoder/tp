import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-[13px] text-ink-2 sm:px-6">
        <span>India AI Policy Atlas</span>
        <nav className="flex gap-5" aria-label="Downloads">
          <Link href="/api/policies.csv" className="hover:text-ink">Download CSV</Link>
          <a href="https://github.com/dhruv-decoder/tp" className="hover:text-ink">Source code</a>
        </nav>
      </div>
    </footer>
  );
}
