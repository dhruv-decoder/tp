import { ImageResponse } from "next/og";
import { POLICIES, JURISDICTIONS } from "@/lib/data";
import { STATE_SHAPES, MAP_W, MAP_H } from "@/lib/geo";

export const alt = "India AI Policy Atlas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const counts: Record<string, number> = {};
  for (const p of POLICIES) counts[p.jurisdiction] = (counts[p.jurisdiction] ?? 0) + 1;
  const max = Math.max(1, ...Object.entries(counts).filter(([c]) => c !== "IN").map(([, n]) => n));
  const ramp = ["#e3e6ec", "#dfe3f8", "#b9c2f0", "#8e9ce5", "#5f72d9", "#3449c9", "#22308f"];
  const union = counts["IN"] ?? 0;
  const states = JURISDICTIONS.filter((j) => j.code !== "IN" && counts[j.code]).length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f4f5f8",
          color: "#151922",
          fontFamily: "Georgia, serif",
          padding: 56,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, color: "#7a8191", letterSpacing: 2, fontFamily: "monospace" }}>INDIA AI POLICY ATLAS</div>
            <div style={{ display: "flex", fontSize: 56, lineHeight: 1.1, marginTop: 18, maxWidth: 620 }}>AI policy across Indian states</div>
          </div>
          <div style={{ display: "flex", gap: 48 }}>
            {[
              [POLICIES.length, "policies"],
              [union, "Union"],
              [`${states}/36`, "states & UTs"],
            ].map(([v, l]) => (
              <div key={String(l)} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 44 }}>{v}</div>
                <div style={{ display: "flex", fontSize: 18, color: "#4a5160", fontFamily: "sans-serif" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={460} height={518}>
          {STATE_SHAPES.map((s) => {
            const n = counts[s.code] ?? 0;
            const lvl = n ? Math.max(1, Math.min(6, Math.ceil((Math.log(n + 1) / Math.log(max + 1)) * 6))) : 0;
            return <path key={s.code} d={s.d} fill={ramp[lvl]} stroke="#f4f5f8" strokeWidth={0.8} />;
          })}
        </svg>
      </div>
    ),
    size,
  );
}
