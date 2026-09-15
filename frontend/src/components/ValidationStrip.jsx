import { useEffect, useRef } from "react";
import { animateCount } from "../lib/animations";

export default function ValidationStrip({ meta }) {
  const baseRef = useRef(null);
  const suspRef = useRef(null);
  const recallRef = useRef(null);

  const t = meta?.thresholds || {};
  const baseline = t.baseline_median_score ?? 0.271;
  const suspended = t.suspended_median_score ?? 0.552;
  const recall = t.recall_watch_or_higher
    ? Math.round(t.recall_watch_or_higher * 100)
    : 74;

  const liftPct = Math.round(((suspended - baseline) / baseline) * 100);

  useEffect(() => {
    if (baseRef.current) animateCount(baseRef.current, baseline, { decimals: 3, duration: 1200 });
    if (suspRef.current) animateCount(suspRef.current, suspended, { decimals: 3, duration: 1400 });
    if (recallRef.current) animateCount(recallRef.current, recall, { suffix: "%", duration: 1100 });
  }, [baseline, suspended, recall]);

  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-white/[0.07] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="overline-label">Empirical Validation</span>
          <h3 className="mt-1 font-display text-xl font-semibold text-white">
            Suspension-Eve Score Divergence
          </h3>
        </div>
        <p className="text-xs text-slate-500 sm:max-w-xs sm:text-right">
          Proof that PumpRisk flags real anomalies — validated against actual IDX regulatory trading halts.
        </p>
      </div>

      {/* Main stats row */}
      <div className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {/* Normal Baseline */}
        <div className="px-6 py-5">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Normal Trading Median
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              ref={baseRef}
              className="font-mono text-4xl font-bold tracking-tight text-slate-300"
            >
              {baseline.toFixed(3)}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600">
            Baseline noise across all 407 stocks
          </p>
          {/* small visual bar */}
          <div className="mt-4 bar-track">
            <div
              className="h-full rounded-full bg-slate-600"
              style={{ width: `${(baseline / 1) * 100}%` }}
            />
          </div>
        </div>

        {/* Suspension-Eve */}
        <div className="relative px-6 py-5">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent">
            Suspension-Eve Median
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span
              ref={suspRef}
              className="font-mono text-4xl font-bold tracking-tight text-accent"
            >
              {suspended.toFixed(3)}
            </span>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[11px] font-bold text-accent border border-accent/30">
              +{liftPct}%
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600">
            Measured 24h prior to actual IDX suspension
          </p>
          <div className="mt-4 bar-track">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(suspended / 1) * 100}%`,
                backgroundColor: "#E5C05B",
                boxShadow: "0 0 10px rgba(229,192,91,0.5)",
              }}
            />
          </div>
          {/* Divider glow accent */}
          <div className="absolute -left-px top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent hidden sm:block" />
        </div>

        {/* Recall Rate */}
        <div className="relative px-6 py-5">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
            Historical Recall
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              ref={recallRef}
              className="font-mono text-4xl font-bold tracking-tight text-emerald-400"
            >
              {recall}%
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600">
            Of 27 suspension events correctly flagged
          </p>
          <div className="mt-4 bar-track">
            <div
              className="h-full rounded-full"
              style={{
                width: `${recall}%`,
                backgroundColor: "#10B981",
                boxShadow: "0 0 10px rgba(16,185,129,0.5)",
              }}
            />
          </div>
          <div className="absolute -left-px top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-emerald-500/25 to-transparent hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
