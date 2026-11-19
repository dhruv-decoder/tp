#!/usr/bin/env node
/** Write data/policies.csv from data/policies.json (same columns as /api/policies.csv). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = JSON.parse(fs.readFileSync(path.join(APP, "data", "policies.json"), "utf8"));
const FAMILY = {
  act: "law", rules: "law", amendment: "law", bill: "law", ordinance: "law", notification: "law", "executive-order": "law",
  policy: "policy", strategy: "policy", framework: "policy", mission: "policy", scheme: "policy", other: "policy",
  guidelines: "guidance", advisory: "guidance", standard: "guidance", procurement: "guidance", curriculum: "guidance",
  consultation: "deliberation", "committee-report": "deliberation", "court-ruling": "judicial", institution: "institution",
  declaration: "international",
};
const cols = [
  "id", "title", "jurisdiction", "jurisdiction_name", "issuing_body", "instrument_type", "family", "status", "binding",
  "date", "date_precision", "summary", "key_provisions", "themes", "sectors", "source_url", "source_type",
  "secondary_sources", "confidence", "confidence_note", "related", "last_verified",
];
const esc = (v) => {
  const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const rows = P.slice().sort((a, b) => (a.jurisdiction_name + a.date).localeCompare(b.jurisdiction_name + b.date));
const lines = [cols.join(",")];
for (const p of rows) lines.push(cols.map((c) => esc(c === "family" ? FAMILY[p.instrument_type] ?? "policy" : p[c])).join(","));
fs.writeFileSync(path.join(APP, "data", "policies.csv"), "﻿" + lines.join("\n") + "\n");
console.error(`wrote data/policies.csv: ${rows.length} rows`);
