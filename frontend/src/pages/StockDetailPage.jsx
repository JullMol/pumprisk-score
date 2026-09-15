import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import DisclaimerFooter from "../components/DisclaimerFooter";
import ScoreGauge from "../components/ScoreGauge";
import SignalRadar from "../components/SignalRadar";
import PriceVolumeChart from "../components/PriceVolumeChart";
import ComponentBreakdown from "../components/ComponentBreakdown";
import RangeStats from "../components/RangeStats";
import NewsHeadlines from "../components/NewsHeadlines";
import { tierConfig } from "../lib/tiers";
import { formatPrice } from "../lib/format";

export default function StockDetailPage() {
  const { symbol: rawSymbol } = useParams();
  const symbol = (rawSymbol || "").toUpperCase();

  const [detail, setDetail] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");
    setDetail(null);

    Promise.all([
      fetch(`/data/ticker/${encodeURIComponent(symbol)}.json`, { cache: "no-store" }).then((r) => {
        if (!r.ok) throw new Error("Ticker not found");
        return r.json();
      }),
      fetch("/data/meta.json", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([ticker]) => {
        if (!active) return;
        setDetail(ticker);
        setStatus("ready");
      })
      .catch(() => { if (active) setStatus("missing"); });

    return () => { active = false; };
  }, [symbol]);

  const breakdown = detail?.breakdown || {};

  const dominant = useMemo(() => {
    const entries = Object.entries(breakdown);
    if (!entries.length) return null;
    return entries.sort((a, b) => (b[1]?.signal ?? 0) - (a[1]?.signal ?? 0))[0];
  }, [breakdown]);

  // ── Loading state ─────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0D1117] text-slate-400">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span className="font-mono text-xs tracking-wider">LOADING SURVEILLANCE DOSSIER FOR {symbol}…</span>
      </div>
    );
  }

  // ── Not found state ───────────────────────────────────────
  if (status === "missing" || !detail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D1117] px-4 text-center">
        <div className="rounded-full bg-red-500/10 px-3 py-1 font-mono text-xs text-red-400 border border-red-500/20">
          TICKER NOT FOUND
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-white">
          No surveillance dossier for {symbol}
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          This stock was not included in our 407 monitored micro/small-cap universe, or is not an active ticker.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-accent hover:bg-white/[0.08]">
          ← Return to Market Leaderboard
        </Link>
      </div>
    );
  }

  const tier = tierConfig(detail.risk_tier);
  const percentile = detail.percentile_vs_normal;
  const history = detail.price_history || [];
  const newsHeadlines = detail.news_headlines || [];

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100">
      <SiteHeader />

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">

        {/* Top Breadcrumb & Quick Nav */}
        <div className="flex items-center justify-between py-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">Market Leaderboard</Link>
            <span className="text-slate-700">/</span>
            <span className="font-mono font-semibold text-accent">{detail.symbol}</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-400">{detail.sub_sector || "IDX Micro & Small-Cap"}</span>
          </div>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            <span>← Back to All Stocks</span>
          </Link>
        </div>

        {/* ── SPLIT 2-COLUMN LAYOUT ────────────────────────── */}
        <div className="flex flex-col gap-6 pb-12 lg:flex-row lg:items-start">

          {/* ── LEFT: Sticky Dossier Passport ───────────────── */}
          <aside className="w-full shrink-0 space-y-5 lg:sticky lg:top-[68px] lg:w-[380px] xl:w-[400px] lg:max-h-[calc(100vh-80px)] lg:overflow-y-auto lg:pr-1 custom-scrollbar">

            {/* Main Stock Passport Card */}
            <div className="glass-panel p-5 sm:p-6 relative overflow-hidden">
              {/* Subtle top tier accent line */}
              <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ backgroundColor: tier.color }}
              />

              {/* Status Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sm"
                  style={{
                    backgroundColor: `${tier.color}18`,
                    color: tier.color,
                    border: `1px solid ${tier.color}40`,
                  }}
                >
                  ● {tier.label}
                </span>
                <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-slate-400">
                  {detail.is_confirmed ? "Stage 2 · Verified" : "Stage 1 · Unconfirmed"}
                </span>
              </div>

              {/* Ticker & Price */}
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <h1 className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                    {detail.symbol}
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-400 font-medium">
                    {detail.sub_sector || "IDX Surveillance Target"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl font-bold text-white">
                    {formatPrice(detail.close)}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                    Last Close
                  </div>
                </div>
              </div>

              {/* ScoreGauge Visual */}
              <div className="mt-5 flex flex-col items-center justify-center py-1">
                <ScoreGauge score={detail.score} color={tier.color} size={190} label="PUMPRISK SCORE" />
              </div>

              {/* Core Diagnostic Chips */}
              <div className="mt-4 space-y-2">
                <div className="data-chip flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Primary Divergence</span>
                  <span className="font-mono text-xs font-semibold text-white">
                    {dominant ? dominant[0].replace("_", " ").toUpperCase() : "Composite"}
                  </span>
                </div>
                <div className="data-chip flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Market Percentile</span>
                  <span className="font-mono text-xs font-semibold text-accent">
                    {percentile != null ? `Top ${Math.max(1, Math.round(100 - percentile))}% (${Math.round(percentile)}th pct)` : "—"}
                  </span>
                </div>
                <div className="data-chip flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Surveillance Depth</span>
                  <span className={`font-mono text-xs font-semibold ${detail.is_confirmed ? "text-emerald-400" : "text-slate-400"}`}>
                    {detail.is_confirmed ? "4-Layer Cross-Verified" : "Stage 1 Screened Only"}
                  </span>
                </div>
              </div>

              {/* Model Note */}
              <p className="mt-4 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 text-[10px] leading-relaxed text-slate-500">
                PumpRisk Score measures behavior statistically anomalous relative to{" "}
                <strong className="text-slate-400">{detail.symbol}'s own historical baseline</strong>. An elevated score indicates empirical divergence requiring independent investor scrutiny.
              </p>
            </div>

            {/* Signal Radar Panel */}
            <div className="glass-panel p-5">
              <div className="border-b border-white/[0.07] pb-2.5">
                <span className="overline-label">MULTI-SIGNAL PROFILE</span>
                <h3 className="font-display text-sm font-semibold text-white">
                  Signal Radar Geometry
                </h3>
              </div>
              <div className="flex items-center justify-center py-2">
                <SignalRadar breakdown={detail.breakdown} />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed border-t border-white/[0.06] pt-2">
                Asymmetric spikes highlight divergence in specific evidence layers (e.g. volume or broker accumulation).
              </p>
            </div>

            {/* Baseline Metrics */}
            <div className="glass-panel p-5">
              <div className="border-b border-white/[0.07] pb-2.5">
                <span className="overline-label">HISTORICAL CONTEXT</span>
                <h3 className="font-display text-sm font-semibold text-white">
                  Baseline Trading Metrics
                </h3>
              </div>
              <div className="mt-3">
                <RangeStats history={history} />
              </div>
            </div>

            {/* Methodology Reference Card */}
            <div className="glass-panel p-4 flex flex-col gap-2.5">
              <div>
                <p className="text-xs font-semibold text-white">Ground-Truth Benchmark</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  Suspension-eve stocks scored median <strong className="text-accent">0.552</strong> vs{" "}
                  <strong className="text-slate-400">0.271</strong> on normal days (74% ground-truth recall).
                </p>
              </div>
              <Link
                to="/methodology"
                className="mt-1 inline-flex items-center justify-between rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
              >
                <span>Read Full Methodology</span>
                <span>→</span>
              </Link>
            </div>

          </aside>

          {/* ── RIGHT: Deep-Dive Surveillance Workspace ─────── */}
          <main className="min-w-0 flex-1 space-y-6">

            {/* Section 1: Price & Volume Chart */}
            <div className="glass-panel p-5 sm:p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.07] pb-4">
                <div>
                  <span className="overline-label">HISTORICAL SESSION TRACKER</span>
                  <h2 className="font-display text-xl font-bold text-white">
                    Price &amp; Volume Anomaly Map
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daily closing prices overlaid with volume anomalies and historical volatility bounds.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="rounded bg-red-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-red-400 border border-red-500/20">
                    |z| &gt; 2.0σ Highlighted
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <PriceVolumeChart history={history} />
              </div>
            </div>

            {/* Section 2: 5 Evidence Layers Breakdown */}
            <div className="glass-panel p-5 sm:p-6">
              <div className="border-b border-white/[0.07] pb-4 mb-5">
                <span className="overline-label">EXPLAINABLE COMPOSITE MODEL</span>
                <h2 className="font-display text-xl font-bold text-white">
                  5 Evidence Layers · Surveillance Decomposition
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Independent statistical signals combined into a point-in-time composite risk rating.
                </p>
              </div>
              <ComponentBreakdown
                breakdown={detail.breakdown}
                newsHeadlines={newsHeadlines}
              />
            </div>

            {/* Section 3: Corporate Filings & Adverse News Monitor */}
            <div className="glass-panel p-5 sm:p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.07] pb-4 mb-5">
                <div>
                  <span className="overline-label">FUNDAMENTAL CONTEXT &amp; MEDIA SCAN</span>
                  <h2 className="font-display text-xl font-bold text-white">
                    Corporate Filings &amp; Adverse News Coverage
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official IDX announcements, regulatory clarifications, and financial press reports.
                  </p>
                </div>
                {newsHeadlines.length > 0 && (
                  <span className="self-start sm:self-auto rounded-full bg-violet-500/10 px-3 py-1 font-mono text-xs font-semibold text-violet-400 border border-violet-500/20">
                    {newsHeadlines.length} articles cataloged
                  </span>
                )}
              </div>

              {/* Rich Link Preview Cards with Thumbnails */}
              <NewsHeadlines
                headlines={newsHeadlines}
                tickerSymbol={detail.symbol}
              />
            </div>

          </main>
        </div>
      </div>

      <DisclaimerFooter />
    </div>
  );
}
