# India Union executive-branch AI policy instruments (as of 19 November 2026)

Scope: MeitY/IndiaAI, NITI Aayog, Office of the PSA, Cabinet, Union Budget, Ministry of Education/CBSE, MoD, MHA, Labour, DST. Excluded (other researchers): RBI/SEBI/TRAI/IRDAI/CCI/ECI, Parliament bills, DPDP Act/Rules, IT Rules amendments (incl. the Oct 2025 / Mar 2026 synthetic-media labelling amendments), courts. Those are referenced only in `related` ids.

Companion JSON: `central_executive.json` (40 entries). Research method note: web-search budget was exhausted after ~45 queries; remaining verification was done by direct fetch of official PDFs (text extracted locally with pdftotext) and news pages. pib.gov.in HTML pages returned HTTP 403 to the fetch tool throughout, so PIB releases are cited by PRID where the search engine confirmed title and existence, and content was taken from PIB's `static.pib.gov.in` PDFs where available.

---

## Key question 1: Catalogue — what instruments exist, with dates, status, provisions

### Takeaway
The Union executive governs AI through (a) one voluntary umbrella framework (India AI Governance Guidelines, 5 Nov 2025) and its Jan 2025 draft; (b) four MeitY advisories under the IT Rules (Nov 2023, Dec 2023, 1 Mar 2024, 15 Mar 2024); (c) a Cabinet-approved spending mission (IndiaAI Mission, 7 Mar 2024, ₹10,371.92 crore) with seven pillars and a growing set of sub-programmes (compute portal, AIKosh, foundation models, Safe & Trusted AI projects, AI Safety Institute, startup acceleration); (d) two new coordinating bodies created in April 2026 (AIGEG and TPEC); (e) a draft techno-legal data framework (DEPA for AI Training, 31 Oct 2026); (f) NITI Aayog strategy/roadmap papers (2018–2026); (g) budget-created programmes (AI CoEs ₹990 crore; CoE AI in Education ₹500 crore; FY27 ₹1,000 crore IndiaAI line; Education-to-Employment committee); and (h) scattered sectoral-ministry instruments (CBSE AI curriculum, MoD DAIC/DAIPA, MHA/I4C deepfake advisory, Labour task force, DST NM-ICPS). No AI-specific statute or binding executive order on AI exists as of 19 Nov 2026.

### Cited Findings (by instrument)

**MeitY — India AI Governance Guidelines (5 Nov 2025)**
- Released 5 Nov 2025; voluntary; built on seven "sutras" and six pillars; no standalone AI law — [DSCI summary](https://www.dsci.in/resource/content/summary-india-ai-governance-guidelines); [Digital Policy Alert](https://digitalpolicyalert.org/event/35105-ministry-of-electronics-and-information-technology-released-india-ai-governance-guidelines)
- Drafting committee constituted by MeitY in July 2025; seven sutras "adapted from the RBI's FREE-AI Committee report": Trust is the Foundation; People First; Innovation over Restraint; Fairness & Equity; Accountability; Understandable by Design; Safety, Resilience & Sustainability — [Guidelines PDF (PIB mirror)](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- Six pillars: Infrastructure; Capacity Building; Policy & Regulation; Risk Mitigation; Accountability (graded liability); Institutions (AIGG + TPEC + AISI, sector regulators keep enforcement) — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- Text: "at this stage, a separate law to regulate AI is not needed given the current assessment of risks"; copyright law "may need to be amended ... to enable the large-scale training of AI models"; IT Act "should be suitably amended" to cover AI-value-chain actors — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- Suggested AIGG composition: Chair = Principal Scientific Adviser; members MeitY, MHA, MEA, DST, DoT, TRAI, CCI, Data Protection Board, sectoral regulators (RBI, SEBI, ICMR, UGC), NITI Aayog, Office of PSA — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- Action plan: short term = establish AIGG and TPEC, India-specific risk classification, voluntary frameworks, "master circular" of applicable regulations, groundwork for AI incidents database, liability regimes; medium term = amend laws, operationalise AI incident systems, pilot regulatory sandboxes, publish standards; long term = "draft new laws based on emerging risks and capabilities" — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- More than 2,500 submissions were received on the Jan 2025 draft — [Chambers](https://chambers.com/articles/meity-unveils-india-s-approach-towards-regulating-artificial-intelligence)
- Committee chaired by Prof. Balaraman Ravindran (IIT Madras) — [MediaNama explainer](https://www.medianama.com/2025/11/223-meity-ai-governance-liability-regulation-innovation/); [IIT-M profile](https://wsai.iitm.ac.in/~ravi/about/)

**MeitY — Report on AI Governance Guidelines Development (subcommittee report, 6 Jan 2025)**
- Released 6 Jan 2025 by the Subcommittee on "AI Governance and Guidelines Development" under the PSA-chaired Advisory Group; subcommittee constituted 9 Nov 2023; comments due 27 Feb 2025 (extended) — [Storyboard18](https://www.storyboard18.com/digital/meity-releases-ai-governance-guidelines-report-a-whole-of-government-approach-recommended-52711.htm); [Storyboard18 extension](https://www.storyboard18.com/how-it-works/meity-extends-deadline-for-public-comments-on-report-on-ai-governance-guidelines-development-54566.htm)
- Recommended whole-of-government approach, an Inter-Ministerial AI Coordination Committee / Governance Group, a Technical Secretariat in MeitY, a national AI incident database, voluntary transparency commitments, techno-legal approach, lifecycle/ecosystem view — [MediaNama analysis](https://www.medianama.com/2025/01/223-analysing-meitys-report-on-development-of-ai-governance-guidelines/); [Internet Governance Project](https://www.internetgovernance.org/2025/02/24/indias-report-on-ai-governance-guidelines-development/)
- Advisory Group on AI chaired by the Principal Scientific Adviser, formed 2023 — [MediaNama](https://www.medianama.com/2025/01/223-analysing-meitys-report-on-development-of-ai-governance-guidelines/)

**MeitY advisories (IT Rules 2021, Rule 3(1)(b))**
- 26 Dec 2023 advisory to intermediaries on deepfakes/misinformation (communicate prohibited content categories; disable access) — [Legal500 (revised advisory background)](https://www.legal500.com/intelligence/india/technology/revised-meity-advisory-on-deployment-of-ai-models); [ELP](https://elplaw.in/leadership/navigating-ai-regulation-in-india-unpacking-the-meity-advisory-on-ai-in-a-global-context/)
- 1 Mar 2024 advisory: "under-testing/unreliable" AI models to be deployed only with explicit government permission; labelling; 15-day action-taken report — [ELP](https://elplaw.in/leadership/navigating-ai-regulation-in-india-unpacking-the-meity-advisory-on-ai-in-a-global-context/); [indian.substack](https://indian.substack.com/p/the-meity-advisory-on-approving-ai)
- 15 Mar 2024 revised advisory dropped the permission requirement; kept labelling/metadata and consent pop-up expectations — [Legal500](https://www.legal500.com/intelligence/india/technology/revised-meity-advisory-on-deployment-of-ai-models)
- Note: exact MeitY PDF URLs for the advisories were not fetchable this session; dates are from multiple concurring legal/news sources and are consistent with the researcher's prior knowledge (incl. the first 7 Nov 2023 deepfake advisory).

**Cabinet — IndiaAI Mission (7 Mar 2024)**
- Cabinet approved ₹10,371.92 crore over five years; seven components: IndiaAI Compute Capacity, IndiaAI Innovation Centre, IndiaAI Datasets Platform, IndiaAI Application Development Initiative, IndiaAI FutureSkills, IndiaAI Startup Financing, Safe & Trusted AI — [PIB PRID 2012375](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2012375)
- Implemented by IndiaAI Independent Business Division under Digital India Corporation — [IndiaAI article (via PSA mirror)](https://psa.gov.in/CMS/web/sites/default/files/publication/India%20Takes%20the%20Lead%20Establishing%20the%20IndiaAI%20Safety%20Institute%20for%20Responsible%20AI%20Innovation.pdf)
- Centre reported to be considering near-doubling of outlay to ~₹20,000 crore (not approved as of Nov 2026) — [Outlook Business](https://www.outlookbusiness.com/deeptech/explained-how-indias-20000-crore-ai-mission-could-be-a-game-changer-in-the-countrys-global-tech-leadership)

**IndiaAI Compute Portal / GPUs**
- 18,000+ GPUs announced 30 Jan 2025 via empanelment; RFE issued 16 Aug 2024; bids opened 22 Jan 2025 — [IndiaAI 31 Jan 2025](https://psa.gov.in/CMS/web/sites/default/files/publication/India%20Takes%20the%20Lead%20Establishing%20the%20IndiaAI%20Safety%20Institute%20for%20Responsible%20AI%20Innovation.pdf); [CareerIndia](https://www.careerindia.com/news/indiaai-mission-2026-access-subsidized-gpus-boost-ai-careers-scale-startups-011-66885.html)
- 38,000+ GPUs at ₹65/hour (Feb 2026, official backgrounder) — [PIB backgrounder 10 Feb 2026](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc2026210784401.pdf); [PIB press note](https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=156786&lang=1&reg=3)
- 20,000 additional GPUs announced 17 Feb 2026 at the Summit — [Wikipedia summary of Vaishnaw statement](https://en.wikipedia.org/wiki/India_AI_Impact_Summit_2026)
- 45,000+ GPUs as of June 2026 — [PIB PRID 2295477 (search snippet)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2295477); 93.18 lakh subsidised GPU hours consumed by Aug 2026 — [CareerIndia](https://www.careerindia.com/news/indiaai-mission-2026-access-subsidized-gpus-boost-ai-careers-scale-startups-011-66885.html)
- Demand-side problem: empanelled providers report under-utilisation — [Communications Today](https://www.communicationstoday.co.in/38000-gpus-one-big-problem-indias-ai-mission-cant-find-enough-users/)

**AIKosh (IndiaAI Datasets Platform)**
- 7,541 datasets and 273 models across 20 sectors as of Feb 2026 — [PIB backgrounder](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc2026210784401.pdf)
- 15,000+ datasets, 300 models, 30 toolkits as of Aug 2026 workshop — [PIB PRID 2301666](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2301666&reg=48&lang=2); [SuperKalam summary](https://superkalam.com/current-affairs/21-08-2026/indiaai-mission-organises-workshop-on-aikosh-to-strengthen-india-s-ai-ready-data-ecosystem-68162724-c4d0-4e60-9eb5-007f488533b9)

**IndiaAI Foundation Models programme**
- Call for proposals opened 30 Jan 2025 (extended to 30 Apr 2025) — [IndiaAI](https://indiaai.gov.in/article/call-for-proposals-for-building-india-s-foundational-ai-models-date-extended-30th-april-2025)
- Sarvam selected April 2025 from 67 applicants; Soket, Gnani, Gan in the first phase; eight more in Sept 2025 (BharatGen/IIT Bombay, Tech Mahindra Makers Lab, Fractal, Avataar, ZenteiQ, Genloop, IntelliHealth/NeuroDX, Shodh AI); 12 total from 500+ proposals — [PIB backgrounder Feb 2026](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc2026210784401.pdf); [AIM](https://analyticsindiamag.com/ai-features/here-are-the-8-new-tech-firms-scaling-under-indiaai-missions-phase-2); [PIB PRID 2177598](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2177598)
- Models unveiled at Feb 2026 Summit: Sarvam 30B ("Vikram") and 105B; BharatGen Param2 17B MoE (22 languages); Gnani Vachana voice stack — [Free Press Journal](https://www.freepressjournal.in/tech/ai-summit-2026-meet-the-3-sovereign-ai-llm-models-that-were-unveiled-in-delhi-to-rival-global-tech-giants)

**Safe & Trusted AI projects (EoIs)**
- First EoI: eight Responsible AI projects selected (machine unlearning, synthetic data, bias mitigation, explainable AI, privacy, ethical certification, algorithmic auditing, LLM transparency) from 2,000+ proposals (Oct 2024) — [MediaNama](https://www.medianama.com/2026/07/223-meity-india-ai-safety-institute-director-hiring/)
- Second EoI launched 30 Jan 2025 with themes watermarking & labelling, ethical AI frameworks, risk assessment, stress testing, deepfake detection — [IndiaAI 31 Jan 2025](https://psa.gov.in/CMS/web/sites/default/files/publication/India%20Takes%20the%20Lead%20Establishing%20the%20IndiaAI%20Safety%20Institute%20for%20Responsible%20AI%20Innovation.pdf)
- Five projects selected Oct 2025 from 400+ proposals: Saakshya (IIT Jodhpur/IIT Madras), AI Vishleshak (IIT Mandi/HP Forensics), real-time voice deepfake detection (IIT Kharagpur), gender-bias evaluation in agri LLMs (Digital Futures Lab/Karya), penetration testing (Globals ITES/IIIT Dharwad) — [YourStory](https://yourstory.com/2025/10/indiaai-bolsters-safe-ai-push-solutions-deepfake-detection); [ETV Bharat](https://www.etvbharat.com/en/!technology/indiaai-selects-5-projects-to-advance-safe-and-trusted-ai-in-country-enn25100704740)
- 13 projects approved in total as of 27 Jul 2026 — [DD News](https://ddnews.gov.in/en/indiaai-missions-safe-trusted-ai-pillar-advances-responsible-ai-13-projects-approved-to-tackle-deepfakes-and-bias/)

**IndiaAI Safety Institute** — see Key Question 3.

**AIGEG / TPEC (April 2026)** — see Key Question 3.

**MeitY — DEPA for AI Training (draft handbook, 31 Oct 2026)**
- Released 31 Oct 2026 in Bengaluru by Secretary S. Krishnan with iSPIRT; "techno-legal framework for enabling trusted AI training while safeguarding data rights and sovereignty" — [PIB PRID 2330756](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2330756&reg=48&lang=2); draft PDF — [MeitY](https://www.meity.gov.in/static/uploads/2026/10/02d8224e4cd6c8c29be5a5198e795158.pdf)
- Draft for discussion, not legally binding; confidential "sealed room" compute, machine-readable electronic contracts, Data Collabs as intermediaries, differential privacy; models verified "fit for use" (bias, security, explainability) by a competent government authority before pilot/scale; voluntary; consultations "in the coming weeks"; claims $500 bn GDP value by 2030 — [Elets CIO](https://cio.eletsonline.com/artificial-intelligence/meity-depa-ai-training-framework-sealed-rooms-sensitive-data-ispirt/76548/); [The420](https://the420.in/meity-ai-training-framework-model-vetting-approval/)
- The Nov 2025 Guidelines already cite DEPA for AI Training as the example of a techno-legal approach — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)

**MeitY — AI regulation consultation paper (announced Oct 2026; not published as of 19 Nov 2026)** — see Key Question 4.

**IndiaAI Startups Global Acceleration Programme**
- Cohort II of 10 startups announced April 2026 with Station F and HEC Paris, under the Startup Financing pillar — [PIB PRID 2252858](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2252858); [YourStory](https://yourstory.com/2026/04/indiaai-mission-selects-10-startups-second-cohort)

**NITI Aayog**
- National Strategy for AI #AIforAll, June 2018 (five focus sectors: health, agriculture, education, smart cities, mobility; CORE/ICTAI research centres) — [NITI PDF](https://www.niti.gov.in/sites/default/files/2023-03/National-Strategy-for-Artificial-Intelligence.pdf)
- Responsible AI Part 1 – Principles (Feb 2021); Part 2 – Operationalizing Principles (Aug 2021); Responsible AI for All: FRT (Nov 2022) — NITI PDFs: [Part 1](https://www.niti.gov.in/sites/default/files/2021-02/Responsible-AI-22022021.pdf), [Part 2](https://www.niti.gov.in/sites/default/files/2021-08/Part2-Responsible-AI-12082021.pdf), [FRT](https://www.niti.gov.in/sites/default/files/2022-11/Ai_for_All_2022_02112022_0.pdf) (URLs from prior knowledge; not re-fetched this session)
- "AI for Viksit Bharat: the opportunity for accelerated economic growth" launched by FM Sitharaman and Minister Vaishnaw, Sept 2025, Frontier Tech Hub with McKinsey; targets include 5 million trained, AI Open University, tech services $750–850 bn by 2035 — [PIB PRID 2166867](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2166867&reg=48&lang=2); [NITI PDF](https://niti.gov.in/sites/default/files/2025-09/AI-for-Viksit-Bharat-the-opportunity-for-accelerated-economic-growth.pdf)
- "Roadmap for Job Creation in the AI Economy" (Oct 2025; NASSCOM/BCG; proposes National AI Talent Mission; up to 4 million new jobs in 5 years) — [PIB PRID 2177440](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2177440&reg=48&lang=2); [NITI PDF](https://niti.gov.in/sites/default/files/2025-10/Roadmap_for_Job_Creation_in_the_AI_Economy.pdf); [NITI X post 10 Oct 2025](https://x.com/NITIAayog/status/1976647737383772470)
- "Roadmap on AI for Inclusive Societal Development" (Oct 2025 upload) — [NITI PDF](https://www.niti.gov.in/sites/default/files/2025-10/Roadmap_On_AI_for_Inclusive_Societal_Development.pdf)
- "India's Technology Services – Reimagination Ahead" (Feb 2026) — [NITI PDF](https://www.niti.gov.in/sites/default/files/2026-02/Technology-Services-Reimagination-Ahead.pdf)
- NITI Frontier Tech Hub established 2024 — [NITI FTH brochure](https://www.niti.gov.in/sites/default/files/2025-03/NITI_Frontier_Tech-Hub_The_only_way_to_predict_the_future_is_to_create_it.pdf)

**Office of the PSA**
- Chairs the 2023 Advisory Group on AI; Guidelines suggested PSA chair AIGG; PSA is a member (not chair) of the actual AIGEG — [MediaNama Jan 2025](https://www.medianama.com/2025/01/223-analysing-meitys-report-on-development-of-ai-governance-guidelines/); [AIGEG OM](https://d12aarmt01l54a.cloudfront.net/cms/files/constitution-of-aigeg/1776346498.pdf)
- PSA office hosts "India's AI Policy Priorities White Paper Series — Strengthening AI Governance (Techno-Legal)" — [PSA PDF](https://psa.gov.in/CMS/web/sites/default/files/publication/AI-WP_TechnoLegal.pdf) (file >10 MB, could not be read; date/authorship unverified)

**India AI Impact Summit, New Delhi, 16–20 Feb 2026**
- New Delhi Declaration on AI Impact adopted at close (20 Feb 2026); 88 countries and international organisations endorsed per AIR; other reports say 92; seven "chakras" (human capital, access, trustworthiness, energy efficiency, AI in science, democratising resources, economic growth/social good); other outcomes: Charter for Democratic Diffusion of AI, Collaborative Platform, Voluntary Guiding Principles on Resilient, Innovative and Efficient AI — [AIR/newsonair](https://www.newsonair.gov.in/india-ai-impact-summit-2026-adopts-new-delhi-declaration); [PIB PRID 2231208](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2231208); [Outlook Business (88)](https://www.outlookbusiness.com/news/ai-impact-summit-2026-concludes-with-88-nations-organisations-adopting-new-delhi-declaration); [Vision IAS (92)](https://www.visionias.in/blog/current-affairs/india-ai-impact-summit-2026-and-new-delhi-declaration-indias-leap-into-the-global-ai-order)
- Voluntary Guiding Principles for Reskilling in the Age of AI endorsed by 24 countries — [techUK](https://www.techuk.org/resource/key-outcomes-from-the-2026-ai-impact-summit-with-techuk.html)
- Domestic announcements: +20,000 GPUs; 30 IndiaAI Data & AI Labs dedicated (first phase of a 570-lab network; 27 with NIELIT, 3 with Intel at Mokokchung, Mhow, Mohali); ~6 lakh in-person attendees; 118 countries — [StartupFeed](https://startupfeed.in/india-ai-impact-summit-2026-the-complete-highlights/); [PIB PRID 2238195](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2238195&reg=3&lang=1); [PM India](https://www.pmindia.gov.in/en/news_updates/pm-inaugurates-india-ai-impact-summit-2026/)
- Caveat: the "$1.1 bn/₹10,000 crore fund of funds" cited by some summit coverage is the Budget 2025-26 Fund of Funds, not a new summit instrument.

**Union Budgets**
- Budget 2023-24 announced three AI CoEs; MoE announced implementation on 15 Oct 2024: ₹990 crore FY2023-24 to FY2027-28; healthcare (AIIMS + IIT Delhi), agriculture (IIT Ropar), sustainable cities (IIT Kanpur) — [PIB PRID 2064990](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2064990&reg=48&lang=2); [ANI](https://aninews.in/news/business/dharmendra-pradhan-announces-3-centres-of-excellence-in-ai-for-healthcare-agriculture-and-sustainable-cities20241015173837/)
- Budget 2024-25 (23 Jul 2024): ₹551.75 crore allocated to IndiaAI Mission — [IndiaAI](https://indiaai.gov.in/article/union-budget-2024-25-allocates-over-550-crores-to-the-indiaai-mission)
- Budget 2025-26 (1 Feb 2025): ₹500 crore CoE in AI for Education; ₹2,000 crore for IndiaAI — [IndiaAI](https://indiaai.gov.in/news/union-budget-2025-26-centre-allocates-500-crore-for-ai-centre-of-excellence-in-education); [CeRAI](https://cerai.substack.com/p/announcements-on-ai-in-the-2025-26)
- Budget 2026-27 (1 Feb 2026): para 48 lists "AI Mission" among supported technologies; para 51 creates a High-Powered "Education to Employment and Enterprise" Standing Committee whose ToR include assessing AI impact on jobs, embedding AI in school curriculum, upskilling engineers in AI, AI-enabled job matching; para 83 Bharat-VISTAAR multilingual AI agri-advisory tool; para 130 tax holiday till 2047 for foreign companies providing cloud services globally from Indian data centres; para 131 15% safe harbour for related-party data-centre services — [Budget speech (PIB copy)](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc202621775901.pdf)
- ₹1,000 crore IndiaAI allocation for FY27 (down from ₹2,000 crore BE FY26; ~₹800 crore utilised) — [ThePrint](https://theprint.in/economy/budget-2026-allocates-rs-1000-crore-for-indiaai-mission-pushes-data-centres-and-ai-upskilling/2842947/); [Business Today](https://www.businesstoday.in/union-budget/news/story/union-budget-2026-bets-big-on-ai-as-indiaai-mission-gets-rs-1000-crore-push-514018-2026-02-01)
- "₹500 crore for AI CoEs and 80 IndiaAI Labs" is reported by secondary outlets but does not appear in the speech text I extracted; treat as expenditure-document line item, unverified — [AngelOne](https://www.angelone.in/news/economy/union-budget-2026-india-allocates-1-000-crore-to-bolster-ai-via-indiaai-mission)

**Ministry of Education / CBSE**
- CBSE Curriculum on Computational Thinking and AI for Classes III–VIII launched 1 Apr 2026 by Education Minister Pradhan; implementation from 2026-27; expert committee constituted Oct 2025 (IIT Madras-led) — [PIB PRID 2247963](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2247963&reg=48&lang=2); [Business Standard](https://www.business-standard.com/education/news/cbse-launches-ai-computational-thinking-curriculum-classes-3-8-126040101366_1.html)
- CBSE AI skill subject (code 417) at Classes VIII–IX since 2019-20 (prior knowledge; URL not re-verified)

**MoD / MHA / Labour / DST**
- Defence AI Council (chair: Raksha Mantri) and Defence AI Project Agency (head: Secretary, Defence Production) created by executive order dated 8 Feb 2019; AI roadmap for DPSUs — [PIB PRID 1810442](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1810442); [CSDR Feb 2026](https://csdronline.com/wp-content/uploads/2026/02/CSDR_Feb-26_Indias-Approach-to-Military-AI-1.pdf)
- MHA/I4C NCTAU advisory of 11 Jun 2026 on AI deepfakes and synthetic identities defeating face-auth/Video-KYC; asks institutions to add deepfake detection in onboarding; citizens to lock biometrics — [IANS](https://ianslive.in/ai-deepfakes-emerging-as-new-threat-to-financial-systems-warns-centre--20260611134210)
- I4C NCTAU flagged deepfake PM/CM welfare-scheme ads on 19 Oct 2026 — [DecodeCivils summary](https://currentaffairs.decodecivils.com/current-affairs/explainers/indian-cyber-crime-coordination-centre-i4c-and-the-cybercrime-response-chain-0QOXcHcyuwL344AGetYwoOUV/)
- Labour Ministry task force on AI and the future of work announced by Labour Secretary Sumita Dawra, 5 Jul 2024 — [Inc42](https://inc42.com/buzz/labour-ministry-constitutes-taskforce-to-study-impact-of-ai-on-future-of-work/)
- DST National Mission on Interdisciplinary Cyber-Physical Systems (Cabinet Dec 2018, ₹3,660 crore, 25 Technology Innovation Hubs incl. AI hubs such as iHub Drishti at IIT Jodhpur) — prior knowledge; [iHub Drishti](https://ihub-drishti.ai/administration/hub-governing-body)

### Inferences
- The executive's instruments are overwhelmingly soft (guidelines, advisories, spending), with only two April 2026 office memoranda creating durable institutions; this matches the Guidelines' "innovation over restraint" sutra.
- Funding signals are mixed: the IndiaAI budget line was halved for FY27 while compute supply targets rose, consistent with reports of low utilisation.

### Gaps
- Could not retrieve MeitY's own PDF URLs for the Nov/Dec 2023 and Mar 2024 advisories (relied on legal/news sources).
- Could not confirm whether the "80 IndiaAI Labs / ₹500 crore AI CoE" FY27 figures are in the Expenditure Budget.
- NITI "Reimagining Agriculture" frontier-tech report: exact release date not found.
- No formal MoSPI/NSO AI dataset instrument found. No standalone "Standard for AI" MeitY draft found (BIS/TEC work is with another researcher).
- A "MeitY voluntary AI code of conduct" referenced in a Nov 2024 newsletter could not be verified as a distinct instrument.

---

## Key question 2: What changed between the Jan 2025 subcommittee draft and the Nov 2025 final Guidelines?

### Takeaway
The final Guidelines kept the draft's core philosophy (whole-of-government, techno-legal, voluntary-first, incident database) but replaced the draft's eight OECD-style principles with seven "sutras" adapted from RBI's FREE-AI report, named concrete institutions (AIGG under the PSA, TPEC, AISI), added a timed action plan and a graded-liability concept, and stated explicitly that no separate AI law is needed "at this stage" while flagging copyright and IT Act amendments.

### Cited Findings
- Draft (Jan 2025) proposed eight principles (transparency; accountability; safety, reliability and robustness; privacy and security; fairness and non-discrimination; human-centred values and do-no-harm; inclusive and sustainable innovation; digital-by-design governance), an Inter-Ministerial AI Coordination Committee/Governance Group, a Technical Secretariat in MeitY, a national AI incident database, voluntary transparency commitments and a lifecycle/ecosystem view — [MediaNama Jan 2025](https://www.medianama.com/2025/01/223-analysing-meitys-report-on-development-of-ai-governance-guidelines/); [IGP](https://www.internetgovernance.org/2025/02/24/indias-report-on-ai-governance-guidelines-development/); [CIS comments](https://cis-india.org/internet-governance/blog/cis-comments-and-recommendations-to-report-on-ai-governance-guidelines-development)
- Final (Nov 2025): seven sutras "adapted from the RBI's FREE-AI Committee report", six pillars, AIGG (suggested PSA chair) + TPEC + AISI, graded liability, India-specific risk framework, short/medium/long-term action plan — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- Final states "a separate law to regulate AI is not needed" now but lists "draft new laws based on emerging risks" as a long-term item; recommends copyright and IT Act amendments and a "master circular" of applicable regulations — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- Process: draft open for comments to 27 Feb 2025; 2,500+ submissions; new drafting committee constituted July 2025 (chair Prof. B. Ravindran) — [Storyboard18](https://www.storyboard18.com/how-it-works/meity-extends-deadline-for-public-comments-on-report-on-ai-governance-guidelines-development-54566.htm); [Chambers](https://chambers.com/articles/meity-unveils-india-s-approach-towards-regulating-artificial-intelligence); [MediaNama Nov 2025](https://www.medianama.com/2025/11/223-meity-ai-governance-liability-regulation-innovation/)
- Industry critique: final relies on existing law, voluntary compliance and self-certification — [Veritect](https://veritect.ai/digital-data-ai-law/india-ai-governance-framework-2026)

### Inferences
- The shift from a MeitY "Technical Secretariat" (draft) to a PSA-chaired AIGG (final) was itself reversed in practice in April 2026 when MeitY constituted AIGEG under the IT Minister with the MeitY Secretary as convener.

### Gaps
- I could not fetch the Jan 2025 draft PDF this session; the draft's principle list is from contemporaneous analyses rather than the document text.

---

## Key question 3: Operational status of the IndiaAI Safety Institute and the AI Governance Group (Nov 2026)

### Takeaway
AISI exists as a programme inside the IndiaAI Mission (announced 30 Jan 2025, hub-and-spoke, funding Safe & Trusted projects) but was still recruiting its first Director in May–June 2026 and has no public standalone premises, statute or published evaluation outputs; the "AI Governance Group" was constituted on 13 Apr 2026 as the AI Governance and Economic Group (AIGEG) chaired by the IT Minister, with TPEC constituted in April 2026, but no AIGEG decisions or meeting records were found publicly as of 19 Nov 2026.

### Cited Findings
- AISI announced 30 Jan 2025 by Minister Vaishnaw under the Safe & Trusted pillar; "incubated by IndiaAI Mission", hub-and-spoke with academic/private partners; first EoI selected 8 projects; second EoI launched same day — [IndiaAI, 31 Jan 2025 (PSA mirror)](https://psa.gov.in/CMS/web/sites/default/files/publication/India%20Takes%20the%20Lead%20Establishing%20the%20IndiaAI%20Safety%20Institute%20for%20Responsible%20AI%20Innovation.pdf)
- Guidelines (Nov 2025) call AISI "recently established" and assign it: testing/evaluation, draft guidelines/standards/evaluation metrics, forecasting research, representing India in the International Network of AI Safety Institutes, supporting TPEC/AIGG; "should be supported by a dedicated secretariat" — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- PM Modi described AISI as "a dedicated body to ensure the ethical, safe, and responsible deployment" of AI (ANI interview, 17 Feb 2026) — [The News Mill](https://thenewsmill.com/2026/02/indiaai-safety-institute-established-for-ethical-and-safe-ai-deployment/)
- Digital India Corporation advertised the post of Director, IndiaAI Safety Institute on 19 May 2026 (deadline 2 Jun 2026), reporting to IndiaAI COO; contract basis; 20 years' experience — [MediaNama Jul 2026](https://www.medianama.com/2026/07/223-meity-india-ai-safety-institute-director-hiring/); [IndiaAI on X](https://x.com/OfficialINDIAai/status/2061410038212853946)
- 13 Safe & Trusted projects approved by 27 Jul 2026, described as overseen by AISI — [DD News](https://ddnews.gov.in/en/indiaai-missions-safe-trusted-ai-pillar-advances-responsible-ai-13-projects-approved-to-tackle-deepfakes-and-bias/)
- AIGEG: MeitY OM No. ET/9/2023-ET-(Part I) dated 13-04-2026; Chair: Minister E&IT; Vice-Chair: MoS E&IT; members: PSA, CEA, CEO NITI Aayog, Secretaries DoT, DEA, DST, NSCS representative; Secretary MeitY as Member-Convener; ToR include coordinating policy across ministries/regulators, issuing guidelines on firm accountability, developing a 10-year AI deployment roadmap incl. job-profile impact, classifying AI use cases into "deploy/pilot/defer", assessing labour-market impacts — [AIGEG OM (PDF)](https://d12aarmt01l54a.cloudfront.net/cms/files/constitution-of-aigeg/1776346498.pdf); [MediaNama Apr 2026](https://www.medianama.com/2026/04/223-aigeg-meitys-ai-governance-body-excludes-regulators-recommended-ai-guidelines/)
- Regulators the Guidelines had suggested (TRAI, CCI, DPB, RBI, SEBI, ICMR, UGC) are not AIGEG members — [MediaNama Apr 2026](https://www.medianama.com/2026/04/223-aigeg-meitys-ai-governance-body-excludes-regulators-recommended-ai-guidelines/)
- TPEC constituted April 2026 (press 18 Apr 2026) as standing advisory body to AIGEG; chaired by Secretary MeitY; members include B. Ravindran, Rajat Moona, and representatives of NASSCOM, DSCI, MAIT; functions: brief AIGEG, identify risks and regulatory gaps, track global developments — [NeGD press release](https://negd.gov.in/press_release/government-constitutes-technology-and-policy-expert-committee-tpec-to-provide-expert-advisory-support-to-indias-ai-governance-architecture/); [ETV Bharat 18 Apr 2026](https://www.etvbharat.com/en/technology/govt-sets-up-committee-for-expert-advisory-support-to-indias-ai-governance-architecture-enn26041805883)
- Critique that AISI could be operationalised budget-neutrally via compute-for-evaluation (implying it is not yet fully operational) — [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7697620)

### Inferences
- AISI is best described as "announced / partially operational": it funds projects and is referenced in official documents, but leadership recruitment in mid-2026 and absence of published evaluations suggest it is not yet a functioning testing body.
- AIGEG's ToR go beyond the Guidelines' AIGG (labour-market and deployment-roadmap functions), reflecting the "Economic" addition to its name.

### Gaps
- No public confirmation of who (if anyone) was appointed AISI Director after June 2026.
- No AIGEG meeting minutes, decisions, or outputs found; no TPEC order text located (NeGD page shows a 12 May 2026 date while press reports date the constitution to 18 Apr 2026).

---

## Key question 4: Latest MeitY position on an AI-specific law vs. techno-legal approach (Nov 2026)

### Takeaway
MeitY has moved from "no separate AI law is needed at this stage" (Guidelines, Nov 2025; Secretary Krishnan, Dec 2025) to the Minister saying a new law is required (June 2026), the Secretary announcing stakeholder discussions and a drafting process (9 Jul 2026), and the Minister promising a "regulation-focused consultation paper" within a month (8 Oct 2026) and "in the coming weeks" (26 Oct 2026) — all framed as a techno-legal solution with industry carrying most compliance; as of 19 Nov 2026 I found no evidence the paper has been published.

### Cited Findings
- Guidelines text: "at this stage, a separate law to regulate AI is not needed"; techno-legal measures to "buttress existing policy choices, regulatory instruments, and voluntary measures" — [Guidelines PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf)
- Dec 2025: Secretary S. Krishnan said government is "not planning a new dedicated AI law" — [MediaNama Jun 2026](https://www.medianama.com/2026/06/223-vaishnaw-new-ai-law-contradicting-meitys-position-2023-parliamentary-reply/)
- June 2026 (PTI interview): Vaishnaw — "there is a requirement for a new law because the world of AI is very different from the world when the IT Act was enacted in 2000"; contradicts his 2023 parliamentary reply that government was "not considering bringing a law" — [MediaNama Jun 2026](https://www.medianama.com/2026/06/223-vaishnaw-new-ai-law-contradicting-meitys-position-2023-parliamentary-reply/)
- 9 Jul 2026: Krishnan — "we will start a process of drafting" after discussing with stakeholder groups; 762 ministerial suggestions on AI applications received — [MediaNama Jul 2026](https://www.medianama.com/2026/07/223-meity-start-stakeholder-discussions-separate-law-ai-regulation-s-krishnan/)
- 8 Oct 2026 (World Development Report 2026 launch): consultation paper within a month; pillars safety, human-first, scaling, inclusivity, societal harms (deepfakes, psychological harms); "AI and technologies cannot be regulated just by having a law. We have to bring a techno-legal solution"; "bulk of this regulation will have to be taken by the industry itself"; paper is "probably (the) base for the regulation which has to come" — [MediaNama 8 Oct 2026](https://www.medianama.com/2026/10/223-meity-consultation-paper-ai-regulation/); [ThePrint](https://theprint.in/india/governance/india-steps-up-ai-regulation-push-with-consultation-paper-likely-next-month-deepfakes-safety-in-focus/3065386/); [Business Standard](https://www.business-standard.com/amp/technology/artificial-intelligence/govt-to-release-draft-ai-regulation-paper-within-30-days-ashwini-vaishnaw-126100801183_1.html)
- 26 Oct 2026 (NDTV World Summit): paper "in the coming weeks"; "the risks of AI have crossed a threshold"; human control over models; feedback from banking, manufacturing, finance, insurance — [MediaNama 26 Oct 2026](https://www.medianama.com/2026/10/223-india-ai-regulation-consultation-paper-vaishnaw/)
- Reports that the paper is being drafted sector-by-sector (banking, securities) urging regulator action — [NewsBytes](https://www.newsbytesapp.com/news/science/meity-drafting-sector-specific-ai-consultation-paper-urging-regulator-action/tldr)
- Official AIR framing: "AI regulation must follow techno-legal approach, not just standalone laws" — [newsonair](https://www.newsonair.gov.in/union-minister-vaishnaw-says-ai-regulation-must-follow-techno-legal-approach-not-just-standalone-laws)
- MediaNama's AI tag listing for November 2026 shows no article on a released consultation paper (latest MeitY item 13 Nov 2026 concerns robot-training footage) — [MediaNama tag page](https://www.medianama.com/tag/artificial-intelligence/)
- The DEPA for AI Training handbook (31 Oct 2026) is the most recent concrete techno-legal instrument MeitY has published — [PIB PRID 2330756](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2330756&reg=48&lang=2)

### Inferences
- The operative position on 19 Nov 2026 is: a new AI law is now considered necessary in principle, but the instrument on the table is a consultation paper (not a bill), to be built on techno-legal tools and industry self-regulation, with sectoral regulators doing sector-specific work.

### Gaps
- Whether the consultation paper was published between 1 and 19 Nov 2026 could not be confirmed (MeitY site returned 403; news listings show nothing). Treat status as "announced, overdue".
- No draft bill text, title or Cabinet note exists publicly.

---

## Items noted but not catalogued (owned by other researchers or not instruments)
- IT Rules synthetic-media labelling amendments (draft 22 Oct 2025, comments to 13 Nov 2025; notified Feb 2026; further draft 30 Mar 2026, comments to 7 May 2026) — IT Rules researcher.
- India Semiconductor Mission 2.0 (Cabinet, 15 Jul 2026, ₹1.25 lakh crore) — compute-adjacent, not AI policy.
- MeitY's Nov 2026 queries to Pronto and other platforms about home footage used for robot training — enforcement action, not an instrument.
- PIB backgrounder "Data Centres in India" (14 Sep 2026) — explainer, not policy.
