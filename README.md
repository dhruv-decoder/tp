# India AI Policy Atlas

Union and state AI policy instruments in India, each linked to its primary source and labelled with a confidence level. Built and maintained by Secure AI Futures Lab.

- `app/` — Next.js site (Vercel). Data lives in `app/data/policies.json`.
- `research_notes/` — research notes per workstream, the entry schema (`SCHEMA.md`), and the raw researcher JSON that `app/scripts/merge-research.mjs` merges into the dataset.

## Data

| File | Purpose |
|---|---|
| `app/data/policies.json` | The dataset. One object per instrument; schema in `research_notes/.../SCHEMA.md`. |
| `app/data/jurisdictions.json` | 36 states/UTs plus the Union: codes, regions, tile-map positions. |
| `app/data/overrides.json` | Manual corrections applied on every merge (`null` drops an entry). |
| `app/data/changelog.json` | Dataset versions. Bump on every data release. |
| `app/data/candidates.json` | Output of the daily scan, awaiting human review. |

Public endpoints: `/api/policies`, `/api/policies?j=TN`, `/api/policies/{id}`, `/api/policies.csv`.

## Updating

1. **Daily scan** (`.github/workflows/daily-scan.yml`): reads PIB, RBI, SEBI, TRAI feeds and news queries, asks Claude whether each AI-related item is an instrument, and opens a PR with `candidates.json`. Requires the `ANTHROPIC_API_KEY` repository secret.
2. **Review**: read the linked source, move the drafted entry into `policies.json` (or add it to a researcher JSON and re-run `node scripts/merge-research.mjs`), fix the date and official URL, set confidence, add a changelog line.
3. **Validate**: `node scripts/validate-data.mjs`. Weekly `check-links.mjs` reports dead primary links.
4. Push to `main`; Vercel deploys. The Signals page polls the feeds on each visit (cached hourly) without any of this.

## Develop

```bash
cd app && npm install && npm run dev
```

Licence: code MIT, data CC BY 4.0.
