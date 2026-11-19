"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "./ui";

interface Source {
  name: string;
  home: string;
  viaGoogle: boolean;
}

export function SourcesPopover({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="h-8 rounded-[8px] border border-line bg-elev px-3 text-[13px] text-ink hover:bg-sunken"
      >
        Sources ({sources.length})
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Sources"
          className="absolute right-0 z-20 mt-2 w-[300px] rounded-[10px] border border-line bg-elev p-4 shadow-[var(--shadow-2)]"
        >
          <ul className="flex flex-col gap-2 text-[13.5px]">
            {sources.map((s) => (
              <li key={s.name} className="flex flex-wrap items-baseline gap-x-2">
                <ExternalLink href={s.home}>{s.name}</ExternalLink>
                {s.viaGoogle && <span className="text-[12px] text-ink-3">via Google News</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
