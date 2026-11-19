import { NextResponse } from "next/server";
import { POLICIES, policyById } from "@/lib/data";

export function generateStaticParams() {
  return POLICIES.map((p) => ({ id: p.id }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const p = policyById(id);
  if (!p) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(p, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400", "Access-Control-Allow-Origin": "*" },
  });
}
