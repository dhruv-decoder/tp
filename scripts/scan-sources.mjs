#!/usr/bin/env node
/**
 * Daily source scan.
 *  1. Reads official RSS feeds and listing pages.
 *  2. Keeps items that mention AI and are not already in the dataset.
 *  3. Asks Claude to decide whether each item is a policy instrument and, if so, to draft a schema entry.
 *  4. Writes data/candidates.json (reviewed by a human before anything enters data/policies.json).
 *
 * env: ANTHROPIC_API_KEY (required for step 3; without it the script writes raw matches only)
 * usage: node scripts/scan-sources.mjs [--days 7] [--max 40]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(__dirname, "..");
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => (a.startsWith("--") ? [a.slice(2), arr[i + 1] ?? "true"] : [])).filter((x) => x.length));
const DAYS = Number(args.days ?? 7);
const MAX = Number(args.max ?? 40);
const MODEL = process.env.ATLAS_MODEL ?? "claude-sonnet-5";

const policies = JSON.parse(fs.readFileSync(path.join(APP, "data", "policies.json"), "utf8"));
const schema = fs.readFileSync(path.join(APP, "research", "India AI policy landscape 2026", "SCHEMA.md"), "utf8");
const candidatesPath = path.join(APP, "data", "candidates.json");
const previous = fs.existsSync(candidatesPath) ? JSON.parse(fs.readFileSync(candidatesPath, "utf8")) : { items: [] };
const seenLinks = new Set([...previous.items.map((c) => c.link), ...policies.flatMap((p) => [p.source_url, ...p.secondary_sources])]);

const FEEDS = [
  { name: "PIB", url: "https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3" },
  { name: "RBI press", url: "https://www.rbi.org.in/pressreleases_rss.xml" },
  { name: "RBI notifications", url: "https://www.rbi.org.in/notifications_rss.xml" },
  { name: "SEBI", url: "https://www.sebi.gov.in/sebirss.xml" },
  { name: "TRAI", url: "https://www.trai.gov.in/rss.xml" },
  // Google News queries as a discovery net for state announcements (official source must still be found at review)
  { name: "news: state AI policy", url: "https://news.google.com/rss/search?q=%22AI+policy%22+state+cabinet+India&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "news: MeitY AI", url: "https://news.google.com/rss/search?q=MeitY+AI+rules+OR+guidelines+OR+advisory&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "news: deepfake rules", url: "https://news.google.com/rss/search?q=India+deepfake+rules+OR+law+OR+bill&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "news: AI regulator", url: "https://news.google.com/rss/search?q=India+(RBI+OR+SEBI+OR+IRDAI+OR+TRAI+OR+CCI+OR+ECI)+artificial+intelligence+(circular+OR+consultation+OR+framework)&hl=en-IN&gl=IN&ceid=IN:en" },
];

const AI = /\b(AI|artificial intelligence|machine learning|deep ?fakes?|synthetic(ally)? generated|generative|LLM|foundation model|algorithm(ic)?|IndiaAI|GPU|compute|facial recognition|कृत्रिम बुद्धिमत्ता|एआई|डीपफेक)\b/i;

function strip(s) {
  return s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, " ").trim();
}
function pick(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? strip(m[1]) : "";
}
async function readFeed(f) {
  const res = await fetch(f.url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; IndiaAIPolicyAtlas/1.0)" }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return (xml.match(/<item[\s\S]*?<\/item>/gi) ?? []).map((it) => {
    const pub = pick(it, "pubDate");
    const d = pub ? new Date(pub) : null;
    return { source: f.name, title: pick(it, "title"), link: pick(it, "link"), date: d && !Number.isNaN(d) ? d.toISOString().slice(0, 10) : null, snippet: pick(it, "description").slice(0, 400) };
  });
}

const cutoff = new Date(Date.now() - DAYS * 86400e3).toISOString().slice(0, 10);
const found = [];
for (const f of FEEDS) {
  try {
    const items = await readFeed(f);
    for (const it of items) {
      if (!it.title || !it.link) continue;
      if (it.date && it.date < cutoff) continue;
      if (!AI.test(`${it.title} ${it.snippet}`)) continue;
      if (seenLinks.has(it.link)) continue;
      found.push(it);
    }
    console.error(`${f.name}: ${items.length} items`);
  } catch (e) {
    console.error(`${f.name}: ${e.message}`);
  }
}
// dedupe by title
const byTitle = new Map();
for (const it of found) if (!byTitle.has(it.title.toLowerCase())) byTitle.set(it.title.toLowerCase(), it);
const batch = [...byTitle.values()].slice(0, MAX);
console.error(`${batch.length} new AI-related items`);

async function classify(items) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || items.length === 0) return items.map((it) => ({ ...it, verdict: "unreviewed" }));
  const existingTitles = policies.map((p) => `${p.id} | ${p.title}`).join("\n");
  const prompt = `You maintain the India AI Policy Atlas, a dataset of AI policy instruments issued by Indian public authorities (Union and state). Below is the dataset schema, the list of existing entry ids and titles, and a batch of new feed items.

For EACH item decide:
- "instrument": the item announces or is a policy instrument per the schema's inclusion rules (act, rules, amendment, bill, notified policy, draft for consultation, guidelines, advisory, standard, regulator circular/consultation, committee report, court ruling with precedent, mission/scheme with budget, institution created, declaration signed, curriculum mandate, procurement rule).
- "update": it reports a status change to an EXISTING entry (give the existing id and the new status/date).
- "ignore": speech, event, MoU with one company, opinion, or not India-specific.

Return ONLY a JSON array. Each element: {"link": "...", "verdict": "instrument"|"update"|"ignore", "reason": "<=20 words", "existing_id": "...optional...", "entry": {<full schema object, only when verdict is instrument; confidence must be "low" or "medium" because you have only seen a feed item; put the feed link in secondary_sources and the best-guess official URL in source_url only if you are sure it exists, otherwise use the feed link>}}

SCHEMA:
${schema}

EXISTING ENTRIES:
${existingTitles}

NEW ITEMS:
${JSON.stringify(items, null, 1)}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 16000, messages: [{ role: "user", content: prompt }] }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.content.map((c) => c.text ?? "").join("");
  const json = text.slice(text.indexOf("["), text.lastIndexOf("]") + 1);
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("model did not return valid JSON array");
  }
  const byLink = new Map(parsed.map((r) => [r.link, r]));
  return items.map((it) => {
    const r = byLink.get(it.link) ?? {};
    return { ...it, verdict: r.verdict ?? "unreviewed", reason: r.reason ?? "", existing_id: r.existing_id, entry: r.entry };
  });
}

let results;
try {
  results = await classify(batch);
} catch (e) {
  console.error(`classification failed: ${e.message}`);
  results = batch.map((it) => ({ ...it, verdict: "unreviewed" }));
}

const kept = results.filter((r) => r.verdict !== "ignore");
const out = {
  scanned_at: new Date().toISOString(),
  model: process.env.ANTHROPIC_API_KEY ? MODEL : null,
  items: [...kept.map((r) => ({ ...r, found_at: new Date().toISOString().slice(0, 10) })), ...previous.items].slice(0, 400),
};
fs.writeFileSync(candidatesPath, JSON.stringify(out, null, 2) + "\n");
const summary = { instrument: 0, update: 0, unreviewed: 0 };
for (const r of kept) summary[r.verdict] = (summary[r.verdict] ?? 0) + 1;
console.error(`candidates written: ${JSON.stringify(summary)}`);
// GitHub Actions output
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `new=${kept.length}\nsummary=${JSON.stringify(summary)}\n`);
