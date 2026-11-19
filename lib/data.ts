import policiesRaw from "@/data/policies.json";
import jurisdictionsRaw from "@/data/jurisdictions.json";
import changelogRaw from "@/data/changelog.json";
import type { Policy, Jurisdiction, ChangelogEntry } from "./types";
import { familyOf, statusGroup, FAMILIES, type Family } from "./taxonomy";

export const POLICIES: Policy[] = (policiesRaw as Policy[])
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

export const JURISDICTIONS: Jurisdiction[] = jurisdictionsRaw as Jurisdiction[];
export const CHANGELOG: ChangelogEntry[] = (changelogRaw as ChangelogEntry[]).slice().sort((a, b) => (a.date < b.date ? 1 : -1));

export const DATASET_VERSION = CHANGELOG[0]?.version ?? "v0";
export const DATASET_UPDATED = CHANGELOG[0]?.date ?? "";

const byId = new Map(POLICIES.map((p) => [p.id, p]));
const jByCode = new Map(JURISDICTIONS.map((j) => [j.code, j]));

export function policyById(id: string) {
  return byId.get(id);
}
export function jurisdictionByCode(code: string) {
  return jByCode.get(code);
}
export function policyCount() {
  return POLICIES.length;
}
export function policiesFor(code: string) {
  return POLICIES.filter((p) => p.jurisdiction === code);
}
export function statePolicies() {
  return POLICIES.filter((p) => p.jurisdiction !== "IN");
}
export function unionPolicies() {
  return POLICIES.filter((p) => p.jurisdiction === "IN");
}

export interface JurisdictionSummary {
  code: string;
  total: number;
  active: number;
  pending: number;
  families: Record<Family, number>;
  latest?: Policy;
  earliest?: Policy;
  hasDedicatedPolicy: boolean;
}

/** Counts per jurisdiction, optionally restricted to instruments dated on or before `uptoYear`. */
export function summarise(uptoYear?: number): Map<string, JurisdictionSummary> {
  const out = new Map<string, JurisdictionSummary>();
  for (const j of JURISDICTIONS) {
    out.set(j.code, {
      code: j.code,
      total: 0,
      active: 0,
      pending: 0,
      families: Object.fromEntries(FAMILIES.map((f) => [f, 0])) as Record<Family, number>,
      hasDedicatedPolicy: false,
    });
  }
  for (const p of POLICIES) {
    if (uptoYear !== undefined && yearOf(p.date) > uptoYear) continue;
    const s = out.get(p.jurisdiction);
    if (!s) continue;
    s.total += 1;
    const g = statusGroup(p.status);
    if (g === "active") s.active += 1;
    if (g === "pending") s.pending += 1;
    s.families[familyOf(p.instrument_type)] += 1;
    if (!s.latest || p.date > s.latest.date) s.latest = p;
    if (!s.earliest || p.date < s.earliest.date) s.earliest = p;
    if (
      (p.instrument_type === "policy" || p.instrument_type === "strategy" || p.instrument_type === "framework") &&
      g === "active" &&
      /\bAI\b|artificial intelligence/i.test(p.title)
    ) {
      s.hasDedicatedPolicy = true;
    }
  }
  return out;
}

export function yearOf(d: string) {
  return Number(d.slice(0, 4));
}

export const SCRUB_START = 2018;

export function yearRange(): [number, number] {
  let min = 9999;
  let max = 0;
  for (const p of POLICIES) {
    const y = yearOf(p.date);
    if (y < min) min = y;
    if (y > max) max = y;
  }
  if (min === 9999) return [2018, 2026];
  // the scrub and histograms start at 2018 (NITI's national strategy); older law is bucketed into that first year
  return [Math.max(min, SCRUB_START), max];
}

/** Quantise a count into 1..6 for the sequential map ramp. 0 stays 0 (empty). */
export function levelFor(count: number, max: number) {
  if (count <= 0) return 0;
  if (max <= 1) return 4;
  const t = Math.log(count + 1) / Math.log(max + 1);
  return Math.max(1, Math.min(6, Math.ceil(t * 6)));
}

export function countBy<T extends string>(items: Policy[], key: (p: Policy) => T | T[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of items) {
    const k = key(p);
    for (const kk of Array.isArray(k) ? k : [k]) out[kk] = (out[kk] ?? 0) + 1;
  }
  return out;
}

/** Lean record shipped to client components. */
export interface PolicyLite {
  id: string;
  title: string;
  jurisdiction: string;
  jurisdiction_name: string;
  issuing_body: string;
  instrument_type: Policy["instrument_type"];
  family: Family;
  status: Policy["status"];
  binding: Policy["binding"];
  date: string;
  date_precision: Policy["date_precision"];
  themes: string[];
  sectors: string[];
  confidence: Policy["confidence"];
  summary: string;
}

export function toLite(p: Policy): PolicyLite {
  return {
    id: p.id,
    title: p.title,
    jurisdiction: p.jurisdiction,
    jurisdiction_name: p.jurisdiction_name,
    issuing_body: p.issuing_body,
    instrument_type: p.instrument_type,
    family: familyOf(p.instrument_type),
    status: p.status,
    binding: p.binding,
    date: p.date,
    date_precision: p.date_precision,
    themes: p.themes,
    sectors: p.sectors,
    confidence: p.confidence,
    summary: p.summary,
  };
}

export function formatDate(d: string, precision: Policy["date_precision"] = "day") {
  const [y, m, day] = d.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (!y) return d;
  if (precision === "year" || !m) return String(y);
  if (precision === "month" || !day) return `${months[m - 1]} ${y}`;
  return `${day} ${months[m - 1]} ${y}`;
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const FAMILY_WEIGHT: Record<Family, number> = {
  law: 3,
  policy: 3,
  institution: 2,
  judicial: 2,
  guidance: 1.5,
  deliberation: 1,
  international: 1,
};
const STATUS_WEIGHT = { active: 3, pending: 1.5, litigation: 1.5, inactive: 0 } as const;
const CONFIDENCE_WEIGHT = { high: 2, medium: 1, low: 0 } as const;

/**
 * "Top" order used by the state briefing window: in force or adopted first, then binding
 * law and core policy over guidance, then better-sourced, then newer. Weights are deliberately
 * simple so a reader can predict the order.
 */
export function briefingScore(p: Pick<PolicyLite, "status" | "family" | "confidence" | "date">) {
  const recency = Math.max(0, Math.min(1, (yearOf(p.date) - SCRUB_START) / 8));
  return STATUS_WEIGHT[statusGroup(p.status)] + FAMILY_WEIGHT[p.family] + CONFIDENCE_WEIGHT[p.confidence] + recency;
}
