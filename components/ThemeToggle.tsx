"use client";

import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    try {
      const t = localStorage.getItem("theme");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a per-viewer preference after hydration
      if (t === "dark" || t === "light") setMode(t);
    } catch {}
  }, []);

  function apply(next: Mode) {
    setMode(next);
    try {
      if (next === "system") {
        localStorage.removeItem("theme");
        document.documentElement.removeAttribute("data-theme");
      } else {
        localStorage.setItem("theme", next);
        document.documentElement.setAttribute("data-theme", next);
      }
    } catch {}
  }

  const next: Mode = mode === "system" ? "dark" : mode === "dark" ? "light" : "system";
  const label = mode === "system" ? "Theme: system" : mode === "dark" ? "Theme: dark" : "Theme: light";

  return (
    <button
      type="button"
      onClick={() => apply(next)}
      aria-label={`${label}. Switch theme`}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-[6px] border border-line text-ink-2 hover:bg-sunken hover:text-ink"
    >
      {mode === "dark" ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : mode === "light" ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )}
    </button>
  );
}
