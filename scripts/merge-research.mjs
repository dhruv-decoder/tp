#!/usr/bin/env node
/**
 * Merge researcher JSON files into app/data/policies.json.
 * - normalises jurisdiction codes and names
 * - validates enums, fills defaults
 * - de-duplicates by id and by (jurisdiction, title similarity, year)
 * - reports problems to stderr
 *
 * usage: node scripts/merge-research.mjs [researchDir]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(__dirname, "..");
const RESEARCH = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(APP, "research", "India AI policy landscape 2026");
const OUT = path.join(APP, "data", "policies.json");
const OVERRIDES = path.join(APP, "data", "overrides.json");

const jurisdictions = JSON.parse(fs.readFileSync(path.join(APP, "data", "jurisdictions.json"), "utf8"));
const jByCode = new Map(jurisdictions.map((j) => [j.code, j]));
const CODE_ALIAS = { TS: "TG", CT: "CG", OR: "OD", UT: "UK", DN: "DH", DD: "DH", UA: "UK", CENTRAL: "IN", UNION: "IN" };
const NAME_TO_CODE = new Map(jurisdictions.map((j) => [j.name.toLowerCase(), j.code]));
NAME_TO_CODE.set("union", "IN");
NAME_TO_CODE.set("government of india", "IN");
NAME_TO_CODE.set("central", "IN");
NAME_TO_CODE.set("india", "IN");
NAME_TO_CODE.set("orissa", "OD");
NAME_TO_CODE.set("jammu and kashmir", "JK");
NAME_TO_CODE.set("andaman and nicobar islands", "AN");
NAME_TO_CODE.set("dadra and nagar haveli and daman and diu", "DH");
NAME_TO_CODE.set("nct of delhi", "DL");
NAME_TO_CODE.set("national capital territory of delhi", "DL");

const TYPES = new Set([
  "act","rules","amendment","bill","ordinance","policy","strategy","framework","guidelines","advisory","notification","scheme","mission",
  "standard","consultation","committee-report","court-ruling","institution","declaration","executive-order","procurement","curriculum","other",
]);
const TYPE_ALIAS = { circular: "notification", "press-release": "other", order: "executive-order", directive: "notification", "white-paper": "committee-report", report: "committee-report", paper: "committee-report", "discussion-paper": "consultation", resolution: "policy", "action-plan": "strategy", roadmap: "strategy", "working-paper": "committee-report", "cabinet-decision": "executive-order", programme: "scheme", program: "scheme", initiative: "scheme", mou: "other", law: "act", legislation: "act", judgment: "court-ruling", judgement: "court-ruling", ruling: "court-ruling", "office-memorandum": "executive-order", om: "executive-order", summit: "declaration", statement: "declaration", "joint-statement": "declaration" };
const STATUSES = new Set(["in-force","adopted","draft","consultation","proposed","announced","lapsed","withdrawn","superseded","pending-assent","under-litigation"]);
const STATUS_ALIAS = { active: "in-force", enacted: "in-force", notified: "in-force", final: "adopted", released: "adopted", published: "adopted", approved: "adopted", operational: "in-force", ongoing: "in-force", implemented: "in-force", pending: "proposed", introduced: "proposed", passed: "pending-assent", expired: "lapsed", repealed: "withdrawn", struck_down: "withdrawn", "struck-down": "withdrawn", closed: "adopted", signed: "adopted", endorsed: "adopted", "not-signed": "withdrawn", declined: "withdrawn", completed: "adopted", delivered: "adopted" };
const BINDING = new Set(["binding", "non-binding", "mixed"]);
const CONF = new Set(["high", "medium", "low"]);
const SRC = new Set(["official", "gazette", "press-release", "legislature", "court", "news", "secondary"]);
const THEMES = new Set(["governance","safety","risk-management","data-protection","privacy","synthetic-media","content-moderation","compute","datasets","models","skilling","research-funding","startups-innovation","procurement","public-sector-use","ethics","fairness-bias","transparency","accountability-liability","copyright-ip","competition","cybersecurity","standards","children","elections","employment-labour","international","sectoral-regulation","infrastructure","institution-building","incident-reporting","export-trade"]);
const THEME_ALIAS = { deepfakes: "synthetic-media", deepfake: "synthetic-media", "synthetic-media-deepfakes": "synthetic-media", "data-governance": "datasets", data: "datasets", "foundation-models": "models", "sovereign-ai": "models", education: "skilling", skills: "skilling", innovation: "startups-innovation", startups: "startups-innovation", "research": "research-funding", "r-and-d": "research-funding", "responsible-ai": "ethics", trust: "ethics", bias: "fairness-bias", fairness: "fairness-bias", liability: "accountability-liability", accountability: "accountability-liability", copyright: "copyright-ip", ip: "copyright-ip", security: "cybersecurity", "cyber-security": "cybersecurity", labour: "employment-labour", employment: "employment-labour", jobs: "employment-labour", "public-services": "public-sector-use", egovernance: "public-sector-use", "e-governance": "public-sector-use", institutions: "institution-building", "institution": "institution-building", "data-centres": "infrastructure", "data-centers": "infrastructure", "incident": "incident-reporting", trade: "export-trade", export: "export-trade", "child-safety": "children", misinformation: "content-moderation", "online-safety": "content-moderation" };
const SECTORS = new Set(["cross-sector","finance","health","education","telecom","defence","agriculture","public-services","elections","media","employment","transport","law-enforcement","judiciary","energy","startups-industry"]);
const SECTOR_ALIAS = { banking: "finance", securities: "finance", insurance: "finance", fintech: "finance", healthcare: "health", schools: "education", "higher-education": "education", telecommunications: "telecom", security: "defence", military: "defence", farming: "agriculture", governance: "public-services", government: "public-services", "public-sector": "public-services", broadcasting: "media", entertainment: "media", labour: "employment", courts: "judiciary", police: "law-enforcement", industry: "startups-industry", startups: "startups-industry", "it-industry": "startups-industry", "all": "cross-sector", general: "cross-sector", "multi-sector": "cross-sector" };

const BANNED = /\b(landmark|comprehensive|robust|cutting-edge|ecosystem|leverage|leverages|leveraging|holistic|paradigm|game-changing|world-class|state-of-the-art|transformative|unprecedented)\b/i;

const problems = [];
const warn = (id, msg) => problems.push(`${id}: ${msg}`);

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function normCode(raw, name, id) {
  let c = String(raw ?? "").trim().toUpperCase();
  if (CODE_ALIAS[c]) c = CODE_ALIAS[c];
  if (!jByCode.has(c)) {
    const byName = NAME_TO_CODE.get(String(name ?? "").trim().toLowerCase());
    if (byName) c = byName;
  }
  if (!jByCode.has(c)) {
    // try from id prefix
    const pre = String(id).split("-")[0].toUpperCase();
    if (pre === "CENTRAL" || pre === "INTL") c = "IN";
    else if (jByCode.has(CODE_ALIAS[pre] ?? pre)) c = CODE_ALIAS[pre] ?? pre;
  }
  return jByCode.has(c) ? c : null;
}
function isoDate(d, id, field) {
  if (!d) return null;
  let s = String(d).trim();
  if (/^\d{4}$/.test(s)) return `${s}-01-01`;
  if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const t = Date.parse(s);
  if (!Number.isNaN(t)) return new Date(t).toISOString().slice(0, 10);
  warn(id, `bad ${field} "${d}"`);
  return null;
}
function normList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  return String(v).split(/[;,]/).map((x) => x.trim()).filter(Boolean);
}
function normEnum(v, set, alias, fallback, id, field) {
  let s = slug(v ?? "");
  if (alias[s]) s = alias[s];
  if (set.has(s)) return s;
  if (v) warn(id, `unknown ${field} "${v}" -> ${fallback}`);
  return fallback;
}

function normalise(raw, file) {
  const id0 = raw.id || slug(`${raw.jurisdiction}-${raw.title}-${String(raw.date).slice(0, 4)}`);
  const code = normCode(raw.jurisdiction, raw.jurisdiction_name, id0);
  if (!code) {
    warn(id0, `unresolvable jurisdiction "${raw.jurisdiction}" / "${raw.jurisdiction_name}" (${file}) — dropped`);
    return null;
  }
  const j = jByCode.get(code);
  const date = isoDate(raw.date, id0, "date");
  if (!date) {
    warn(id0, `missing date — dropped`);
    return null;
  }
  let precision = raw.date_precision;
  if (!["day", "month", "year"].includes(precision)) precision = /^\d{4}$/.test(String(raw.date)) ? "year" : /^\d{4}-\d{2}$/.test(String(raw.date)) ? "month" : "day";

  const timeline = (Array.isArray(raw.timeline) ? raw.timeline : [])
    .map((t) => ({ date: isoDate(t.date, id0, "timeline.date"), event: String(t.event ?? "").trim() }))
    .filter((t) => t.date && t.event)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const themes = [...new Set(normList(raw.themes).map((t) => normEnum(t, THEMES, THEME_ALIAS, null, id0, "theme")).filter(Boolean))];
  const sectors = [...new Set(normList(raw.sectors).map((s) => normEnum(s, SECTORS, SECTOR_ALIAS, null, id0, "sector")).filter(Boolean))];
  if (sectors.length === 0) sectors.push("cross-sector");
  if (themes.length === 0) warn(id0, "no themes");

  const entry = {
    id: slug(id0),
    title: String(raw.title ?? "").trim().replace(/\s+/g, " "),
    jurisdiction: code,
    jurisdiction_name: j.name,
    issuing_body: String(raw.issuing_body ?? "").trim(),
    instrument_type: normEnum(raw.instrument_type, TYPES, TYPE_ALIAS, "other", id0, "instrument_type"),
    status: normEnum(raw.status, STATUSES, STATUS_ALIAS, "announced", id0, "status"),
    binding: normEnum(raw.binding, BINDING, {}, "non-binding", id0, "binding"),
    date,
    date_precision: precision,
    timeline,
    summary: String(raw.summary ?? "").trim(),
    key_provisions: normList(raw.key_provisions).slice(0, 8),
    themes,
    sectors,
    source_url: String(raw.source_url ?? "").trim(),
    source_type: normEnum(raw.source_type, SRC, { "press": "press-release", pib: "press-release", government: "official", gov: "official", "state-government": "official", regulator: "official", media: "news", newspaper: "news", "think-tank": "secondary", academic: "secondary" }, "secondary", id0, "source_type"),
    secondary_sources: [...new Set(normList(raw.secondary_sources).filter((u) => /^https?:\/\//.test(u)))],
    confidence: normEnum(raw.confidence, CONF, {}, "low", id0, "confidence"),
    confidence_note: String(raw.confidence_note ?? "").trim(),
    related: [...new Set(normList(raw.related).map(slug))],
    last_verified: isoDate(raw.last_verified, id0, "last_verified") ?? new Date().toISOString().slice(0, 10),
    _file: file,
  };
  if (!entry.title) { warn(id0, "no title — dropped"); return null; }
  if (!/^https?:\/\//.test(entry.source_url)) {
    warn(entry.id, `no primary source URL; confidence forced to low`);
    entry.confidence = "low";
    if (entry.secondary_sources[0]) entry.source_url = entry.secondary_sources[0];
  }
  // a Google News query is not a source; promote a real URL from the secondary list when one exists
  if (/news\.google\.com/.test(entry.source_url)) {
    const real = entry.secondary_sources.find((u) => !/news\.google\.com/.test(u));
    if (real) {
      entry.secondary_sources = [entry.source_url, ...entry.secondary_sources.filter((u) => u !== real)];
      entry.source_url = real;
    }
    entry.confidence = "low";
    warn(entry.id, "source was a Google News query; confidence forced to low");
  }
  if (!entry.summary) warn(entry.id, "empty summary");
  if (BANNED.test(entry.summary) || entry.key_provisions.some((k) => BANNED.test(k))) warn(entry.id, `banned marketing word in text`);
  return entry;
}

// ---------- read ----------
const files = fs.readdirSync(RESEARCH).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
const all = [];
for (const f of files) {
  let arr;
  try {
    arr = JSON.parse(fs.readFileSync(path.join(RESEARCH, f), "utf8"));
  } catch (e) {
    problems.push(`${f}: INVALID JSON (${e.message.slice(0, 80)}) — skipped`);
    continue;
  }
  if (!Array.isArray(arr)) arr = arr.entries ?? arr.items ?? [];
  for (const raw of arr) {
    const e = normalise(raw, f);
    if (e) all.push(e);
  }
  console.error(`read ${f}: ${arr.length}`);
}

// ---------- dedupe ----------
const confRank = { high: 3, medium: 2, low: 1 };
function tokens(t) {
  return new Set(slug(t).split("-").filter((w) => w.length > 1 && !["the", "and", "for", "of", "on", "in", "to", "an"].includes(w)));
}
function jaccard(a, b) {
  const A = tokens(a), B = tokens(b);
  if (!A.size || !B.size) return 0;
  let i = 0;
  for (const x of A) if (B.has(x)) i++;
  return i / (A.size + B.size - i);
}
function merge(a, b) {
  // keep the better-sourced one as base, union lists
  const [base, other] = confRank[b.confidence] > confRank[a.confidence] || (confRank[b.confidence] === confRank[a.confidence] && b.last_verified > a.last_verified) ? [b, a] : [a, b];
  const out = { ...base };
  out.secondary_sources = [...new Set([...base.secondary_sources, ...other.secondary_sources, other.source_url].filter((u) => u && u !== base.source_url))];
  out.related = [...new Set([...base.related, ...other.related])];
  out.themes = [...new Set([...base.themes, ...other.themes])].slice(0, 6);
  out.sectors = [...new Set([...base.sectors, ...other.sectors])];
  const seen = new Set(base.timeline.map((t) => t.date + t.event.toLowerCase().slice(0, 30)));
  out.timeline = [...base.timeline, ...other.timeline.filter((t) => !seen.has(t.date + t.event.toLowerCase().slice(0, 30)))].sort((x, y) => (x.date < y.date ? -1 : 1));
  if (other.key_provisions.length > base.key_provisions.length) out.key_provisions = other.key_provisions;
  if (other.summary.length > base.summary.length * 1.4) out.summary = other.summary;
  // newer status wins when the newer entry was verified later
  if (other.last_verified > base.last_verified && other.status !== base.status) out.status = other.status;
  out._merged = [...(base._merged ?? []), other.id];
  out._aliases = [...new Set([...(base._aliases ?? []), other.id])];
  return out;
}

const byId = new Map();
for (const e of all) {
  if (byId.has(e.id)) byId.set(e.id, merge(byId.get(e.id), e));
  else byId.set(e.id, e);
}
let list = [...byId.values()];
// fuzzy pass
const alias = new Map(); // old id -> kept id
let changed = true;
while (changed) {
  changed = false;
  outer: for (let i = 0; i < list.length; i++) {
    for (let k = i + 1; k < list.length; k++) {
      const a = list[i], b = list[k];
      if (a.jurisdiction !== b.jurisdiction) continue;
      const sim = jaccard(a.title, b.title);
      const sameYear = a.date.slice(0, 4) === b.date.slice(0, 4);
      const near = Math.abs(new Date(a.date) - new Date(b.date)) < 1000 * 3600 * 24 * 120;
      const draftA = /\bdraft\b/i.test(a.title), draftB = /\bdraft\b/i.test(b.title);
      const close = Math.abs(new Date(a.date) - new Date(b.date)) < 1000 * 3600 * 24 * 45;
      if (draftA === draftB && ((sim >= 0.9 && near) || (sim >= 0.75 && a.instrument_type === b.instrument_type && close))) {
        const m = merge(a, b);
        problems.push(`MERGED "${b.title}" (${b.id}) into "${a.title}" (${a.id}) sim=${sim.toFixed(2)}`);
        for (const x of [a.id, b.id]) if (x !== m.id) alias.set(x, m.id);
        list.splice(k, 1);
        list.splice(i, 1, m);
        changed = true;
        break outer;
      } else if (sim >= 0.55 && sameYear) {
        const msg = `REVIEW possible duplicate: "${a.title}" (${a.id}) ~ "${b.title}" (${b.id}) sim=${sim.toFixed(2)}`;
        if (!problems.includes(msg)) problems.push(msg);
      }
    }
  }
}
for (const e of list) for (const x of e._aliases ?? []) if (x !== e.id) alias.set(x, e.id);

// ---------- overrides (manual corrections that survive re-merges) ----------
if (fs.existsSync(OVERRIDES)) {
  const ov = JSON.parse(fs.readFileSync(OVERRIDES, "utf8"));
  for (const [id, patch] of Object.entries(ov)) {
    const target = list.find((e) => e.id === id || e.id === alias.get(id));
    if (!target) { problems.push(`override for unknown id ${id}`); continue; }
    if (patch === null) { list = list.filter((e) => e !== target); continue; }
    Object.assign(target, patch);
  }
}

// ---------- resolve related ----------
const ids = new Set(list.map((e) => e.id));
for (const e of list) {
  e.related = [...new Set(e.related.map((r) => (ids.has(r) ? r : alias.get(r))).filter((r) => r && r !== e.id && ids.has(r)))];
}
// symmetric related
const relMap = new Map(list.map((e) => [e.id, new Set(e.related)]));
for (const e of list) for (const r of e.related) relMap.get(r)?.add(e.id);
for (const e of list) e.related = [...relMap.get(e.id)].slice(0, 12);

for (const e of list) { delete e._file; delete e._merged; delete e._aliases; }
list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));

fs.writeFileSync(OUT, JSON.stringify(list, null, 2) + "\n");
console.error(`\nwrote ${list.length} entries to ${path.relative(process.cwd(), OUT)}`);
const perJ = {};
for (const e of list) perJ[e.jurisdiction] = (perJ[e.jurisdiction] ?? 0) + 1;
console.error("per jurisdiction:", JSON.stringify(perJ));
const perC = {};
for (const e of list) perC[e.confidence] = (perC[e.confidence] ?? 0) + 1;
console.error("confidence:", JSON.stringify(perC));
if (problems.length) {
  fs.writeFileSync(path.join(RESEARCH, "_merge-report.txt"), problems.join("\n") + "\n");
  console.error(`\n${problems.length} notes written to _merge-report.txt`);
  for (const p of problems.filter((x) => /dropped|MERGED|INVALID|unknown|REVIEW/.test(x)).slice(0, 60)) console.error("  " + p);
}
