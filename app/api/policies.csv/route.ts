import { type NextRequest } from "next/server";
import { POLICIES } from "@/lib/data";
import { familyOf } from "@/lib/taxonomy";

function esc(v: unknown) {
  const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const j = url.searchParams.get("j");
  const ids = url.searchParams.get("ids");
  let items = POLICIES;
  if (j) items = items.filter((p) => p.jurisdiction === j);
  if (ids) {
    const set = new Set(ids.split(","));
    items = items.filter((p) => set.has(p.id));
  }
  const cols = [
    "id", "title", "jurisdiction", "jurisdiction_name", "issuing_body", "instrument_type", "family", "status", "binding",
    "date", "date_precision", "summary", "key_provisions", "themes", "sectors", "source_url", "source_type",
    "secondary_sources", "confidence", "confidence_note", "related", "last_verified",
  ];
  const lines = [cols.join(",")];
  for (const p of items) {
    const row = { ...p, family: familyOf(p.instrument_type) } as Record<string, unknown>;
    lines.push(cols.map((c) => esc(row[c])).join(","));
  }
  return new Response("﻿" + lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="india-ai-policy-atlas${j ? `-${j}` : ""}.csv"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
