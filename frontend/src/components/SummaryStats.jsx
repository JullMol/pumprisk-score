import { useEffect, useRef } from "react";
import { animateCount } from "../lib/animations";

const CARDS = [
  {
    key: "universe",
    label: "Active Universe",
    sub: "Micro & Small-Caps Monitored",
    badge: "Cleaned Dataset",
    colorClass: "text-white",
    accentHex: "#94A3B8",
    icon: "◈",
  },
  {
    key: "confirmed",
    label: "Confirmed Shortlist",
    sub: "4-Layer Stage 2 Verified",
    badge: "Priority Watch",
    colorClass: "text-amber-400",
    accentHex: "#F59E0B",
    icon: "◆",
  },
  {
    key: "highrisk",
    label: "High Risk Anomalies",
    sub: "Extreme Divergence Detected",
    badge: "Immediate Focus",
    colorClass: "text-red-400",
    accentHex: "#FF4D4D",
    icon: "⬟",
  },
  {
    key: "recall",
    label: "Ground-Truth Recall",
    sub: "Backtested vs IDX Halts",
    badge: "27 Suspensions",
    colorClass: "text-emerald-400",
    accentHex: "#10B981",
    icon: "◎",
  },
];

export default function SummaryStats({ meta }) {
  const refs = {
    universe: useRef(null),
    confirmed: useRef(null),
    highrisk: useRef(null),
    recall: useRef(null),
  };

  const threshold = meta?.thresholds || {};
  const totalStocks = meta?.total_stocks ?? 407;
  const confirmedStocks = meta?.confirmed_stocks ?? 63;
  const highRiskCount = meta?.tier_distribution?.["HIGH RISK"] ?? 1;
  const recallPct = threshold.recall_watch_or_higher
    ? Math.round(threshold.recall_watch_or_higher * 100)
    : 74;

  const values = {
    universe: totalStocks,
    confirmed: confirmedStocks,
    highrisk: highRiskCount,
    recall: recallPct,
  };

  const displaySuffix = { recall: "%" };
  const fallbacks = {
    universe: totalStocks,
    confirmed: confirmedStocks,
    highrisk: highRiskCount,
    recall: `${recallPct}%`,
  };

  useEffect(() => {
    Object.entries(refs).forEach(([key, ref]) => {
      if (ref.current) {
        animateCount(ref.current, values[key], {
          suffix: displaySuffix[key] ?? "",
          duration: 1300,
        });
      }
    });
  }, [totalStocks, confirmedStocks, highRiskCount, recallPct]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="glass-panel-interactive relative overflow-hidden p-3.5 sm:p-5"
        >
          {/* Color accent bar at top */}
          <div
            className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, transparent, ${card.accentHex}70, transparent)`,
            }}
          />

          {/* Icon + Label row */}
          <div className="flex items-start justify-between">
            <span
              className="text-[16px] sm:text-[18px] leading-none"
              style={{ color: `${card.accentHex}90` }}
            >
              {card.icon}
            </span>
            <span
              className="rounded border bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] text-slate-500 truncate max-w-[100px]"
              style={{ borderColor: `${card.accentHex}25` }}
            >
              {card.badge}
            </span>
          </div>

          {/* Main number */}
          <div className="mt-3 sm:mt-4">
            <span
              ref={refs[card.key]}
              className={`font-mono text-2xl sm:text-[1.75rem] font-bold leading-none tracking-tight ${card.colorClass}`}
            >
              {fallbacks[card.key]}
            </span>
          </div>

          {/* Label + Sub */}
          <div className="mt-2.5 space-y-0.5">
            <div className="text-xs font-semibold text-slate-200">
              {card.label}
            </div>
            <div className="text-[11px] text-slate-500">{card.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
