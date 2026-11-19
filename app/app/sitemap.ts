import type { MetadataRoute } from "next";
import { POLICIES, JURISDICTIONS, DATASET_UPDATED } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://india-ai-policy-atlas.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(DATASET_UPDATED || Date.now());
  return [
    ...["", "/explore", "/timeline", "/matrix", "/compare", "/signals", "/method"].map((p) => ({ url: `${BASE}${p}`, lastModified })),
    ...JURISDICTIONS.map((j) => ({ url: `${BASE}/jurisdiction/${j.code}`, lastModified })),
    ...POLICIES.map((p) => ({ url: `${BASE}/policy/${p.id}`, lastModified: new Date(p.last_verified) })),
  ];
}
