"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Map" },
  { href: "/explore", label: "Policies" },
  { href: "/timeline", label: "Timeline" },
  { href: "/compare", label: "Compare" },
  { href: "/signals", label: "News feed" },
];

export function SiteNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="font-serif text-[17px] font-medium tracking-tight text-ink no-underline">
          India AI Policy Atlas
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((l) => {
            const on = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={on ? "page" : undefined}
                className={`rounded-[6px] px-3 py-1.5 text-[13.5px] no-underline transition-colors ${
                  on ? "bg-sunken text-ink" : "text-ink-2 hover:bg-sunken hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <ThemeToggle />
          <details className="relative md:hidden">
            <summary className="list-none cursor-pointer rounded-[6px] border border-line px-2.5 py-1 text-[13px] text-ink-2">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 flex w-44 flex-col rounded-[8px] border border-line bg-elev p-1 shadow-[var(--shadow-2)]">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-[6px] px-3 py-2 text-[14px] text-ink no-underline hover:bg-sunken"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
