import { cacheLife } from "next/cache";

export interface Signal {
  source: string;
  sourceUrl: string;
  title: string;
  link: string;
  date: string | null;
  snippet?: string;
}

/** Official feeds polled on each visit (cached for an hour on the server). */
export const FEEDS: { name: string; url: string; home: string }[] = [
  { name: "PIB · Press Information Bureau", url: "https://www.pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3", home: "https://pib.gov.in" },
  { name: "RBI · Press releases", url: "https://www.rbi.org.in/pressreleases_rss.xml", home: "https://rbi.org.in" },
  { name: "RBI · Notifications", url: "https://www.rbi.org.in/notifications_rss.xml", home: "https://rbi.org.in" },
  { name: "SEBI", url: "https://www.sebi.gov.in/sebirss.xml", home: "https://sebi.gov.in" },
  { name: "TRAI", url: "https://www.trai.gov.in/rss.xml", home: "https://trai.gov.in" },
];

export const AI_PATTERN =
  /\b(AI|A\.I\.|artificial intelligence|machine learning|deep ?fake|deepfakes?|synthetic(ally)? generated|generative|LLM|large language|foundation model|algorithm(ic)?|IndiaAI|GPU|compute|data protection|DPDP|facial recognition|automated decision|neural|chatbot|कृत्रिम बुद्धिमत्ता|एआई|डीपफेक)\b/i;

function strip(s: string) {
  return s
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(xml: string, tag: string) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? strip(m[1]) : "";
}

export function parseRss(xml: string): Omit<Signal, "source" | "sourceUrl">[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items.map((it) => {
    const title = pick(it, "title");
    const link = pick(it, "link") || (it.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? "");
    const pub = pick(it, "pubDate") || pick(it, "dc:date") || pick(it, "published");
    const d = pub ? new Date(pub) : null;
    const desc = pick(it, "description").slice(0, 240);
    return { title, link, date: d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : null, snippet: desc };
  });
}

export async function fetchSignals(): Promise<{ signals: Signal[]; errors: string[]; fetchedAt: string }> {
  "use cache";
  cacheLife("hours");
  const errors: string[] = [];
  const out: Signal[] = [];
  await Promise.all(
    FEEDS.map(async (f) => {
      try {
        const res = await fetch(f.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; IndiaAIPolicyAtlas/1.0; +https://github.com/dt-safl/india-ai-policy-atlas)" },
          signal: AbortSignal.timeout(12000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        for (const it of parseRss(xml)) {
          if (!it.title) continue;
          if (!AI_PATTERN.test(`${it.title} ${it.snippet ?? ""}`)) continue;
          out.push({ ...it, source: f.name, sourceUrl: f.home });
        }
      } catch (e) {
        errors.push(`${f.name}: ${(e as Error).message}`);
      }
    }),
  );
  out.sort((a, b) => (a.date && b.date ? (a.date < b.date ? 1 : -1) : a.date ? -1 : 1));
  return { signals: out, errors, fetchedAt: new Date().toISOString() };
}
