# How it was built

In plain words: what the tool does, the steps taken to build it, and why each choice was made.

## Top features

1. **Click a state and see what it has done.** A window opens with the state's counts and its top 5 policies, shown one by one. One button opens the full list.
2. **One record per policy, not per news article.** Repeated reports of the same announcement are merged into one record; the extra links are kept.
3. **Every record shows how sure we are.** "Primary source verified", "Official secondary source" or "Unconfirmed", with a note on what was checked.
4. **Clean states and dates.** One spelling per state, and dates that say whether they are exact to the day, the month or only the year.
5. **Status and binding force.** Draft vs adopted vs in force, and binding vs advisory, so a press announcement is not mistaken for a law.
6. **Time slider.** Watch the map fill in from 2018 to 2026.
7. **Ready to cite and reuse.** CSV for the whole dataset or one state, JSON API, a page per policy with its source.
8. **Stays current with a human check.** A daily scan of official feeds drafts new candidates; a person approves them through a pull request.

## The steps, roughly in order

| Step | What was done | Why |
|---|---|---|
| 1. Read the brief, plan | Wrote [Info/PLAN.md](../Info/PLAN.md): 5 states, Google News, collect → filter → normalise → dedupe → classify → export | Start small and test the method where it is hardest |
| 2. Fix the inclusion rule | "A public authority is the actor and AI is the subject" | Plain keyword matching on "AI" pulled in company news |
| 3. Change the unit to the instrument | Schema in `research/.../SCHEMA.md`: type, status, binding, confidence, source type | Researchers cite policies, not articles; this also makes deduplication tractable |
| 4. Research 5 priority states | Karnataka, Telangana, Tamil Nadu, Uttar Pradesh, Odisha | Each one tests something (volume, Hindi names, low coverage) |
| 5. Expand to all states and the Union | Same method, run region by region with AI research help | The method worked; leaving states blank would hide that they have little or nothing |
| 6. Build the merge pipeline | `scripts/merge-research.mjs`: normalise, check, dedupe, override, lint | One repeatable command from raw research to clean dataset |
| 7. Review flagged duplicates and weak records | `data/overrides.json`, confidence forced to low for news-search links | The tool should not look more certain than the evidence |
| 8. Build the website | Next.js on Vercel: map, explore table, timeline, matrix, compare, method | Free hosting, fast, one codebase for data and site |
| 9. Add the daily scan | `scripts/scan-sources.mjs` + GitHub Action; Claude drafts, a human approves | The brief asks for a pipeline, and policy keeps moving |
| 10. Recency sweep | Added May to Nov 2026 items, re-merged, resolved duplicates | The first pass was thin on recent months |
| 11. Redesign the home page | Removed the tile map and side panel; added the state window with top 5 and a "Go to a state" menu | The side panel was hard to read; the window answers "what has my state done?" in one click |
| 12. Docs and CSV | README, this file, rationale, AI-use note, `data/policies.csv` | Required deliverables, and so a reader can follow the reasoning |

## My ideas, and where they ended up

| Idea | What was built |
|---|---|
| Keep it updated automatically | Daily scan + pull request for review (`.github/workflows/daily-scan.yml`) |
| Show how reliable each source is | `source_type` and a three-level `confidence` label with a note, shown on every card |
| Show policy stage ("in talks", "announced", "implemented") | `status` field kept separate from the type of instrument |
| Deal with duplicates from many outlets | One record per instrument; duplicates merged, links kept in `secondary_sources` |
| Normalise "UP" / "Uttar Pradesh" / "Uttar-Pradesh" | Code and name alias tables in the merge script |
| Use Claude to help verify | Claude drafts candidate records in the scan; nothing enters the dataset without a person approving it |
| Local languages | Partly: Hindi terms in the scan. Listed as a known hole |
| Fuzzy matching vs a heavier model for duplicates | Chose word-overlap matching plus manual review. Easy to audit, and the flagged pairs are listed in `_merge-report.txt` |
| A tool that feels like an assistant | The state window: pick a state, get a short ranked briefing, then go deeper |

## Why the top 5 are ranked the way they are

`briefingScore` in `lib/data.ts` adds four simple scores:

- **Status:** in force or adopted (3) > draft, proposed or in court (1.5) > lapsed or withdrawn (0)
- **Type:** law and core policy (3) > institutions and court rulings (2) > guidance (1.5) > consultations and international (1)
- **Source:** primary source verified (2) > official secondary (1) > unconfirmed (0)
- **Recency:** 0 to 1, newer is higher

So a law in force that we verified ranks above a news report of an announced plan. The rule is shown in the window ("ranked by status, type, source, recency") so nobody mistakes it for a judgement of importance.
