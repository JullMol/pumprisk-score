import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import DisclaimerFooter from "../components/DisclaimerFooter";

const NOT_PRINCIPLES = [
  {
    num: "01",
    title: "Not an Accusation of Crime",
    desc: "We do not claim a stock is being 'pumped' or manipulated. We flag that price and volume activity is statistically abnormal relative to historical norms.",
  },
  {
    num: "02",
    title: "Not an Investment Recommendation",
    desc: "The score contains zero buy, sell, or hold signals. It is a reality-check risk metric designed to combat emotional FOMO trading.",
  },
  {
    num: "03",
    title: "Not an Automated Bot or Trading Signal",
    desc: "In accordance with regulatory boundaries, PumpRisk provides surveillance intelligence, not automated execution or predictive price forecasting.",
  },
  {
    num: "04",
    title: "Not a Replacement for Due Diligence",
    desc: "Retail traders must review company financial disclosures, debt levels, and licensed broker analyses before committing capital.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <section className="border-b border-white/[0.08] pb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            <span>TRACK 03: MARKET INTELLIGENCE · SECTORS HACKATHON 2026</span>
          </div>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12]">
            Why We Built PumpRisk Score
          </h1>

          <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-3xl">
            A free, broker-neutral surveillance lens for Indonesia's micro and small-cap equities—the market segment most vulnerable to viral social media speculation and least covered by institutional analytics.
          </p>
        </section>

        {/* The Macro Context & OJK Crackdown */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Regulatory Background
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              The Need for Independent Retail Surveillance
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm leading-relaxed text-slate-300">
              <p>
                In 2026, Indonesia's Financial Services Authority (OJK) launched investigations into <strong className="text-white">32 active stock manipulation cases</strong> involving corporations, syndicates, and financial influencers ("influencer gorengan saham"), resulting in multi-billion rupiah fines.
              </p>
              <p>
                Simultaneously, retail investors accounted for nearly <strong className="text-white">50% of daily IDX trading volume</strong>. Millions of everyday investors scroll Telegram channels, TikTok clips, and X threads receiving speculative buy tips, with no objective, broker-agnostic tool to verify whether the price movement is fundamentally supported or statistically manufactured.
              </p>
              <p>
                PumpRisk fills this gap: a clean, data-backed second opinion powered entirely by granular <strong className="text-accent">Sectors API</strong> data.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="glass-panel p-6 space-y-4 border-l-4 border-l-accent">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                Regulatory Evidence
              </span>
              <div className="font-mono text-5xl font-extrabold text-white">
                32
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Active market manipulation cases investigated by OJK in 2026, emphasizing the urgent need for retail-facing market transparency.
              </p>
              <div className="border-t border-white/[0.08] pt-3 text-[11px] text-slate-400">
                Sources: CNBC Indonesia, Kontan, Tempo, BEI Official Disclosures.
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Choice: Why Not a GNN / Graph Model? */}
        <section className="glass-panel p-6 sm:p-8 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            Technical Differentiation
          </span>
          <h2 className="font-display text-2xl font-bold text-white">
            Why Individual Time-Series Over Graph Neural Networks?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-2 text-xs sm:text-sm leading-relaxed">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-2">
              <span className="font-mono text-xs font-semibold text-slate-400">
                Correlation-Graph Approach (e.g. Sectors GNN Recipe)
              </span>
              <p className="text-slate-400">
                Graph autoencoders work well for large-cap equities (BBCA, TLKM, ASII) that exhibit high cross-market correlation and common macroeconomic sensitivity.
              </p>
            </div>

            <div className="rounded-xl border border-accent/30 bg-accent/[0.03] p-5 space-y-2 shadow-glowGold">
              <span className="font-mono text-xs font-semibold text-accent">
                PumpRisk Time-Series Approach (Micro/Small-Caps)
              </span>
              <p className="text-slate-200">
                Indonesian small-cap stocks are idiosyncratic and thinly traded. Measuring each stock against <strong className="text-white">its own historical distribution</strong> isolates anomalies without diluting signals through artificial cross-stock correlations.
              </p>
            </div>
          </div>
        </section>

        {/* Strict Negative Boundaries (What PumpRisk is NOT) */}
        <section className="space-y-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Regulatory Compliance
            </span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              Strict Negative Boundaries
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              To remain legally defensible, safe, and transparent, PumpRisk operates within four non-negotiable boundaries:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {NOT_PRINCIPLES.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-accent">
                    {item.num}
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA to Leaderboard */}
        <section className="glass-panel p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-accent/20">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">
              Ready to examine the market anomalies?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Access the daily surveillance leaderboard of 407 monitored equities.
            </p>
          </div>
          <Link
            to="/"
            className="shrink-0 rounded-xl border border-accent/50 bg-gradient-to-r from-accent to-amber-400 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-glowGold transition-all hover:brightness-110"
          >
            Launch Market Leaderboard ↗
          </Link>
        </section>
      </main>

      <DisclaimerFooter />
    </div>
  );
}
