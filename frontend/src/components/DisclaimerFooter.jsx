import { Link } from "react-router-dom";

export default function DisclaimerFooter() {
  return (
    <footer className="mt-20 border-t border-white/[0.07]">
      {/* Top band */}
      <div className="bg-[#0A0D13]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Brand + disclaimer */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/25 bg-accent/10">
                  <span className="font-mono text-sm font-bold text-accent">PR</span>
                </div>
                <span className="font-display text-base font-semibold text-white">
                  PumpRisk™ Anomaly Surveillance
                </span>
                <span className="rounded border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-500">
                  Sectors Hackathon 2026 · Track 03
                </span>
              </div>

              <p className="mt-4 max-w-xl text-xs leading-relaxed text-slate-500">
                <strong className="font-semibold text-slate-400">Important Disclaimer:</strong>{" "}
                PumpRisk Score is an independent statistical surveillance tool designed for
                research and educational market intelligence. It does not constitute financial
                advice, investment recommendations, or accusations of illegal manipulation.
                All trading decisions remain solely the user's responsibility.
              </p>
            </div>

            {/* Nav links */}
            <div className="lg:col-span-5 lg:text-right">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-3">
                Navigation
              </div>
              <div className="flex flex-wrap gap-4 text-xs lg:justify-end">
                <Link
                  to="/"
                  className="font-medium text-slate-400 transition-colors hover:text-accent"
                >
                  Market Leaderboard
                </Link>
                <Link
                  to="/methodology"
                  className="font-medium text-slate-400 transition-colors hover:text-accent"
                >
                  Methodology & Backtest
                </Link>
                <Link
                  to="/about"
                  className="font-medium text-slate-400 transition-colors hover:text-accent"
                >
                  About & OJK Context
                </Link>
                <a
                  href="https://docs.sectors.app"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-slate-400 transition-colors hover:text-accent"
                >
                  Sectors API Docs ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/[0.05] bg-[#030508]/95 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[10px] text-slate-600">
            <div className="flex items-center gap-4">
              <span>Built with Sectors API · Indonesia Stock Exchange (IDX)</span>
              <span className="hidden sm:inline text-slate-700">·</span>
              <span className="hidden sm:inline">Data verified against 27 point-in-time suspension events</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 live-pulse-radar" />
              <span>Snapshot active · 2026</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
