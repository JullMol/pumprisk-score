import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import DisclaimerFooter from "../components/DisclaimerFooter";

const FORMULA_COMPONENTS = [
  {
    weight: "40%",
    title: "Price & Volume Anomaly (Stage 1)",
    desc: "The statistical baseline computed across all 407 active equities: 20-day rolling return z-scores plus trading volume percentiles.",
    accent: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
  },
  {
    weight: "25%",
    title: "Broker Accumulation / Distribution",
    desc: "Analyzes top buyer vs top seller broker concentration and net buyer dominance (e.g. YU, XL, PD activity) from Sectors API broker telemetry.",
    accent: "text-sky-400",
    border: "border-sky-500/20",
    bg: "bg-sky-500/5",
  },
  {
    weight: "20%",
    title: "Foreign Capital Outflow / Inflow",
    desc: "Independent institutional confirmation tracking cumulative 90-day net foreign flow to catch silent distribution patterns.",
    accent: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
  },
  {
    weight: "15%",
    title: "Fundamental News Divergence",
    desc: "Cross-checks corporate filings and headline sentiment: penalizes aggressive price surges that lack any verifiable disclosure support.",
    accent: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
];

export default function MethodologyPage() {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    fetch("/data/meta.json")
      .then((r) => r.json())
      .then(setMeta)
      .catch(() => setMeta({}));
  }, []);

  const t = meta?.thresholds || {};

  const funnelSteps = [
    {
      num: "481",
      label: "IDX Screened Universe",
      desc: "Bottom quartile market-cap threshold identifying all micro & small-cap stocks.",
    },
    {
      num: "407",
      label: "Active Scored Stocks",
      desc: "74 stocks excluded after rigorous audit (dormant liquidity, 0-volume, frozen price).",
    },
    {
      num: "63",
      label: "Stage 2 Confirmed Shortlist",
      desc: "Deep multi-modal confirmation (broker flow + foreign + news) allocated within API quota.",
    },
    {
      num: "1",
      label: "HIGH RISK Detected",
      desc: "Extreme multi-layer divergence confirmed (JELI: 0.754 score, top distributor broker YU).",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Header Title */}
        <section className="border-b border-white/[0.08] pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <span>METHODOLOGICAL RIGOR & BACKTESTING</span>
          </div>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]">
            The PumpRisk Scoring Architecture
          </h1>

          <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-3xl">
            Every stock is evaluated strictly against its <strong className="text-white">own historical behavior</strong>, not against peer benchmarks. A composite 0–1 score isolates statistically anomalous movement before retail traders get trapped by viral sentiment.
          </p>

          <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs leading-relaxed text-slate-400">
            <strong className="text-white">Core Axiom:</strong> Unusual movement is an objective signal to investigate—not a legal accusation of market manipulation or a buy/sell recommendation.
          </div>
        </section>

        {/* Section 1: The Funnel */}
        <section className="space-y-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Section 01 · Data Architecture
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              A Sustainable, Budget-Aware Funnel
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Querying multi-modal broker activity, foreign flow, and news filings across the entire exchange is cost-prohibitive. We engineered a two-stage screening funnel:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {funnelSteps.map((step, i) => (
              <div
                key={i}
                className="glass-panel p-5 relative overflow-hidden"
              >
                <div className="font-mono text-4xl font-extrabold text-white">
                  {step.num}
                </div>
                <div className="mt-3 text-sm font-semibold text-slate-200">
                  {step.label}
                </div>
                <div className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#1C2333]/70 p-4 text-xs text-slate-400">
            <span className="font-mono font-semibold text-slate-300">Funnel Flow:</span>{" "}
            481 Universe → 407 Stage 1 (Price/Volume Anomaly) → Top 63 Stage 2 Confirmed → Empirical Risk Tiers. Unconfirmed stocks remain transparently tagged rather than hidden.
          </div>
        </section>

        {/* Section 2: Mathematical Scoring Formula */}
        <section className="space-y-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Section 02 · Scoring Formula
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              4-Component Calibrated Weighting
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl">
              When Stage 2 confirmation data exists, the composite PumpRisk score is computed as:
            </p>
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent/[0.03] p-4 font-mono text-xs sm:text-sm text-accent shadow-glowGold overflow-x-auto">
            Score = (0.40 × Stage1_Anomaly) + (0.25 × Broker_Signal) + (0.20 × Foreign_Signal) + (0.15 × Fundamental_Divergence)
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FORMULA_COMPONENTS.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border ${item.border} ${item.bg} p-5 backdrop-blur-md`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {item.title}
                  </span>
                  <span className={`font-mono text-lg font-extrabold ${item.accent}`}>
                    {item.weight}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 03: Weight Sensitivity & Robustness */}
        <section className="space-y-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Section 03 · Robustness Check
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              Weight Sensitivity &amp; Ranking Stability
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              These weights are expert-defined, not fitted to the suspension events used for validation below. Because only 27 historical suspension cases had sufficient point-in-time data for evaluation, deliberately avoiding a weight-fitting exercise against them prevents overfitting to a small labeled sample.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 space-y-6">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Instead, we tested whether stock rankings stay stable under reasonable alternative weighting schemes. Across three alternatives—equal weighting, market-focused, and flow-focused—rankings on the 63 confirmed stocks stayed highly correlated with the baseline (<strong className="text-accent font-mono">Spearman ρ = 0.971–0.989</strong>), and the top two flagged stocks (<strong className="text-white">JELI</strong> and <strong className="text-white">VINS</strong>) did not change.
            </p>

            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C2333]/80">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Weighting Scheme</th>
                    <th className="hidden px-5 py-3.5 sm:table-cell">Component Allocation</th>
                    <th className="px-5 py-3.5 text-center">Top 2 Flagged Stocks</th>
                    <th className="px-5 py-3.5 text-right font-mono">vs. Baseline (ρ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-slate-300">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      Equal Weighting
                      <div className="sm:hidden mt-1 font-mono text-[10px] text-slate-400">
                        25% Market · 25% Broker · 25% Foreign · 25% News
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 font-mono text-[11px] text-slate-400 sm:table-cell">
                      25% Market · 25% Broker · 25% Foreign · 25% News
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                        JELI, VINS
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-accent">
                      0.989
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      Market-Focused
                      <div className="sm:hidden mt-1 font-mono text-[10px] text-slate-400">
                        50% Market · 20% Broker · 15% Foreign · 15% News
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 font-mono text-[11px] text-slate-400 sm:table-cell">
                      50% Market · 20% Broker · 15% Foreign · 15% News
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                        JELI, VINS
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-accent">
                      0.971
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">
                      Flow-Focused
                      <div className="sm:hidden mt-1 font-mono text-[10px] text-slate-400">
                        25% Market · 35% Broker · 25% Foreign · 15% News
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 font-mono text-[11px] text-slate-400 sm:table-cell">
                      25% Market · 35% Broker · 25% Foreign · 15% News
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                        JELI, VINS
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-accent">
                      0.989
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-accent/20 bg-accent/[0.03] p-4 text-xs leading-relaxed text-slate-300">
              <strong className="text-accent">Methodological Principle:</strong> This weighting scheme should be interpreted as a transparent design choice, <strong className="text-white">not a statistically optimal parameterization</strong>. Prioritizing robustness and explainability over curve-fitting preserves generalization across future trading regimes.
            </div>
          </div>
        </section>

        {/* Section 04: Empirical Validation & Ground-Truth Suspensions */}
        <section className="space-y-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Section 04 · Ground-Truth Validation
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              Backtested Against 27 Real IDX Trading Suspensions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-3xl">
              To prove that PumpRisk flags meaningful signals rather than statistical noise, we cross-referenced our score point-in-time against actual regulatory trading halts ordered by the Indonesia Stock Exchange (BEI).
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
                <span className="text-xs text-slate-400">Normal Trading Day Median</span>
                <div className="mt-2 font-mono text-4xl font-extrabold text-slate-300">
                  0.271
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Typical daily noise baseline across all 407 active equities.
                </div>
              </div>

              <div className="rounded-xl border border-accent/40 bg-accent/[0.04] p-5 shadow-glowGold">
                <span className="text-xs text-accent font-semibold">Pre-Suspension Eve Median</span>
                <div className="mt-2 font-mono text-4xl font-extrabold text-accent">
                  0.552
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  Measured on the final trading session prior to suspension.
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 sm:col-span-2 lg:col-span-1">
                <span className="text-xs text-emerald-400 font-semibold">Recall Rate (Watch+)</span>
                <div className="mt-2 font-mono text-4xl font-extrabold text-emerald-400">
                  74.1%
                </div>
                <div className="mt-2 text-xs text-slate-300">
                  20 of 27 valid point-in-time suspensions flagged before the halt.
                </div>
              </div>
            </div>

            {/* Reconciliation Note (60 -> 31 -> 27) */}
            <div className="rounded-xl border border-white/[0.08] bg-black/40 p-4 text-xs text-slate-400 space-y-2">
              <strong className="text-slate-200">Data Filtering Transparency (60 → 31 → 27):</strong>
              <p>
                From 60 raw regulatory suspension announcements scraped from BEI/Sectors API between March and September 2026, 31 belonged to our micro/small-cap universe. 27 cases possessed at least 20 trading sessions of prior history required for complete rolling z-score and volume percentile computation. The 0.552 median and 74.1% recall metrics are derived rigorously from these 27 point-in-time observations.
              </p>
            </div>
          </div>
        </section>

        {/* Section 05: Calibrated Thresholds */}
        <section className="space-y-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Section 05 · Threshold Calibration
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              Empirical Cutoffs (No Arbitrary Guesswork)
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-2xl">
              Risk tiers are calibrated directly from empirical percentiles of the suspended vs normal distributions:
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C2333]/80">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-white/[0.03] font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Risk Tier</th>
                  <th className="px-5 py-3.5">Cutoff Threshold</th>
                  <th className="px-5 py-3.5">Empirical Derivation Source</th>
                  <th className="px-5 py-3.5 text-right">Confirmed Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300 font-mono">
                <tr>
                  <td className="px-5 py-3.5 font-bold text-red-400">HIGH RISK</td>
                  <td className="px-5 py-3.5 text-white font-bold">&gt;= 0.578</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">P90 of normal daily market distribution</td>
                  <td className="px-5 py-3.5 text-right text-white">1 stock (JELI)</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-amber-400">MEDIUM RISK</td>
                  <td className="px-5 py-3.5 text-white font-bold">&gt;= 0.449</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">P75 of normal daily market distribution</td>
                  <td className="px-5 py-3.5 text-right text-white">29 stocks</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-yellow-400">WATCH</td>
                  <td className="px-5 py-3.5 text-white font-bold">&gt;= 0.309</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">P25 of actual suspended equities distribution</td>
                  <td className="px-5 py-3.5 text-right text-white">25 stocks</td>
                </tr>
                <tr>
                  <td className="px-5 py-3.5 font-bold text-emerald-400">NORMAL</td>
                  <td className="px-5 py-3.5 text-white font-bold">&lt; 0.309</td>
                  <td className="px-5 py-3.5 text-slate-400 font-sans">Baseline non-anomalous trading range</td>
                  <td className="px-5 py-3.5 text-right text-white">8 stocks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 06: Honest Limitations */}
        <section className="space-y-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
              Section 06 · Caveats
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Methodological Limitations &amp; Caveats
            </h2>
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 text-xs leading-relaxed text-slate-300">
            Not all historical suspensions trigger the highest tier. For instance, FLMC and COAL were suspended due to going-concern uncertainties and delayed financial disclosures rather than aggressive price/volume ramps. The model intentionally distinguishes between trading-driven anomalies and corporate legal issues.
          </div>
        </section>
      </main>

      <DisclaimerFooter />
    </div>
  );
}
