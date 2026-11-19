I've written the final plan as **PLAN.md**. Give it to Claude Code with a prompt like: *"Build this project following PLAN.md stage by stage, committing after each stage with the listed messages."* Before that, confirm the fifth state: I filled in Odisha by default, but Kerala or Uttarakhand can go in `config.py` instead.

## Summary of our brainstorming

**Understanding the task**
- Build a pipeline that collects news on state-level AI policy, then a dataset and a live dashboard, plus a git history, README and a one-page rationale.
- They're grading judgment more than volume: where you draw the line, deduplication, normalizing states and dates, and being honest about what's broken.

**Key decisions**
- **What counts:** a state government body is the actor *and* AI is the subject. Company news, central government schemes, and IT policy with no AI part are excluded. Your first instinct was right: just matching the word "AI" pulls in too much irrelevant company news.
- **States (5):** Karnataka, Telangana and Tamil Nadu are high-activity and test precision. Uttar Pradesh tests Hindi and name normalization. Odisha, Kerala or Uttarakhand is the low-coverage contrast that tests whether the pipeline still finds signal.
- **Sourcing:** Google News RSS, with several query variants per state. It's free and needs no API key.
- **Architecture:** collect → filter → normalize → dedupe → classify → export → dashboard. Each stage writes its own file, so the funnel counts are visible.

**How your own ideas went into the plan**
1. **Dynamic updates:** the pipeline is incremental with stable IDs, and a daily GitHub Actions run refreshes the data. Marked as stretch.
2. **Source reliability:** your "confidence" idea became `source_type` (official / major outlet / other) plus a `confidence` column (high / medium / low). High means an official source or 3+ outlets reporting it.
3. **Policy status:** became a separate `stage` field (proposed / announced / implemented), kept apart from the topic `category`. Your "plausible / in talks" is `proposed`.
4. **Fake or conflicting news:** listed under future scope in the README.
5. **Local languages:** English only for now, with one Hindi query for UP as a proof of concept. Listed as a known hole.
6. **Cross-encoder vs fuzzy matching:** we went with an alias dictionary plus fuzzy matching as a fallback. It's fast and easy to audit, and the state comes from the article text, not the search query.
7. **Deduplication:** fuzzy title match within the same state and ±3 days. `num_sources` then works as an importance signal.
8. **"Ask Claude for verification":** became a manual audit where you hand-label about 60 sample rows and the script reports precision. That gives you your own measured result to cite.

**What only you should do**
- Label the audit rows.
- Write the rationale note.
- Edit the Decisions and Known holes sections of the README.
- Write the AI-usage note.
- Paste this whole chat into the doc's transcript tab, along with your Claude Code session.


# Build Plan — Indian State AI Policy Tracker

> Spec for Claude Code. Build stage by stage and **make a git commit after each stage** with a meaningful message (see the commit plan at the bottom). Do NOT write `RATIONALE.md` — the author writes it.

## 0. Decisions (fixed by the author)

- **Inclusion rule:** A record counts if **a state government body is the actor AND AI is the subject.**
  - Include: CM/minister/department announcements, state agencies, state police, state-run hospitals/universities deploying AI, state budget lines for AI, MoUs where the state is a signatory.
  - Exclude: private company news located in a state (funding, startups, IPOs, hiring), central-government schemes (IndiaAI, MeitY) unless a state is a named partner, generic IT/digital policy with no AI component, opinion pieces.
- **States (5, configurable in `config.py`):**
  - High activity (tests precision + dedup): Karnataka, Telangana, Tamil Nadu
  - Hindi belt (tests language + name normalization): Uttar Pradesh
  - Low-coverage contrast (tests signal with little news): **Odisha** ← author to confirm (alternatives: Kerala, Uttarakhand)
- **Time window:** 2025-01-01 → today.
- **Language:** English. One Hindi query for Uttar Pradesh as a proof of concept (stretch).

## 1. Schema — `data/records.csv`

| column | meaning |
|---|---|
| `id` | short hash of the canonical source URL (stable across re-runs) |
| `state` | normalized official English name |
| `title` | headline with the " - Source" suffix stripped |
| `date` | ISO `YYYY-MM-DD` (IST), earliest date in the duplicate cluster |
| `date_precision` | `exact` (from the feed) / `unknown` (missing) — this is the publication date, not the event date |
| `source_name` | outlet of the representative article |
| `source_url` | URL of the representative article |
| `source_type` | `official` (gov.in / nic.in / pib) · `major_outlet` (allow-list) · `other` |
| `confidence` | `high` = official source OR ≥3 outlets · `medium` = major outlet · `low` = single `other` source |
| `summary` | one line (v1: cleaned headline + RSS snippet; see known holes) |
| `category` | see taxonomy |
| `stage` | `proposed` / `announced` / `implemented` / `unknown` |
| `num_sources` | number of articles in the duplicate cluster |
| `flags` | `;`-separated: `multi_state`, `state_from_query`, `stage_guess` |

Also write `data/clusters.json`: id → list of all {title, source, url, date} in the cluster (keeps the CSV narrow).

## 2. Taxonomy

`category` (topic — first match wins, in this order):
1. `regulation_ethics` — ethics, guidelines, framework, regulation, responsible AI, deepfake rules, data protection
2. `budget_funding` — budget, allocation, crore, fund, outlay
3. `policy_mission` — policy, mission, strategy, roadmap, vision
4. `institution` — centre of excellence, CoE, task force, committee, AI city, lab, hub
5. `partnership_mou` — MoU, partnership, ties up, collaborates, signs with
6. `governance_deployment` — AI used in health, agriculture, policing, education, revenue, traffic, welfare (store the sector inside the summary, not as a new column)
7. `other`

`stage` (best effort, from title keywords; set the `stage_guess` flag whenever it is assigned):
- `proposed`: plans, proposes, mulls, to set up, will, draft, in talks, considering
- `announced`: announces, unveils, approves, cabinet nod, signs MoU
- `implemented`: launches, inaugurates, deploys, rolls out, operational, begins, goes live

## 3. Pipeline — `pipeline/`

Each stage reads the previous file and writes its own, so funnel counts are visible.

```
collect.py   -> data/raw.jsonl
filter.py    -> data/relevant.jsonl   (+ data/dropped.jsonl with drop reason)
normalize.py -> data/normalized.jsonl
dedupe.py    -> data/deduped.jsonl + data/clusters.json
classify.py  -> data/classified.jsonl
export.py    -> data/records.csv, docs/data.json, data/funnel.json
run.py       -> runs all stages; incremental (see §5)
config.py    -> states, aliases, queries, keyword lists, domain lists, thresholds
```

**collect.py** — Google News RSS via `feedparser`:
`https://news.google.com/rss/search?q={query}+after:2025-01-01&hl=en-IN&gl=IN&ceid=IN:en`
- 3–4 query variants per state, e.g. `"{state}" AI policy`, `"{state}" artificial intelligence government`, `"{state}" AI MoU`, `"{state}" AI centre of excellence`.
- Keep: title, link, published, source name, source href (`entry.source`), the query, and the query state.
- Sleep 1–2 s between requests. Log the count per query.

**filter.py** — rules applied to the title + snippet (case-insensitive, word boundaries):
- MUST contain an AI term: `\bAI\b`, artificial intelligence, machine learning, GenAI, generative AI, `\bML\b` (only next to "AI").
- MUST contain a government term: government, govt, CM, chief minister, minister, department, cabinet, police, state, mission, policy, MoU, budget, assembly, collector, district administration.
- DROP if it contains an exclusion term: startup raises, funding round, IPO, shares, stock, Sensex, layoffs, hiring, review (product), smartphone.
- Write the drop reason to `dropped.jsonl`.

**normalize.py**
- State: an alias dictionary in `config.py` (abbreviations, variant spellings, Hindi names, capital/major cities → state, e.g. Bengaluru→Karnataka, Hyderabad→Telangana, Chennai→Tamil Nadu, Lucknow/Noida→Uttar Pradesh, Bhubaneswar→Odisha, `UP`, `U.P.`, `Uttar-Pradesh`, `उत्तर प्रदेश`). Fuzzy fallback with `rapidfuzz` (threshold ≥ 90) for spelling variants.
- Assign the state from the article text, NOT the query. If several in-scope states match → take the most-mentioned one and flag `multi_state`. If none match → use the query state and flag `state_from_query`. If the matched state is out of scope → drop it (log it).
- Date: parse `published` → IST date; if missing → `date_precision=unknown`.
- Title: strip the trailing ` - {source}`, normalize whitespace and quotes.

**dedupe.py**
- Pass 1: identical canonical URL (strip query params / trailing slashes) → merge.
- Pass 2: same state AND |date difference| ≤ 3 days AND `rapidfuzz.token_set_ratio(title_a, title_b) ≥ 85` → same cluster (union-find).
- Representative = highest `source_type` tier (official > major_outlet > other), tie → earliest. Cluster `date` = earliest date. `num_sources` = cluster size.
- Keep the thresholds in `config.py` so the audit can tune them.

**classify.py** — category, stage, source_type, confidence per §1–2.

**export.py** — CSV + `docs/data.json` + `data/funnel.json` (`raw → relevant → in-scope → unique`, per state) + a `last_updated` timestamp.

## 4. Audit (author does the labelling)

`pipeline/audit.py`:
- `sample` mode → `audit/sample_kept.csv` (40 random rows from records) and `audit/sample_dropped.csv` (20 random from dropped), each with an empty `is_relevant` column.
- `score` mode → reads the labelled files and prints precision (kept) and the miss rate (dropped). Writes `audit/results.md`.
- The author labels the rows by hand, then rule changes are committed separately ("Tighten filter after audit: …").

## 5. Dynamic updates (stretch)

- `run.py` is incremental: it loads the existing `records.csv`/clusters, adds only new items, and re-runs dedupe against existing clusters (stable IDs).
- `.github/workflows/update.yml`: daily cron (`30 2 * * *`, 08:00 IST) → `pip install -r requirements.txt` → `python pipeline/run.py` → commit `data/` + `docs/data.json` if changed.

## 6. Dashboard — `docs/index.html` (GitHub Pages from `/docs`)

A single static page, vanilla JS + Chart.js from a CDN, reading `data.json`:
- Header: title, "last updated", one-line inclusion rule.
- Funnel strip: raw → relevant → in-scope → unique.
- State × category count matrix (heatmap-style table).
- Monthly timeline (records per month, by state).
- Filterable table: state, category, stage, confidence dropdowns + text search; columns: date, state, title (link), category, stage, confidence, num_sources.
- Footer: link to the CSV, the repo, and the methodology/known holes.
- Plain, readable, mobile-friendly. No framework, no build step.

## 7. README.md

Claude Code drafts the **technical** sections (setup, how to run, file layout, schema, pipeline stages). The author writes or edits the **Decisions**, **Assumptions** and **Known holes** sections. Seed the known holes with:
- English only (apart from one Hindi query); regional-language coverage is missing.
- Dates are publication dates, not event dates.
- No full-text scraping (Google News redirect links, paywalls) → the summary comes from the headline/snippet.
- Google News RSS returns at most ~100 items per query → recall is limited; query variants are a partial fix.
- Stage detection is keyword-based and noisy.
- Keyword relevance rules: audited precision is reported in `audit/results.md`.
- Future scope: conflicting/false-report detection across sources, an LLM relevance classifier, official state portal scrapers, regional-language feeds, event-date extraction.

`requirements.txt`: feedparser, rapidfuzz, python-dateutil (pandas optional).

## 8. Commit plan

1. `Init repo: scope, schema and inclusion rule in README`
2. `Add Google News RSS collector for 5 states`
3. `Add keyword relevance filter with logged drop reasons`
4. `Normalize states via alias dictionary and dates to IST`
5. `Deduplicate by canonical URL and fuzzy title within ±3 days`
6. `Classify category, stage, source type and confidence`
7. `Export CSV, JSON and funnel counts`
8. `Add audit sampling and scoring script`
9. `Tighten filter after manual audit: <what changed>` (author)
10. `Add static dashboard`
11. `Deploy to GitHub Pages`
12. `Add daily GitHub Actions refresh` (stretch)
13. `README: assumptions and known holes`

## Cut order if behind schedule

Hindi query → GitHub Actions cron → timeline chart → `stage` field. Never cut: dedupe, the audit, known holes.
