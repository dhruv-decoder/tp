# Entry schema for the India AI Policy Tracker dataset

Every policy instrument you find becomes ONE JSON object in a JSON array. Save the array to the `.json` path given in your brief. Also keep your markdown notes (sources, uncertainties, things you could not verify) in the `.md` path.

Be exhaustive but honest. One entry per distinct instrument (an Act, its Rules, and an amendment are three entries, linked via `related`). Do not merge unrelated things. Do not invent. If you cannot find an official source, still include the entry with `confidence: "low"` and say why in `confidence_note`.

## JSON object fields

```jsonc
{
  "id": "central-meity-ai-governance-guidelines-2025",   // kebab-case, unique, prefix with jurisdiction code
  "title": "India AI Governance Guidelines",             // official short title, no marketing words
  "jurisdiction": "IN",                                  // "IN" for central/Union; else ISO 3166-2:IN code without prefix, e.g. "TN", "KA", "MH", "DL", "JK", "LA", "PY", "CH", "AN", "LD", "DH" (Dadra & Nagar Haveli and Daman & Diu)
  "jurisdiction_name": "Union",                          // "Union" or state/UT name
  "issuing_body": "Ministry of Electronics and Information Technology (MeitY)",
  "instrument_type": "guidelines",                       // one of: act | rules | amendment | bill | ordinance | policy | strategy | framework | guidelines | advisory | notification | scheme | mission | standard | consultation | committee-report | court-ruling | institution | declaration | executive-order | procurement | curriculum | other
  "status": "adopted",                                   // one of: in-force | adopted | draft | consultation | proposed | announced | lapsed | withdrawn | superseded | pending-assent | under-litigation
  "binding": "non-binding",                              // binding | non-binding | mixed
  "date": "2025-11-05",                                  // primary date (notified / released / approved). Use YYYY-MM-DD; if only month known use YYYY-MM-01 and set date_precision
  "date_precision": "day",                               // day | month | year
  "timeline": [                                          // chronological milestones, each with a date and a short plain event
    { "date": "2025-01-06", "event": "Subcommittee report on AI governance released for comment" },
    { "date": "2025-11-05", "event": "Final guidelines released" }
  ],
  "summary": "One or two plain sentences on what the instrument does. No adjectives like 'landmark' or 'comprehensive'.",
  "key_provisions": [                                    // 3 to 7 short concrete bullets; each one a fact a researcher can cite
    "Seven sui generis principles including trust, people first, innovation over restraint",
    "Proposes an AI Governance Group chaired by the Principal Scientific Adviser"
  ],
  "themes": ["governance", "safety"],                    // pick from the controlled list below; 1 to 5 themes
  "sectors": ["cross-sector"],                           // pick from: cross-sector | finance | health | education | telecom | defence | agriculture | public-services | elections | media | employment | transport | law-enforcement | judiciary | energy | startups-industry
  "source_url": "https://www.meity.gov.in/...",          // the single best primary (official) URL; a PDF on a gov.in / nic.in / gazette domain is ideal
  "source_type": "official",                             // official | gazette | press-release | legislature | court | news | secondary
  "secondary_sources": ["https://pib.gov.in/...", "https://..."],  // other URLs you used, official first
  "confidence": "high",                                  // high = official primary doc located and read; medium = official press release or two reputable secondary sources agree; low = single secondary source, rumoured, or cannot confirm status
  "confidence_note": "Why this confidence; what is unverified (e.g. 'Cabinet approval reported by press; policy text not yet published').",
  "related": ["central-meity-subcommittee-ai-governance-2025"],  // ids of related entries (your own or ones you expect others to create)
  "last_verified": "2026-11-19"                          // today's date when you checked the source
}
```

## Controlled theme list

`governance` · `safety` · `risk-management` · `data-protection` · `privacy` · `synthetic-media` (deepfakes, labelling, watermarking) · `content-moderation` · `compute` · `datasets` · `models` (foundation / sovereign models) · `skilling` · `research-funding` · `startups-innovation` · `procurement` · `public-sector-use` · `ethics` · `fairness-bias` · `transparency` · `accountability-liability` · `copyright-ip` · `competition` · `cybersecurity` · `standards` · `children` · `elections` · `employment-labour` · `international` · `sectoral-regulation` · `infrastructure` · `institution-building` · `incident-reporting` · `export-trade`

## What counts as an entry

Include: Acts, Rules, amendments, bills (incl. private member bills if they got attention), gazette notifications, cabinet-approved policies, draft policies released for consultation, official strategies and frameworks, formal guidelines and advisories, standards (BIS/TEC), committee and task-force reports commissioned by government, regulator circulars/consultations (RBI, SEBI, IRDAI, TRAI, CCI, ECI...), court rulings that set AI-relevant precedent, missions and schemes with budgets, official institutions created (AI Safety Institute, centres of excellence, state AI missions), official international declarations India signed or hosted, state curriculum mandates, procurement rules for AI.

Exclude: mere speeches, MoUs with single companies unless they create a public programme, hackathons, conference announcements without policy content, think-tank papers not commissioned by government (you may cite them as secondary sources).

## Quality rules

- Prefer `.gov.in`, `.nic.in`, `egazette.gov.in`, `prsindia.org` (for bill tracking), `pib.gov.in`, state IT department portals, regulator sites (rbi.org.in, sebi.gov.in, trai.gov.in, irdai.gov.in, eci.gov.in). Use news (The Hindu, Indian Express, MediaNama, Economic Times, Mint, Business Standard, Hindustan Times, Bar & Bench, LiveLaw) to discover, then confirm against official sources where possible.
- Record the exact date you can prove. If the press says "approved by Cabinet on 10 Sept" but the document is undated, date = 2025-09-10 with `date_precision: "day"` and note the source in `confidence_note`.
- Plain language. No "landmark", "comprehensive", "robust", "cutting-edge", "ecosystem", "leverage", "holistic", "paradigm". Write like a legal researcher.
- Every `key_provisions` bullet must be specific (numbers, names, obligations, deadlines, budgets in ₹ crore).
- If a state has NO dedicated AI policy, still create one entry of `instrument_type: "other"` with `status: "announced"` or note what exists (e.g. an IT policy with an AI chapter), so that the map can show the real state of play. If genuinely nothing exists, write that in your markdown notes under a "States with no instrument found" heading so we can show "no instrument found" with confidence.
