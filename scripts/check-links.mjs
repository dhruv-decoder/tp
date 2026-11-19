#!/usr/bin/env node
/**
 * Verify that every primary source URL still resolves. Writes data/link-report.json.
 * Does not change policies.json; a human decides whether to replace a dead link.
 * usage: node scripts/check-links.mjs [--concurrency 8]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(__dirname, "..");
const policies = JSON.parse(fs.readFileSync(path.join(APP, "data", "policies.json"), "utf8"));
const CONC = Number(process.argv.includes("--concurrency") ? process.argv[process.argv.indexOf("--concurrency") + 1] : 8);

async function head(url) {
  const opts = { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (compatible; IndiaAIPolicyAtlas/1.0 link check)" }, signal: AbortSignal.timeout(20000) };
  try {
    let r = await fetch(url, { ...opts, method: "HEAD" });
    if (r.status === 405 || r.status === 403 || r.status === 400) r = await fetch(url, { ...opts, method: "GET" });
    return { status: r.status, ok: r.ok, final: r.url };
  } catch (e) {
    return { status: 0, ok: false, error: e.name === "TimeoutError" ? "timeout" : e.message.slice(0, 80) };
  }
}

const queue = policies.map((p) => ({ id: p.id, url: p.source_url }));
const results = [];
async function worker() {
  while (queue.length) {
    const job = queue.shift();
    const r = await head(job.url);
    results.push({ ...job, ...r });
    process.stderr.write(`${r.ok ? "ok " : "BAD"} ${r.status} ${job.id}\n`);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
const bad = results.filter((r) => !r.ok);
const report = { checked_at: new Date().toISOString(), total: results.length, broken: bad.length, items: bad.sort((a, b) => a.id.localeCompare(b.id)) };
fs.writeFileSync(path.join(APP, "data", "link-report.json"), JSON.stringify(report, null, 2) + "\n");
console.error(`\n${bad.length}/${results.length} primary links did not resolve (403/blocked hosts are common for gov.in; review manually)`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `broken=${bad.length}\n`);
