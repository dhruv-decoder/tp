# Rationale

One page on the four questions in the brief: sources, states, method, presentation.

## 1. How I chose sources

I started with the obvious plan: Google News RSS, several queries per state ([Info/PLAN.md](../Info/PLAN.md)). Two things changed my mind.

- **News describes events, policy researchers need instruments.** Ten articles about "Tamil Nadu AI mission" are one decision by one government. If the unit is the article, the hard work (deduplication, finding the date, finding the issuing body) never ends. If the unit is the instrument, ten articles become one record with nine extra links.
- **News search is noisy for this topic.** Most "state + AI" headlines are company launches in Bengaluru or Hyderabad, not state action.

So the order of preference is: gazette or the issuing department's own site → PIB or state press release → legislature or court record → reputable news. News is still used, but to **find** items and to back them up, not as the main source. Every record says which kind of source it rests on (`source_type`) and how far it was checked (`confidence`). When the only source was a news-search link, the pipeline forces confidence to "low" automatically.

For keeping it current, the daily scan reads official feeds (PIB, RBI, SEBI, TRAI). Several `.gov.in` sites refuse requests from cloud servers, so for those the scan uses Google News limited to the official domain (`site:pib.gov.in`). That is a workaround, and the README says so.

## 2. Which states, and why

I began with five states that each test something different:

| State | Why |
|---|---|
| Karnataka, Telangana, Tamil Nadu | Most activity. Tests precision and deduplication |
| Uttar Pradesh | Hindi coverage and name variants ("UP", "U.P.", "Uttar-Pradesh") |
| Odisha | Little coverage. Tests whether the method still finds signal |

Once the method was working on these five, AI-assisted research made it cheap to run the same steps for every state and UT. I expanded, but kept the brief's warning in mind: **coverage is uneven, and the site says so.** The five priority states have 7 to 12 records each and are the best checked. Many small states and UTs have 1 to 3. Confidence labels are shown everywhere so a thin, low-confidence state does not look as solid as Karnataka. Union instruments (178, including 34 international commitments) are included because state policy is often a response to them.

## 3. Method

1. **Collect.** Research by region and topic, written to JSON in a fixed schema (`research/.../SCHEMA.md`).
2. **Normalise states.** Codes and names are mapped to one list of 36 states/UTs plus Union (`TS`→`TG`, `Orissa`→`OD`, `Central`→`IN`...).
3. **Normalise dates.** ISO dates, plus `date_precision` (day 266 / month 25 / year 21) so an approximate date is never shown as exact.
4. **Check values.** Type, status, theme and sector must come from fixed lists; aliases are mapped (e.g. "notified" → in-force).
5. **Deduplicate.** Same id → merge. Then, within a state, titles that share most words and are close in date are merged; the better-sourced record wins and the other's link goes to `secondary_sources`. A draft and its final version are never merged; they are linked. Unclear pairs are flagged for a human (16 flagged, 5 merged automatically, 18 dropped by hand in `overrides.json`).
6. **Lint wording.** Summaries with marketing words ("landmark", "robust"...) are flagged and rewritten.
7. **Validate and export** to JSON and CSV.

**Where I drew the line:** a public authority must be the actor and AI must be the subject (or the authority must say the instrument governs AI). In: policies, missions, task forces, centres of excellence, MoUs the state signed, AI deployments a department announced, budget lines, laws, rules, court rulings. Out: company news, speeches, hackathons, think-tank papers.

## 4. How I present it, and why

The audience is researchers and policymakers. Their first question is "what has *my* state done?", so the home page is a map, and a click answers that question straight away: a window with the state's numbers and its **top 5 instruments**, then one button to see the rest. The top 5 follow a simple rule anyone can predict: in force first, then laws and core policies, then better-sourced, then newer.

Each record keeps the details a researcher needs to cite it: issuing body, status, binding or not, exact date precision, source link, and a sentence on what was verified. A table, timeline, state comparison and CSV download serve people who want to work with the data themselves. Copy is kept short and plain on purpose.
