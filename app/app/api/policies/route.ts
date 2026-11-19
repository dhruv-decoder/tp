import { NextResponse, type NextRequest } from "next/server";
import { POLICIES, DATASET_VERSION, DATASET_UPDATED } from "@/lib/data";

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
  return NextResponse.json(
    {
      name: "India AI Policy Atlas",
      version: DATASET_VERSION,
      updated: DATASET_UPDATED,
      licence: "CC BY 4.0",
      count: items.length,
      items,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
