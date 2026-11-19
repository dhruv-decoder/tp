#!/usr/bin/env node
/** Fails CI when data/policies.json breaks the schema or has duplicate ids / dangling related ids. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = JSON.parse(fs.readFileSync(path.join(APP, "data", "policies.json"), "utf8"));
const J = JSON.parse(fs.readFileSync(path.join(APP, "data", "jurisdictions.json"), "utf8"));
const codes = new Set(J.map((j) => j.code));
const ids = new Set();
const errors = [];
const req = ["id", "title", "jurisdiction", "issuing_body", "instrument_type", "status", "binding", "date", "summary", "source_url", "confidence", "last_verified"];
for (const p of P) {
  for (const k of req) if (!p[k]) errors.push(`${p.id}: missing ${k}`);
  if (ids.has(p.id)) errors.push(`duplicate id ${p.id}`);
  ids.add(p.id);
  if (!codes.has(p.jurisdiction)) errors.push(`${p.id}: unknown jurisdiction ${p.jurisdiction}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) errors.push(`${p.id}: bad date ${p.date}`);
  if (!/^https?:\/\//.test(p.source_url)) errors.push(`${p.id}: bad source_url`);
  if (!Array.isArray(p.themes) || p.themes.length === 0) errors.push(`${p.id}: no themes`);
}
for (const p of P) for (const r of p.related ?? []) if (!ids.has(r)) errors.push(`${p.id}: dangling related ${r}`);
if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problems`);
  process.exit(1);
}
console.error(`ok: ${P.length} entries, ${ids.size} unique ids`);
