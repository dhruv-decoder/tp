import Link from "next/link";
import type { Confidence, Status } from "@/lib/types";
import {
  CONFIDENCE_LABEL,
  CONFIDENCE_HELP,
  FAMILY_SHORT,
  STATUS_LABEL,
  statusGroup,
  type Family,
} from "@/lib/taxonomy";

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className="pill" data-group={statusGroup(status)}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ConfidenceMark({ level, withLabel = true }: { level: Confidence; withLabel?: boolean }) {
  return (
    <span className="conf" data-level={level} title={CONFIDENCE_HELP[level]}>
      <span className="conf-bars" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      {withLabel && <span>{CONFIDENCE_LABEL[level]}</span>}
    </span>
  );
}

export function FamilyDot({ family, label }: { family: Family; label?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 fam-${family}`}>
      <span className="dot" style={{ background: "var(--fam)" }} aria-hidden />
      {label && <span className="text-[12px] text-ink-2">{FAMILY_SHORT[family]}</span>}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function Stat({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="font-serif text-[30px] leading-none tnum text-ink">{value}</div>
      <div className="text-[12.5px] text-ink-2">{label}</div>
      {hint && <div className="text-[11.5px] text-ink-3">{hint}</div>}
    </div>
  );
}

export function JurisdictionLink({ code, name }: { code: string; name: string }) {
  return (
    <Link href={`/jurisdiction/${code}`} className="text-ink-2 hover:text-ink">
      {name}
    </Link>
  );
}

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
      {children}
      <svg
        className="ml-1 inline-block -translate-y-px"
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}
