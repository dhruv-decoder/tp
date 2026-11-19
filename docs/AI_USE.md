# AI use

## Short note for the submission (under 200 words)

> I used Claude in two ways. In Claude chat I talked through the brief and wrote the first plan: the inclusion rule, the five priority states, the schema, and how to handle duplicates, dates and state names. The ideas on confidence labels, policy status, automatic updates and using Claude to check records were mine; Claude turned them into fields and pipeline steps.
>
> In Claude Code I used it as a build assistant. It wrote most of the code (the Next.js site, the merge script, the daily scan) and helped me scale the research from five states to every state and the Union, running the same method region by region. Its research drafts were not always right: some entries rested on a single news report, and some were duplicates. So the pipeline forces news-only records to low confidence, flags likely duplicates for review, and I dropped 18 records by hand. I also asked it to redesign the home page around a state "briefing" window when the first design was hard to read.
>
> The scope decisions, the line on what counts, and the presentation are mine. Transcripts are in the next tab.

(about 190 words)

## What AI did, step by step

| Stage | Tool | What it did | What I did |
|---|---|---|---|
| Understanding the brief | Claude (chat) | Summarised the brief; asked questions; drafted [Info/PLAN.md](../Info/PLAN.md) | Chose the inclusion rule, the 5 states, and the ideas listed below |
| Research | Claude Code (research agents) | Searched official sites and news, drafted records in the schema, region by region | Set the schema and source order; started with 5 states, then decided to expand |
| Expanding to all states | Claude Code | Ran the same method for the remaining states, the Union, regulators and courts | Decided to keep thin states visible with honest confidence labels |
| Pipeline | Claude Code | Wrote `merge-research.mjs` (normalise, dedupe, lint), `validate-data.mjs`, `check-links.mjs`, `export-csv.mjs` | Reviewed merges and flagged pairs; wrote `overrides.json` decisions |
| Website | Claude Code | Built the Next.js site, map, filters, pages; later the state window redesign | Gave design direction: map first, plain copy, confidence everywhere, no tile map, a briefing window |
| Daily updates | Claude Code + Claude API | Wrote the scan; in the scan, Claude drafts candidate records | Required human approval via pull request before anything is added |
| Docs | Claude Code | Drafted README and these docs from my notes | Edited for accuracy and tone |

## My ideas that shaped the tool

Automatic updates, source reliability (confidence), policy stage (status), handling fake or conflicting reports, local languages, fuzzy matching vs a heavier model, Claude-assisted verification, and a prototype that feels like an assistant: pick a state, get a short briefing, then go deeper. Where each one ended up is in [HOW_IT_WAS_BUILT.md](HOW_IT_WAS_BUILT.md#my-ideas-and-where-they-ended-up).

## Where AI got things wrong, and the checks

- **Single-source records.** Some drafts relied on one news article. Fix: records whose source is a news-search link are forced to low confidence by the merge script (see `_merge-report.txt`); 80 records are low and labelled.
- **Duplicates.** The same policy was found by different research passes under different names. Fix: automatic merge for close matches, 16 pairs flagged for review, 18 records dropped in `overrides.json`.
- **Wording.** Drafts used marketing words ("landmark", "robust"). Fix: the merge script flags banned words.
- **Not everything is hand-verified.** 54 records are marked "primary source verified". The rest say what was and was not checked.

## Transcripts

Paste the Claude chat (planning) and the Claude Code sessions (build) into a separate tab of the submission Google Doc.
