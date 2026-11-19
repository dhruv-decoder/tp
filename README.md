# India AI Policy Atlas

A tracker of AI-related policy activity by Indian states, union territories and the Union government.
Each record links to its source and carries a label saying how sure we are.

- **Live site:** https://india-ai-policy-atlas.vercel.app
- **Code:** https://github.com/dhruv-decoder/tp
- **Dataset (CSV):** [`data/policies.csv`](data/policies.csv), also live at https://india-ai-policy-atlas.vercel.app/api/policies.csv

---

## Read these first

| Doc | What it tells you |
|---|---|
| **README.md** (this file) | What it is, how to run it, key files, schema, known holes |
| [docs/RATIONALE.md](docs/RATIONALE.md) | One-page rationale: sources, which states and why, method, why this design |
| [docs/HOW_IT_WAS_BUILT.md](docs/HOW_IT_WAS_BUILT.md) | Top features, the step-by-step build, and the reason behind each decision |
| [docs/AI_USE.md](docs/AI_USE.md) | How AI tools were used, the short note for the submission, and what was checked by hand |
| [Info/PLAN.md](Info/PLAN.md) | The original plan (5 states, Google News). Kept to show where the project started |

---

## What you can do on the site

1. **Map (home).** India shaded by number of policies. Click a state, or pick it from "Go to a state", and a window opens with its top 5 policies, one after another. "See all" opens the full state page. "Union (national)" does the same for central policies.
2. **Filter by type and year.** Chips filter by type (law, court, policy, guidance, consultation, institution, international). The slider and play button show how the map filled in from 2018 to now.
3. **State page** (`/jurisdiction/KA`). Every policy for one state, grouped by type, with a CSV download for that state.
4. **Policy page** (`/policy/<id>`). Summary, key provisions, timeline, sources, what was verified, related policies, a citation to copy.
5. **Policies.** Search box, three main filters (state, type, status) and more on demand. Results grouped by year, 30 at a time, downloadable as CSV.
6. **Timeline and Compare.** Policies over time; two or three states side by side.
7. **News feed.** New items from official sources (PIB, RBI, SEBI, TRAI and Google News limited to government sites) that mention AI and may need adding.

---

## Run it locally

Needs Node 20 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

Data commands:

```bash
npm run data:merge     # research JSON -> data/policies.json -> data/policies.csv
npm run data:validate  # schema, duplicate id and broken-link-between-records checks
npm run data:csv       # rebuild data/policies.csv only
npm run scan           # daily scan; needs ANTHROPIC_API_KEY, else it only lists raw matches
```

Deploy: `vercel --prod` (project `india-ai-policy-atlas`).

---

## Key files

| Path | What it is |
|---|---|
| `data/policies.json` | The dataset. Source of truth for the site. 312 records |
| `data/policies.csv` | Same data as CSV (the brief's dataset deliverable) |
| `data/jurisdictions.json` | The 36 states and UTs plus "Union", with codes, regions and map names |
| `data/overrides.json` | Manual corrections. `null` means "drop this record" (18 dropped) |
| `data/changelog.json` | Dataset versions |
| `research/India AI policy landscape 2026/` | Raw research files by region and topic, plus `SCHEMA.md` and `_merge-report.txt` (merges, flags) |
| `scripts/merge-research.mjs` | The pipeline: normalise states and dates, check values, de-duplicate, apply overrides, lint wording |
| `scripts/scan-sources.mjs` | Daily scan of official feeds; Claude drafts candidate records for human review |
| `scripts/validate-data.mjs` | Fails if the dataset breaks the schema |
| `scripts/check-links.mjs` | Weekly check that source links still work |
| `scripts/export-csv.mjs` | Writes `data/policies.csv` |
| `.github/workflows/daily-scan.yml` | Runs the scan daily and opens a pull request with candidates |
| `app/page.tsx`, `components/AtlasClient.tsx` | Home page: map, filters, year slider |
| `components/StateWindow.tsx` | The state window with the top 5 policies |
| `components/ExploreClient.tsx` | The Policies page: search, filters, list |
| `components/IndiaMap.tsx`, `lib/geo.ts` | Map drawing (d3-geo, Survey of India boundaries) |
| `lib/data.ts` | Data loading, counts, and `briefingScore` (how "top 5" is chosen) |
| `lib/taxonomy.ts` | Families, status groups, confidence labels |
| `app/api/policies.csv/route.ts`, `app/api/policies/` | CSV and JSON download endpoints |

---

## Schema (one row per instrument)

The brief's minimum fields are all present: state (`jurisdiction_name`), title, date, source name (`issuing_body`), source URL, one-line summary, category (`instrument_type` and `family`).

| Field | Meaning |
|---|---|
| `id` | Stable slug, e.g. `ka-gig-workers-act-2025` |
| `title` | Official name of the instrument |
| `jurisdiction`, `jurisdiction_name` | Normalised code and name (`KA`, `Karnataka`; `IN` = Union) |
| `issuing_body` | Department, regulator, legislature or court |
| `instrument_type` | One of 23 types (act, rules, policy, mission, guidelines, court-ruling, institution…) |
| `family` | 7 groups of types, used for colour and filters |
| `status` | in-force, adopted, draft, consultation, proposed, announced, lapsed, withdrawn, superseded… |
| `binding` | binding, non-binding, mixed |
| `date`, `date_precision` | ISO date and whether it is known to the `day`, `month` or only `year` |
| `summary`, `key_provisions` | One-line summary and main points |
| `themes`, `sectors` | Controlled lists (e.g. deepfakes, skilling; health, agriculture) |
| `source_url`, `source_type` | Best source found, and its kind (official, gazette, press-release, legislature, court, news, secondary) |
| `secondary_sources` | Other reports of the same instrument (where duplicates go) |
| `confidence`, `confidence_note` | high / medium / low, and what was or was not verified |
| `related` | Linked records (an Act and its Rules, a draft and its final) |
| `last_verified` | When the record was last checked |

---

## Assumptions

- A record is one **instrument** (a policy, law, mission, institution, MoU-backed programme, court ruling…), not one news article. Ten articles about the same policy are one record with extra links in `secondary_sources`.
- A record counts when **a public authority is the actor and AI is the subject**, or the authority itself says the instrument governs AI. Company news, speeches, hackathons and think-tank papers are out.
- The date is when the instrument was approved, notified or released, not when it was reported.
- No record for a state means we found nothing official, not that nothing exists.

## Known holes

- **Sourcing differs from the brief's default.** Records were compiled from official documents with AI-assisted web research, not from a news API alone. News is used to discover items and stored as secondary sources. See [docs/RATIONALE.md](docs/RATIONALE.md).
- **80 of 312 records are low confidence** (a single news report, or a news-search link as the source). They stay visible and labelled; treat them as leads.
- **Not every record was read by a human against the original document.** 54 are "primary source verified". The rest rely on official press releases or reputable reports.
- **English first.** The scan matches a few Hindi terms (एआई, कृत्रिम बुद्धिमत्ता, डीपफेक). Other regional-language sources are not covered, so smaller states are likely undercounted.
- **Some government sites block automated requests** from cloud servers. For those, the scan uses Google News results limited to the official domain (`site:pib.gov.in` etc.).
- **The daily scan needs setup**: an `ANTHROPIC_API_KEY` secret in the GitHub repo. Without it the scan only lists raw matches, and nothing is added to the dataset without a person approving a pull request.
- **Duplicate detection is word-overlap on titles**, plus manual review of flagged pairs. It can miss duplicates that are named very differently.
- **"Top 5" ranking is a simple, visible rule** (status, then type, then confidence, then recency). It is a reading aid, not a judgement of importance.
- **Links rot.** `check-links.mjs` reports broken sources weekly; fixes are manual.
- **No hand-labelled accuracy check yet.** The first plan included labelling a random sample of about 40 records to measure precision. That was not done.
- **Git history is short** (about 12 commits). Much of the data work happened in research sessions and landed in a few large commits.
