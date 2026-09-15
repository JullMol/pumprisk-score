import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { tierConfig } from "../lib/tiers";

export default function RiskDistribution({ meta }) {
  const barRefs = useRef({});
  const dist = meta?.tier_distribution || {};
  const confirmedTotal = meta?.confirmed_stocks || 63;

  const tiers = [
    { key: "HIGH RISK",    count: dist["HIGH RISK"]    ?? 1,  label: "High Risk"   },
    { key: "MEDIUM RISK",  count: dist["MEDIUM RISK"]  ?? 29, label: "Medium Risk" },
    { key: "WATCH",        count: dist.WATCH            ?? 25, label: "Watch"       },
    { key: "NORMAL",       count: dist.NORMAL           ?? 8,  label: "Normal"      },
  ];

  useEffect(() => {
    tiers.forEach((t) => {
      const el = barRefs.current[t.key];
      if (!el) return;
      const targetPct = Math.max((t.count / confirmedTotal) * 100, 1.5);
      const state = { w: 0 };
      animate(state, {
        w: targetPct,
        duration: 1100,
        ease: "outExpo",
        delay: 200,
        onUpdate: () => {
          if (el) el.style.width = `${state.w}%`;
        },
      });
    });
  }, [confirmedTotal]);

  return (
    <div className="glass-panel p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="overline-label">Risk Tier Calibration</span>
          <h3 className="mt-1 font-display text-xl font-semibold text-white">
            Confirmed Tier Distribution
          </h3>
        </div>
        <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-mono text-xs font-semibold text-slate-300">
          n = {confirmedTotal}
        </span>
      </div>

      {/* Stacked horizontal bar */}
      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-black/50 gap-0.5">
        {tiers.map((t) => {
          const color = tierConfig(t.key).color;
          return (
            <div
              key={t.key}
              ref={(el) => { barRefs.current[t.key] = el; }}
              title={`${t.label}: ${t.count} stocks`}
              className="h-full rounded-sm"
              style={{
                width: "0%",
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}70`,
                transition: "none",
              }}
            />
          );
        })}
      </div>

      {/* Legend grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {tiers.map((t) => {
          const color = tierConfig(t.key).color;
          const pct = Math.round((t.count / confirmedTotal) * 100);
          return (
            <div
              key={t.key}
              className="data-chip"
              style={{ borderColor: `${color}22` }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                />
                <span className="text-[11px] font-medium text-slate-300 truncate">
                  {t.label}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-mono text-xl font-bold text-white">
                  {t.count}
                </span>
                <span
                  className="font-mono text-xs font-semibold"
                  style={{ color: `${color}cc` }}
                >
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">
        344 additional stocks remain in the{" "}
        <strong className="text-slate-400">Unconfirmed Tier</strong> — Stage 1
        price/volume signals only (API quota limit).
      </p>
    </div>
  );
}
