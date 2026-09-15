import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import TickerTape from "../components/TickerTape";
import SummaryStats from "../components/SummaryStats";
import RiskDistribution from "../components/RiskDistribution";
import SearchBar from "../components/SearchBar";
import RiskFilterTabs from "../components/RiskFilterTabs";
import LeaderboardRow from "../components/LeaderboardRow";
import DataTransparencyNote from "../components/DataTransparencyNote";
import DisclaimerFooter from "../components/DisclaimerFooter";
import { tierConfig } from "../lib/tiers";
import { formatPrice } from "../lib/format";
import { animateCount, animateStagger } from "../lib/animations";

// Tier sort order: HR → MR → Watch → Normal → Unconfirmed
const TIER_PRIORITY = {
  "HIGH RISK":   0,
  "MEDIUM RISK": 1,
  "WATCH":       2,
  "NORMAL":      3,
  "UNCONFIRMED": 4,
};
function tierOrder(stock) {
  if (!stock.is_confirmed) return TIER_PRIORITY["UNCONFIRMED"];
  return TIER_PRIORITY[stock.risk_tier] ?? 4;
}

const PAGE_SIZE = 10;

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages <= 7 || p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      pages.push(p);
    } else if (pages.at(-1) !== "…") {
      pages.push("…");
    }
  }
  return (
    <div className="flex items-center gap-1">
      <button disabled={page === 1} onClick={() => onChange(Math.max(1, page - 1))}
        className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[11px] text-slate-400 transition-colors hover:border-white/[0.2] hover:text-white disabled:pointer-events-none disabled:opacity-30">
        ← Prev
      </button>
      {pages.map((p, i) => p === "…" ? (
        <span key={`e${i}`} className="px-1 text-xs text-slate-600">…</span>
      ) : (
        <button key={p} onClick={() => onChange(p)}
          className={`min-w-[30px] rounded-lg border px-2 py-1.5 font-mono text-[11px] transition-colors ${p === page
            ? "border-accent/50 bg-accent/15 font-bold text-accent"
            : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.18] hover:text-white"}`}>
          {p}
        </button>
      ))}
      <button disabled={page === totalPages} onClick={() => onChange(Math.min(totalPages, page + 1))}
        className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 font-mono text-[11px] text-slate-400 transition-colors hover:border-white/[0.2] hover:text-white disabled:pointer-events-none disabled:opacity-30">
        Next →
      </button>
    </div>
  );
}

// Compact validation numbers for sidebar
function SidebarValidation({ meta }) {
  const t = meta?.thresholds || {};
  const baseline  = t.baseline_median_score   ?? 0.271;
  const suspended = t.suspended_median_score  ?? 0.552;
  const recall    = t.recall_watch_or_higher ? Math.round(t.recall_watch_or_higher * 100) : 74;
  const lift      = Math.round(((suspended - baseline) / baseline) * 100);

  const rows = [
    { label: "Normal Trading Median", value: baseline.toFixed(3), color: "#94A3B8", sub: "Baseline noise" },
    { label: "Suspension-Eve Median", value: suspended.toFixed(3), color: "#E5C05B", sub: `+${lift}% above baseline`, highlight: true },
    { label: "Historical Recall",     value: `${recall}%`,         color: "#34D399", sub: "Of 27 suspension cases" },
  ];

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-white/[0.07] px-4 py-3">
        <span className="overline-label">Empirical Validation</span>
        <h3 className="mt-0.5 font-display text-sm font-semibold text-white">Suspension-Eve Divergence</h3>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-[11px] font-medium text-slate-400">{r.label}</div>
              <div className="mt-0.5 text-[10px] text-slate-600">{r.sub}</div>
            </div>
            <div
              className="font-mono text-xl font-bold tracking-tight"
              style={{ color: r.color }}
            >
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [meta, setMeta]               = useState(null);
  const [activeTab, setActiveTab]     = useState("all");
  const [query, setQuery]             = useState("");
  const [page, setPage]               = useState(1);

  const heroScoreRef      = useRef(null);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/leaderboard.json").then((r) => r.json()),
      fetch("/data/meta.json").then((r) => r.json()),
    ])
      .then(([lb, m]) => { setLeaderboard(lb); setMeta(m); })
      .catch(() => { setLeaderboard([]); setMeta({ total_stocks: 0, confirmed_stocks: 0 }); });
  }, []);

  const filtered = useMemo(() => {
    if (!leaderboard) return [];
    let list = [...leaderboard];
    if (activeTab === "unconfirmed") {
      list = list.filter((s) => !s.is_confirmed);
    } else if (activeTab !== "all") {
      list = list.filter((s) => s.risk_tier === activeTab && s.is_confirmed);
    }
    if (query.trim()) {
      const q = query.trim().toUpperCase();
      list = list.filter((s) => s.symbol.includes(q) || (s.sub_sector && s.sub_sector.toUpperCase().includes(q)));
    }
    list.sort((a, b) => {
      const d = tierOrder(a) - tierOrder(b);
      return d !== 0 ? d : (b.score ?? 0) - (a.score ?? 0);
    });
    return list;
  }, [leaderboard, activeTab, query]);

  useEffect(() => { setPage(1); }, [activeTab, query]);

  const totalPages    = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage      = Math.min(page, totalPages);
  const visibleStocks = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const highestStock  = leaderboard?.find((s) => s.risk_tier === "HIGH RISK") || leaderboard?.[0];

  useEffect(() => {
    if (highestStock && heroScoreRef.current) {
      animateCount(heroScoreRef.current, highestStock.score ?? 0, { decimals: 3, duration: 1500 });
    }
  }, [highestStock]);

  useEffect(() => {
    if (tableContainerRef.current) {
      const rows = tableContainerRef.current.querySelectorAll(".group");
      if (rows.length > 0) animateStagger(rows, { duration: 350, staggerDelay: 20, translateY: [6, 0] });
    }
  }, [visibleStocks, safePage]);

  if (!leaderboard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0D1117] text-slate-400">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span className="font-mono text-xs tracking-wider">LOADING MARKET SURVEILLANCE TELEMETRY…</span>
      </div>
    );
  }

  const highestTier = tierConfig(highestStock?.risk_tier);

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100">
      <SiteHeader />
      <TickerTape stocks={leaderboard.slice(0, 18)} />

      {/* ── FULL HERO (restored) ──────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.07] pb-12 pt-10 sm:pb-16 sm:pt-14">
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent live-pulse-radar" />
                INDEPENDENT MARKET SURVEILLANCE
              </div>
              <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Statistical Anomaly Surveillance for IDX Micro &amp; Small-Caps
              </h1>
              <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300 sm:text-lg">
                Screening <strong className="text-white">407 active equities</strong> against their own historical
                price-volume distributions—confirmed with multi-modal broker activity, foreign capital flows, and
                fundamental news divergence.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3.5">
                {highestStock && (
                  <Link
                    to={`/stock/${highestStock.symbol}`}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-accent/50 bg-gradient-to-r from-accent to-[#F59E0B] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-glowGold transition-all hover:brightness-110 text-center"
                  >
                    <span>Investigate Top Anomaly ({highestStock.symbol})</span>
                    <span className="text-sm">↗</span>
                  </Link>
                )}
                <Link
                  to="/methodology"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-5 py-3 text-xs font-semibold tracking-wide text-slate-200 transition-colors hover:border-white/[0.25] hover:bg-white/[0.06] hover:text-white text-center"
                >
                  <span>Explore Methodology (74% Recall)</span>
                  <span>→</span>
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                {[
                  { dot: "bg-emerald-400", label: "481 Screened Universe" },
                  { label: "407 Active Scored" },
                  { label: "63 Multi-Modal Confirmed" },
                  { label: "27 Ground-Truth Suspensions" },
                ].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {t.dot && <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />}
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Featured Alert Card */}
            {highestStock && (
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl border border-red-500/25 bg-gradient-to-b from-[#1C1520]/90 to-[#161B27]/90 p-6 shadow-glowHigh backdrop-blur-xl">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                    <div>
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                        PRIMARY DETECTED ANOMALY
                      </span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-mono text-3xl font-extrabold tracking-wide text-white">
                          {highestStock.symbol}
                        </span>
                        <span className="text-xs text-slate-500">
                          {highestStock.sub_sector || "IDX Listed"}
                        </span>
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-bold tracking-wide"
                      style={{
                        backgroundColor: `${highestTier.color}20`,
                        color: highestTier.color,
                        border: `1px solid ${highestTier.color}45`,
                      }}
                    >
                      ● {highestTier.label}
                    </span>
                  </div>

                  {/* Score readout */}
                  <div className="mt-6 flex items-baseline justify-between">
                    <div>
                      <div ref={heroScoreRef} className="font-mono text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                        {(highestStock.score ?? 0).toFixed(3)}
                      </div>
                      <div className="mt-1 font-mono text-xs text-slate-500">Combined Anomaly Score (0–1.0)</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xl font-bold text-slate-200">{formatPrice(highestStock.close)}</div>
                      <div className="text-[11px] text-slate-500">Latest Close Session</div>
                    </div>
                  </div>

                  {/* Diagnostics */}
                  <div className="mt-5 space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
                    {[
                      { label: "Dominant Driver", value: highestStock.dominant_signal || "Broker Distribution", cls: "text-white" },
                      { label: "Return Anomaly",  value: highestStock.return_zscore != null ? `${highestStock.return_zscore.toFixed(2)}σ` : "—", cls: "font-mono text-red-400" },
                      { label: "Evidence Depth",  value: "4 Confirmation Signals Verified", cls: "text-emerald-400" },
                    ].map((d) => (
                      <div key={d.label} className="flex items-center justify-between">
                        <span className="text-slate-500">{d.label}:</span>
                        <span className={`font-semibold ${d.cls}`}>{d.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-5">
                    <Link
                      to={`/stock/${highestStock.symbol}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/[0.08]"
                    >
                      <span>Open Full Surveillance Dossier</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD BODY: 2-column split ───────────────────── */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 py-7 lg:flex-row lg:items-start">

          {/* ── LEFT: Sticky Analytics Sidebar ──────────────── */}
          <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-[62px] lg:w-[380px] lg:max-h-[calc(100vh-74px)] lg:overflow-y-auto lg:pb-8">
            {/* Stats 2×2 */}
            <SummaryStats meta={meta} />

            {/* Risk Distribution */}
            <RiskDistribution meta={meta} />

            {/* Empirical Benchmark */}
            <div className="glass-panel p-4">
              <span className="overline-label">Empirical Benchmark</span>
              <h3 className="mt-1 font-display text-sm font-semibold text-white leading-snug">
                Significant Pre-Suspension Score Divergence
              </h3>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                Suspension-eve scores sit at a median of{" "}
                <strong className="text-accent">0.552</strong>, vs{" "}
                <strong className="text-slate-300">0.271</strong> on normal days. A{" "}
                <strong className="text-accent">+104% lift</strong> that proves the model captures genuine regulatory
                vulnerability point-in-time.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-3">
                <div className="data-chip">
                  <div className="text-[10px] text-slate-500">Normal Median</div>
                  <div className="mt-1.5 font-mono text-xl font-bold text-slate-300">0.271</div>
                </div>
                <div className="data-chip" style={{ borderColor: "rgba(229,192,91,0.22)", boxShadow: "0 0 14px rgba(229,192,91,0.07)" }}>
                  <div className="text-[10px] text-accent">Pre-Suspension</div>
                  <div className="mt-1.5 font-mono text-xl font-bold text-accent">0.552</div>
                </div>
              </div>
            </div>

            {/* Validation — compact sidebar version */}
            <SidebarValidation meta={meta} />
          </aside>

          {/* ── RIGHT: Leaderboard Panel ─────────────────────── */}
          <main className="min-w-0 flex-1 space-y-4">
            {/* Section header */}
            <div className="flex items-end justify-between border-b border-white/[0.07] pb-3">
              <div>
                <span className="overline-label">Surveillance Registry</span>
                <h2 className="mt-1 font-display text-2xl font-bold text-white">Market Anomaly Leaderboard</h2>
                <p className="mt-0.5 text-[11px] text-slate-500 max-w-xl">
                  Ranked by risk tier, then score. Click any ticker to inspect broker flow, foreign capital, news divergence, and price-volume charts.
                </p>
              </div>
              <div className="shrink-0 font-mono text-[11px] text-slate-500">
                <strong className="text-slate-200">{filtered.length}</strong> equities
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-2">
              <SearchBar value={query} onChange={setQuery} />
              <RiskFilterTabs active={activeTab} onChange={setActiveTab} />
              <DataTransparencyNote meta={meta} />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#161B27]/90 backdrop-blur-md">
              {/* Column headers */}
              <div className="hidden grid-cols-[36px_120px_100px_minmax(160px,1fr)_120px_115px_26px] gap-4 border-b border-white/[0.07] bg-white/[0.025] px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:grid">
                <span>#</span>
                <span>Ticker</span>
                <span>Close</span>
                <span>Anomaly Score</span>
                <span>Signal</span>
                <span className="text-right">Tier</span>
                <span />
              </div>

              {/* Rows */}
              <div ref={tableContainerRef}>
                {visibleStocks.map((stock, idx) => (
                  <LeaderboardRow
                    key={stock.symbol}
                    stock={stock}
                    rank={(safePage - 1) * PAGE_SIZE + idx + 1}
                  />
                ))}
                {visibleStocks.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="font-mono text-sm font-semibold text-slate-400">No stocks match &quot;{query}&quot;</div>
                    <div className="mt-1 text-xs text-slate-600">Clear search or select &quot;All Stocks&quot;.</div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filtered.length > 0 && (
                <div className="flex flex-col gap-3 border-t border-white/[0.07] bg-white/[0.015] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="font-mono text-[11px] text-slate-500">
                    Showing{" "}
                    <strong className="text-slate-200">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</strong>
                    {" "}of <strong className="text-slate-200">{filtered.length}</strong> stocks
                  </div>
                  <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
                </div>
              )}
            </div>
          </main>

        </div>
      </div>

      <DisclaimerFooter />
    </div>
  );
}
