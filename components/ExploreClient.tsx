"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { Jurisdiction } from "@/lib/types";
import type { PolicyLite } from "@/lib/data";
import { formatDate } from "@/lib/data";
import {
  FAMILIES,
  FAMILY_LABEL,
  INSTRUMENT_LABEL,
  STATUS_GROUP_LABEL,
  statusGroup,
  labelTheme,
  labelSector,
  CONFIDENCE_LABEL,
  type Family,
  type StatusGroup,
} from "@/lib/taxonomy";
import { StatusPill, ConfidenceMark } from "./ui";

interface Props {
  policies: PolicyLite[];
  jurisdictions: Jurisdiction[];
  themes: string[];
  sectors: string[];
}

type SortKey = "new" | "old" | "state";
const PAGE = 30;

export function ExploreClient({ policies, jurisdictions, themes, sectors }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const jur = sp.get("j") ?? "";
  const fam = (sp.get("family") ?? "") as Family | "";
  const status = (sp.get("status") ?? "") as StatusGroup | "";
  const theme = sp.get("theme") ?? "";
  const sector = sp.get("sector") ?? "";
  const conf = sp.get("confidence") ?? "";
  const binding = sp.get("binding") ?? "";
  const sort = (sp.get("sort") ?? "new") as SortKey;

  const [qLocal, setQLocal] = useState(q);
  const [more, setMore] = useState(Boolean(theme || sector || conf || binding));
  const [shown, setShown] = useState(PAGE);

  const set = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      const s = next.toString();
      setShown(PAGE);
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [sp, router, pathname],
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = policies.filter((p) => {
      if (jur && p.jurisdiction !== jur) return false;
      if (fam && p.family !== fam) return false;
      if (status && statusGroup(p.status) !== status) return false;
      if (theme && !p.themes.includes(theme)) return false;
      if (sector && !p.sectors.includes(sector)) return false;
      if (conf && p.confidence !== conf) return false;
      if (binding && p.binding !== binding) return false;
      if (needle) {
        const hay = `${p.title} ${p.issuing_body} ${p.jurisdiction_name} ${p.summary}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    return out.sort((a, b) => {
      if (sort === "state") return a.jurisdiction_name.localeCompare(b.jurisdiction_name) || (a.date < b.date ? 1 : -1);
      const d = a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      return sort === "old" ? d : -d;
    });
  }, [policies, q, jur, fam, status, theme, sector, conf, binding, sort]);

  const activeFilters = [jur, fam, status, theme, sector, conf, binding, q].filter(Boolean).length;
  const visible = rows.slice(0, shown);
  const groupOf = (p: PolicyLite) => (sort === "state" ? p.jurisdiction_name : p.date.slice(0, 4));
  const exportHref = `/api/policies.csv${rows.length !== policies.length ? `?ids=${rows.map((r) => r.id).join(",")}` : ""}`;

  return (
    <div className="mx-auto max-w-[920px] px-4 sm:px-6">
      {/* search */}
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          set({ q: qLocal });
        }}
      >
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden
        >
          <circle cx="7" cy="7" r="5" />
          <path d="m11 11 3.5 3.5" />
        </svg>
        <input
          type="search"
          value={qLocal}
          onChange={(e) => {
            setQLocal(e.target.value);
            if (e.target.value === "") set({ q: null });
          }}
          placeholder="Search policies, e.g. deepfake, Karnataka, data centre"
          aria-label="Search policies"
          className="h-11 w-full rounded-[10px] border border-line bg-elev pl-10 pr-24 text-[15px] text-ink placeholder:text-ink-3"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 h-8 rounded-[7px] bg-ink px-3 text-[13px] text-bg hover:opacity-90"
        >
          Search
        </button>
      </form>

      {/* filters */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Select
          value={jur}
          onChange={(v) => set({ j: v })}
          label="All states"
          options={jurisdictions.map((j) => [j.code, j.code === "IN" ? "Union (national)" : j.name])}
        />
        <Select
          value={fam}
          onChange={(v) => set({ family: v })}
          label="All types"
          options={FAMILIES.map((f) => [f, FAMILY_LABEL[f]])}
        />
        <Select
          value={status}
          onChange={(v) => set({ status: v })}
          label="Any status"
          options={(Object.keys(STATUS_GROUP_LABEL) as StatusGroup[]).map((s) => [s, STATUS_GROUP_LABEL[s]])}
        />
        <button
          type="button"
          onClick={() => setMore((m) => !m)}
          aria-expanded={more}
          className="h-9 rounded-[8px] px-2 text-[13px] text-ink-2 hover:text-ink"
        >
          {more ? "Fewer filters" : "More filters"}
        </button>
        {activeFilters > 0 && (
          <button
            type="button"
            onClick={() => {
              setQLocal("");
              setShown(PAGE);
              router.replace(pathname, { scroll: false });
            }}
            className="h-9 px-2 text-[13px] text-accent hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      {more && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Select value={theme} onChange={(v) => set({ theme: v })} label="Any theme" options={themes.map((t) => [t, labelTheme(t)])} />
          <Select value={sector} onChange={(v) => set({ sector: v })} label="Any sector" options={sectors.map((s) => [s, labelSector(s)])} />
          <Select
            value={binding}
            onChange={(v) => set({ binding: v })}
            label="Binding or not"
            options={[
              ["binding", "Binding"],
              ["non-binding", "Non-binding"],
              ["mixed", "Partly binding"],
            ]}
          />
          <Select
            value={conf}
            onChange={(v) => set({ confidence: v })}
            label="Any confidence"
            options={(["high", "medium", "low"] as const).map((c) => [c, CONFIDENCE_LABEL[c]])}
          />
        </div>
      )}

      {/* result bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-line-strong pb-3">
        <div className="text-[14px] text-ink-2 tnum">
          <span className="font-medium text-ink">{rows.length}</span> {rows.length === 1 ? "policy" : "policies"}
        </div>
        <div className="flex items-center gap-4 text-[13px]">
          <label className="flex items-center gap-2 text-ink-2">
            Sort
            <select
              value={sort}
              onChange={(e) => set({ sort: e.target.value === "new" ? null : e.target.value })}
              className="h-8 rounded-[7px] border border-line bg-elev px-2 text-[13px] text-ink"
            >
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="state">By state</option>
            </select>
          </label>
          <a href={exportHref} className="text-accent hover:underline">
            Download CSV
          </a>
        </div>
      </div>

      {/* list */}
      {rows.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-ink-2">No policies match. Try fewer filters.</p>
      ) : (
        <ol>
          {visible.map((p, i) => {
            const g = groupOf(p);
            const newGroup = i === 0 || groupOf(visible[i - 1]) !== g;
            return (
              <li key={p.id}>
                {newGroup && (
                  <h2 className="sticky top-14 z-[1] -mx-1 bg-bg/95 px-1 pb-2 pt-6 font-serif text-[20px] text-ink backdrop-blur">
                    {g}
                  </h2>
                )}
                <Link
                  href={`/policy/${p.id}`}
                  className={`group fam-${p.family} relative block rounded-[10px] border border-transparent px-4 py-4 no-underline hover:border-line hover:bg-elev`}
                >
                  <span className="absolute left-0 top-5 h-5 w-[3px] rounded-r-[3px]" style={{ background: "var(--fam)" }} aria-hidden />
                  <div className="text-[13px] text-ink-2">
                    {p.jurisdiction === "IN" ? "Union" : p.jurisdiction_name}
                    <span className="mx-1.5 text-ink-3">·</span>
                    {INSTRUMENT_LABEL[p.instrument_type]}
                    <span className="mx-1.5 text-ink-3">·</span>
                    <span className="font-mono text-[12.5px] tnum">{formatDate(p.date, p.date_precision)}</span>
                  </div>
                  <div className="mt-1 text-[16.5px] font-medium leading-snug text-ink group-hover:text-accent">{p.title}</div>
                  <p className="mt-1.5 line-clamp-2 max-w-[72ch] text-[14.5px] leading-relaxed text-ink-2">{p.summary}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <StatusPill status={p.status} />
                    <ConfidenceMark level={p.confidence} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
      {shown < rows.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShown((s) => s + PAGE)}
            className="h-10 rounded-[8px] border border-line bg-elev px-5 text-[14px] text-ink hover:bg-sunken"
          >
            Show more ({rows.length - shown} left)
          </button>
        </div>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: [string, string][];
}) {
  return (
    <label className="relative inline-flex h-9 items-center">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-9 appearance-none rounded-[8px] border bg-elev pl-3 pr-8 text-[13.5px] ${
          value ? "border-ink font-medium text-ink" : "border-line text-ink-2"
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
        className="pointer-events-none absolute right-2.5 text-ink-3"
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
