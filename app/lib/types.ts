export type InstrumentType =
  | "act" | "rules" | "amendment" | "bill" | "ordinance" | "policy" | "strategy"
  | "framework" | "guidelines" | "advisory" | "notification" | "scheme" | "mission"
  | "standard" | "consultation" | "committee-report" | "court-ruling" | "institution"
  | "declaration" | "executive-order" | "procurement" | "curriculum" | "other";

export type Status =
  | "in-force" | "adopted" | "draft" | "consultation" | "proposed" | "announced"
  | "lapsed" | "withdrawn" | "superseded" | "pending-assent" | "under-litigation";

export type Binding = "binding" | "non-binding" | "mixed";
export type Confidence = "high" | "medium" | "low";
export type SourceType = "official" | "gazette" | "press-release" | "legislature" | "court" | "news" | "secondary";

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface Policy {
  id: string;
  title: string;
  jurisdiction: string;
  jurisdiction_name: string;
  issuing_body: string;
  instrument_type: InstrumentType;
  status: Status;
  binding: Binding;
  date: string;
  date_precision: "day" | "month" | "year";
  timeline: TimelineEvent[];
  summary: string;
  key_provisions: string[];
  themes: string[];
  sectors: string[];
  source_url: string;
  source_type: SourceType;
  secondary_sources: string[];
  confidence: Confidence;
  confidence_note: string;
  related: string[];
  last_verified: string;
}

export interface Jurisdiction {
  code: string;
  name: string;
  long_name?: string;
  type: "union" | "state" | "ut";
  region: string;
  capital: string;
  map_name: string | null;
  tile: [number, number] | null;
}

export interface ChangelogEntry {
  date: string;
  version: string;
  summary: string;
  added?: string[];
  updated?: string[];
}
