import type { InstrumentType, Status, Confidence } from "./types";

/** Instrument families: the categorical dimension used for colour everywhere. Fixed order. */
export const FAMILIES = [
  "law",
  "judicial",
  "policy",
  "guidance",
  "deliberation",
  "institution",
  "international",
] as const;
export type Family = (typeof FAMILIES)[number];

export const FAMILY_LABEL: Record<Family, string> = {
  law: "Legislation & rules",
  judicial: "Courts",
  policy: "Policy & strategy",
  guidance: "Guidelines & advisories",
  deliberation: "Consultations & reports",
  institution: "Institutions",
  international: "International",
};

export const FAMILY_SHORT: Record<Family, string> = {
  law: "Law",
  judicial: "Court",
  policy: "Policy",
  guidance: "Guidance",
  deliberation: "Consultation",
  institution: "Institution",
  international: "International",
};

const TYPE_TO_FAMILY: Record<InstrumentType, Family> = {
  act: "law",
  rules: "law",
  amendment: "law",
  bill: "law",
  ordinance: "law",
  notification: "law",
  "executive-order": "law",
  policy: "policy",
  strategy: "policy",
  framework: "policy",
  mission: "policy",
  scheme: "policy",
  guidelines: "guidance",
  advisory: "guidance",
  standard: "guidance",
  procurement: "guidance",
  curriculum: "guidance",
  consultation: "deliberation",
  "committee-report": "deliberation",
  "court-ruling": "judicial",
  institution: "institution",
  declaration: "international",
  other: "policy",
};

export function familyOf(t: InstrumentType): Family {
  return TYPE_TO_FAMILY[t] ?? "policy";
}

export const INSTRUMENT_LABEL: Record<InstrumentType, string> = {
  act: "Act",
  rules: "Rules",
  amendment: "Amendment",
  bill: "Bill",
  ordinance: "Ordinance",
  policy: "Policy",
  strategy: "Strategy",
  framework: "Framework",
  guidelines: "Guidelines",
  advisory: "Advisory",
  notification: "Notification",
  scheme: "Scheme",
  mission: "Mission",
  standard: "Standard",
  consultation: "Consultation",
  "committee-report": "Committee report",
  "court-ruling": "Court ruling",
  institution: "Institution",
  declaration: "Declaration",
  "executive-order": "Executive order",
  procurement: "Procurement rule",
  curriculum: "Curriculum",
  other: "Programme / announcement",
};

export type StatusGroup = "active" | "pending" | "inactive" | "litigation";

export const STATUS_LABEL: Record<Status, string> = {
  "in-force": "In force",
  adopted: "Adopted",
  draft: "Draft",
  consultation: "Consultation",
  proposed: "Proposed",
  announced: "Announced",
  lapsed: "Lapsed",
  withdrawn: "Withdrawn",
  superseded: "Superseded",
  "pending-assent": "Pending assent",
  "under-litigation": "Under litigation",
};

export function statusGroup(s: Status): StatusGroup {
  switch (s) {
    case "in-force":
    case "adopted":
      return "active";
    case "lapsed":
    case "withdrawn":
    case "superseded":
      return "inactive";
    case "under-litigation":
      return "litigation";
    default:
      return "pending";
  }
}

export const STATUS_GROUP_LABEL: Record<StatusGroup, string> = {
  active: "Active",
  pending: "Draft / proposed",
  inactive: "No longer current",
  litigation: "Under litigation",
};

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "Primary source verified",
  medium: "Official secondary source",
  low: "Unconfirmed",
};

export const CONFIDENCE_HELP: Record<Confidence, string> = {
  high: "The official document was located and read.",
  medium: "Confirmed by an official press release or two independent reputable reports; primary text not located.",
  low: "Single or secondary report only. Status or details may be wrong.",
};

export const THEME_LABEL: Record<string, string> = {
  governance: "Governance",
  safety: "Safety",
  "risk-management": "Risk management",
  "data-protection": "Data protection",
  privacy: "Privacy",
  "synthetic-media": "Synthetic media & deepfakes",
  "content-moderation": "Content moderation",
  compute: "Compute",
  datasets: "Datasets",
  models: "Models",
  skilling: "Skilling",
  "research-funding": "Research funding",
  "startups-innovation": "Startups & innovation",
  procurement: "Procurement",
  "public-sector-use": "Public-sector use",
  ethics: "Ethics",
  "fairness-bias": "Fairness & bias",
  transparency: "Transparency",
  "accountability-liability": "Accountability & liability",
  "copyright-ip": "Copyright & IP",
  competition: "Competition",
  cybersecurity: "Cybersecurity",
  standards: "Standards",
  children: "Children",
  elections: "Elections",
  "employment-labour": "Employment & labour",
  international: "International",
  "sectoral-regulation": "Sectoral regulation",
  infrastructure: "Infrastructure",
  "institution-building": "Institution building",
  "incident-reporting": "Incident reporting",
  "export-trade": "Export & trade",
};

export const SECTOR_LABEL: Record<string, string> = {
  "cross-sector": "Cross-sector",
  finance: "Finance",
  health: "Health",
  education: "Education",
  telecom: "Telecom",
  defence: "Defence",
  agriculture: "Agriculture",
  "public-services": "Public services",
  elections: "Elections",
  media: "Media",
  employment: "Employment",
  transport: "Transport",
  "law-enforcement": "Law enforcement",
  judiciary: "Judiciary",
  energy: "Energy",
  "startups-industry": "Startups & industry",
};

export const REGIONS = ["North", "Central", "West", "South", "East", "Northeast"] as const;

export function labelTheme(t: string) {
  return THEME_LABEL[t] ?? t.replace(/-/g, " ");
}
export function labelSector(s: string) {
  return SECTOR_LABEL[s] ?? s.replace(/-/g, " ");
}
