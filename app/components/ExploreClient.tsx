"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Jurisdiction } from "@/lib/types";
import type { PolicyLite } from "@/lib/data";
import { formatDate } from "@/lib/data";
import {
  FAMILIES,
  FAMILY_SHORT,
  INSTRUMENT_LABEL,
  STATUS_GROUP_LABEL,
  statusGroup,
  labelTheme,
  labelSector,
  CONFIDENCE_LABEL,
  type Family,
  type StatusGroup,
} from "@/lib/taxonomy";
import { StatusPill, FamilyDot, ConfidenceMark } from "./ui";

interface Props {
  policies: PolicyLite[];
  jurisdictions: Jurisdiction[];
  themes: string[];
  sectors: string[];
}

type SortKey = "date" | "title" | "jurisdiction" | "status";

export function ExploreClient({ policies, jurisdictions, themes, sectors }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const level = sp.get("level") ?? "all"; // all | union | state
  const jur = sp.get("j") ?? "";
  const fam = (sp.get("family") ?? "") as Family | "";
  const status = (sp.get("status") ?? "") as StatusGroup | "";
  const theme = sp.get("theme") ?? "";
  const sector = sp.get("sector") ?? "";
  const conf = sp.get("confidence") ?? "";
  const binding = sp.get("binding") ?? "";
  const from = Number(sp.get("from") ?? 0) || 0;
  const to = Number(sp.get("to") ?? 0) || 0;
  const sort = (sp.get("sort") ?? "date") as SortKey;
  const dir = sp.get("dir") === "asc" ? "asc" : "desc";

  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "" || v === "all") next.delete(k);
        else next.set(k, v);
      }
      const s = next.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [sp, router, pathname],
  );

  const [qLocal, setQLocal] = useState(q);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = policies.filter((p) => {
      if (level === "union" && p.jurisdiction !== "IN") return false;
      if (level === "state" && p.jurisdiction === "IN") return false;
      if (jur && p.jurisdiction !== jur) return false;
      if (fam && p.family !== fam) return false;
      if (status && statusGroup(p.status) !== status) return false;
      if (theme && !p.themes.includes(theme)) return false;
      if (sector && !p.sectors.includes(sector)) return false;
      if (conf && p.confidence !== conf) return false;
      if (binding && p.binding !== binding) return false;
      const y = Number(p.date.slice(0, 4));
      if (from && y < from) return false;
      if (to && y > to) return false;
      if (needle) {
        const hay = `${p.title} ${p.issuing_body} ${p.jurisdiction_name} ${p.summary} ${p.themes.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    const m = dir === "asc" ? 1 : -1;
    out = out.slice().sort((a, b) => {
      switch (sort) {
        case "title":
          return m * a.title.localeCompare(b.title);
        case "jurisdiction":
          return m * a.jurisdiction_name.localeCompare(b.jurisdiction_name) || (a.date < b.date ? 1 : -1);
        case "status":
          return m * statusGroup(a.status).localeCompare(statusGroup(b.status)) || (a.date < b.date ? 1 : -1);
        default:
          return m * (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
      }
    });
    return out;
  }, [policies, q, level, jur, fam, status, theme, sector, conf, binding, from, to, sort, dir]);

  const activeFilters = [level !== "all", jur, fam, status, theme, sector, conf, binding, from, to, q].filter(Boolean).length;

  function th(label: string, key: SortKey, extra = "") {
    const on = sort === key;
    return (
      <th className={extra}>
        <button
          type="button"
          onClick={() => set({ sort: key, dir: on && dir === "desc" ? "asc" : "desc" })}
          className={`inline-flex items-center gap-1 ${on ? "text-ink" : ""}`}
        >
          {label}
          <span className="font-mono text-[10px]">{on ? (dir === "asc" ? "↑" : "↓") : ""}</span>
        </button>
      </th>
    );
  }

  const exportHref = `/api/policies.csv${rows.length !== policies.length ? `?ids=${rows.map((r) => r.id).join(",")}` : ""}`;

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
      {/* filter bar */}
      <div className="flex flex-col gap-3 border-b border-line pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <form
            className="relative min-w-[220px] flex-1 sm:max-w-[360px]"
            onSubmit={(e) => {
              e.preventDefault();
              set({ q: qLocal });
            }}
          >
            <input
              id="explore-q"
              type="search"
              value={qLocal}
              onChange={(e) => {
                setQLocal(e.target.value);
                if (e.target.value === "") set({ q: null });
              }}
              placeholder="Search title, body, summary"
              className="h-9 w-full rounded-[6px] border border-line bg-elev pl-3 pr-16 text-[13.5px] text-ink placeholder:text-ink-3"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 h-7 rounded-[4px] bg-sunken px-2 text-[12px] text-ink-2 hover:text-ink"
            >
              Search
            </button>
          </form>

          <Seg
            value={level}
            onChange={(v) => set({ level: v, j: null })}
            options={[
              ["all", "All"],
              ["union", "Union"],
              ["state", "States & UTs"],
            ]}
          />

          <Select
            id="f-j"
            value={jur}
            onChange={(v) => set({ j: v })}
            label="Jurisdiction"
            options={jurisdictions.filter((j) => level !== "union" || j.code === "IN").map((j) => [j.code, j.name])}
          />
          <Select
            id="f-family"
            value={fam}
            onChange={(v) => set({ family: v })}
            label="Family"
            options={FAMILIES.map((f) => [f, FAMILY_SHORT[f]])}
          />
          <Select
            id="f-status"
            value={status}
            onChange={(v) => set({ status: v })}
            label="Status"
            options={(Object.keys(STATUS_GROUP_LABEL) as StatusGroup[]).map((s) => [s, STATUS_GROUP_LABEL[s]])}
          />
          <Select
            id="f-theme"
            value={theme}
            onChange={(v) => set({ theme: v })}
            label="Theme"
            options={themes.map((t) => [t, labelTheme(t)])}
          />
          <Select
            id="f-sector"
            value={sector}
            onChange={(v) => set({ sector: v })}
            label="Sector"
            options={sectors.map((s) => [s, labelSector(s)])}
          />
          <Select
            id="f-binding"
            value={binding}
            onChange={(v) => set({ binding: v })}
            label="Binding"
            options={[
              ["binding", "Binding"],
              ["non-binding", "Non-binding"],
              ["mixed", "Mixed"],
            ]}
          />
          <Select
            id="f-conf"
            value={conf}
            onChange={(v) => set({ confidence: v })}
            label="Confidence"
            options={(["high", "medium", "low"] as const).map((c) => [c, CONFIDENCE_LABEL[c]])}
          />
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={() => {
                setQLocal("");
                router.replace(pathname, { scroll: false });
              }}
              className="text-[12.5px] text-accent hover:underline"
            >
              Clear {activeFilters}
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-ink-2">
          <div className="tnum">
            <span className="font-medium text-ink">{rows.length}</span> of {policies.length} instruments
          </div>
          <div className="flex items-center gap-3">
            <a href={exportHref} className="text-accent hover:underline">
              Download CSV
            </a>
            <Link href="/api/policies" className="text-accent hover:underline">
              JSON
            </Link>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {th("Date", "date", "w-[110px]")}
              {th("Instrument", "title")}
              {th("Jurisdiction", "jurisdiction", "w-[150px]")}
              <th className="w-[130px]">Type</th>
              {th("Status", "status", "w-[130px]")}
              <th className="w-[200px]">Themes</th>
              <th className="w-[70px]">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-[12.5px] tnum text-ink-2 whitespace-nowrap">
                  {formatDate(p.date, p.date_precision)}
                </td>
                <td>
                  <Link href={`/policy/${p.id}`} className="block font-medium text-ink hover:text-accent">
                    {p.title}
                  </Link>
                  <div className="mt-0.5 text-[12px] text-ink-3">{p.issuing_body}</div>
                </td>
                <td className="text-ink-2">
                  <Link href={`/jurisdiction/${p.jurisdiction}`} className="hover:text-ink">
                    {p.jurisdiction_name}
                  </Link>
                </td>
                <td>
                  <span className="inline-flex items-center gap-1.5 text-ink-2">
                    <FamilyDot family={p.family} />
                    {INSTRUMENT_LABEL[p.instrument_type]}
                  </span>
                </td>
                <td>
                  <StatusPill status={p.status} />
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {p.themes.slice(0, 3).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set({ theme: t })}
                        className="rounded-[3px] bg-sunken px-1.5 py-0.5 text-[11.5px] text-ink-2 hover:text-ink"
                      >
                        {labelTheme(t)}
                      </button>
                    ))}
                    {p.themes.length > 3 && <span className="text-[11.5px] text-ink-3">+{p.themes.length - 3}</span>}
                  </div>
                </td>
                <td>
                  <ConfidenceMark level={p.confidence} withLabel={false} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-ink-3">
                  Nothing matches. Clear a filter or broaden the search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Seg({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex h-9 overflow-hidden rounded-[6px] border border-line text-[12.5px]">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={`px-3 ${value === v ? "bg-ink text-bg" : "text-ink-2 hover:bg-sunken"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  label,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: [string, string][];
}) {
  return (
    <label className="relative inline-flex h-9 items-center" htmlFor={id}>
      <span className="sr-only">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 appearance-none rounded-[6px] border bg-elev pl-3 pr-7 text-[12.5px] ${
          value ? "border-ink text-ink" : "border-line text-ink-2"
        }`}
      >
        <option value="">{label}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 text-ink-3"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path d="M2 3.5 5 6.5l3-3" />
      </svg>
    </label>
  );
}
