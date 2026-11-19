# Project Summary — read this before you submit

This note exists because the brainstorm in `PLAN.md` was the *first* idea, written before any
building started. What actually got built is bigger and sourced differently. This doc explains
the real brief (from your screenshots), what was actually built, and what's still missing before
you can submit.

---

## 1. The actual brief (from the SAFL work test, via your screenshots)

**Task:** "AI-related policy activity across Indian states" — Secure AI Futures Lab work test,
150 of 180 total minutes allotted.

> Build a small pipeline that collects news about AI-related policy activity across Indian states
> and presents it as a simple, comprehensible dashboard or webpage.

"AI policy activity" = a state announcing an AI policy/mission, setting up a task force or
centre of excellence, MoUs for AI, AI deployment in governance (health/agriculture/policing/
education), state budget lines for AI, or regulatory/ethics moves. **You're told to use your own
judgment on what counts, and to explain where you drew the line.**

**What to deliver:**
1. A dataset — **CSV or XLSX**.
2. A live webpage presenting it clearly, hosted anywhere free. Link it in your docs.
3. A git repo with frequent, meaningful commits — they want to see the project *evolve*, not
   just the final state.
4. The code, as a zip file. Doesn't need to be pretty, needs to run.
5. A rationale note + READMEs.

**Key pointers that matter for grading:**
1. You are **not** expected to cover all 28 states. A handful covered well beats everything
   covered badly — show how you prioritized.
2. **Deduplicate.** The same announcement gets reported by ten outlets — how you collapse that
   says a lot about you.
3. **Normalize dates and states.** "UP", "Uttar Pradesh", "Uttar-Pradesh" must not become three
   different states.
4. **Sourcing is your call** — News APIs, scraping, a mix, whatever. Say what you used and why.
   If something's a stub because of a rate limit or paywall, say so — they care about design
   judgment more than raw volume.
5. Note your **assumptions and known holes in the README** — hiding what's broken counts against
   you, surfacing it counts for you.

**Rationale note (1 page, ~15 min):** how you picked sources, which states you prioritized and
why, your scraping/collection methodology, and why you presented the data the way you did.

**Submission mechanics:** a Google Doc named `Work Test Submission SAFL <First> <Last>`, shared
with `hiring@secureaifutureslab.com` (commenter + allow-copy access — if they can't open it, it
isn't graded), link pasted into ClassMarker. A separate tab in that doc holds your full AI-tool
transcripts, plus a <200-word note on which tools you used and for what.

---

## 2. What actually got built: "India AI Policy Atlas"

Partway through, the scope grew from "a handful of states, scraped from news" into a full
national tracker, sourced from primary documents instead of news search. Here's what exists,
point by point:

1. **National scope, not a handful of states.** 279 instruments: 145 at the Union level
   (Parliament, courts, ministries, sectoral regulators) and 134 across **all 36 states and
   union territories** — not the 5–state sample the first plan sketched.
2. **Sourced from primary documents, not news search.** Instead of Google News RSS, the dataset
   was compiled from official material directly (gazette notifications, cabinet approvals,
   policy PDFs, court orders, regulator circulars) — research notes live in
   `research/India AI policy landscape 2026/`, organized by region/topic.
3. **A richer schema than the brief's minimum.** Brief asked for: state, title, date, source
   name, source URL, one-line summary, category. The actual schema
   (`data/policies.json`) adds: `jurisdiction` code, `issuing_body`, `instrument_type` (7-way
   taxonomy, e.g. law, policy, court ruling, mission, regulator circular), `status` (draft /
   adopted / in force …), `binding` (yes/no), a **timeline** of sub-events per instrument,
   `confidence` (high/medium/low) with a note on what was and wasn't verified, `source_type`,
   secondary sources, and a `related` field linking an Act to its Rules/amendments.
4. **Deduplication and "what we deliberately dropped" is explicit**, via
   `data/overrides.json` — entries pulled from the raw research and the reason isn't hidden,
   it's a null-keyed list you can read directly.
5. **A live, multi-view website** (Next.js, deployed on Vercel), not a single static dashboard
   page:
   - **Map view** — India map, click a state to isolate its instruments.
   - **Timeline view** — instruments plotted over time, scrubbable.
   - **Compare view** — put states side by side.
   - **Matrix view** — state × policy-family heatmap.
   - **Signals page** — candidate items the daily scan found but hasn't been merged in yet.
   - **Method page** (`app/method`) — the methodology write-up: what counts, the 7 instrument
     families, status/binding definitions, confidence definitions. This is effectively doing the
     job the brief expected of the README's "Decisions" section.
6. **A CSV export already exists and is live**: `/api/policies.csv` on the deployed site
   (`app/api/policies.csv/route.ts`) — satisfies "deliver a dataset as CSV or XLSX" without a
   separate manual export step. It supports filtering by jurisdiction or a specific ID list.
7. **A daily automated scan** (`.github/workflows/daily-scan.yml`) — checks official feeds daily,
   drafts candidate entries, opens a PR for human review rather than auto-publishing. This is the
   "dynamic updates" stretch goal from the original brainstorm, actually shipped.
8. **A design/content rule enforced in code**: `scripts/merge-research.mjs` lints for banned
   marketing words (landmark, comprehensive, robust, ecosystem, leverage, holistic, paradigm…) —
   keeps the copy factual instead of slipping into AI-generated-sounding language.
9. **Dataset versioning**: `data/changelog.json` records dataset releases with a version string
   and a one-line summary, surfaced on the method page.

---

## 3. Deliverables checklist — mapped against the actual brief

| # | Brief asks for | Status | Where |
|---|---|---|---|
| 1 | Dataset, CSV or XLSX | **Done** | `data/policies.json` (source of truth) + live CSV at `/api/policies.csv` |
| 2 | Live webpage, link in docs | **Done** | Deployed on Vercel (project `india-ai-policy-atlas`) |
| 3 | Git repo, frequent meaningful commits showing evolution | **Partial** | Repo exists and is pushed, but history is only 5 commits for a large amount of work — doesn't clearly show incremental evolution the way the brief wants. Worth deciding if that's good enough to submit as-is. |
| 4 | Code as a zip | **Not done yet** | Needs to be zipped before the Google Doc submission |
| 5 | Rationale note (1 page) | **Not written** | Needs the 4 questions answered: source selection, state prioritization + why, methodology, presentation reasoning — **and needs to explain the scope pivot** (5 states via news → all states via primary documents) since that's a deviation from the obvious reading of the brief |
| 5 | README with assumptions + known holes | **Not written** | `README.md` is still the untouched default `create-next-app` boilerplate |
| — | AI usage note (<200 words) + full transcripts in a separate Google Doc tab | **Not done** | Has to happen at submission time, in the Google Doc itself |
| — | Google Doc named and shared correctly | **Not done** | `Work Test Submission SAFL <First> <Last>`, shared with `hiring@secureaifutureslab.com`, commenter + allow-copy |

One more loose end: the in-app **Method page hardcodes the repo link as
`github.com/dt-safl/india-ai-policy-atlas`**, but the code is actually pushed to
`github.com/dhruv-decoder/tp`. Worth fixing that link before submitting so the live site points
at the right repo.

---

## 4. Key files, if someone else is going to look at this project

| File / folder | What it is |
|---|---|
| `data/policies.json` | The dataset itself — 279 records, the core deliverable |
| `/api/policies.csv` (on the live site) | The CSV-format copy of the dataset the brief explicitly asks for |
| `research/India AI policy landscape 2026/` | Raw source research the dataset was compiled from — the evidence trail |
| `scripts/merge-research.mjs` | The "pipeline": raw research → deduped, linted, final dataset |
| `data/overrides.json` | What was deliberately excluded, and implicitly why |
| `app/method/page.tsx` | The methodology write-up (scope, taxonomy, confidence, status) |
| `data/changelog.json` | Dataset version history |
| `.github/workflows/daily-scan.yml` | The automated daily-update pipeline |
| `Info/PLAN.md` | The original brainstorm — useful context, not the final spec |
| `Info/PROJECT_SUMMARY.md` | This file |

---

## 5. Before you submit — remaining to-do

- [ ] Write `README.md` for real: setup, how to run, schema, decisions, assumptions, known holes
- [ ] Write a one-page rationale note answering the brief's 4 questions directly, including why
      the scope grew beyond "a handful of states, via news scraping"
- [ ] Zip the code
- [ ] Fix the hardcoded repo link on the Method page
- [ ] Decide whether the 5-commit git history is enough, or whether to note in the rationale that
      most of the dataset work happened in research/compile sessions outside small incremental
      commits
- [ ] Write the <200-word AI-usage note and gather the full chat transcripts for the Google Doc's
      second tab
- [ ] Create the Google Doc, name it correctly, share it with `hiring@secureaifutureslab.com`
      (commenter + allow copy), paste the live link + GitHub link into it, then submit the doc
      link in ClassMarker
