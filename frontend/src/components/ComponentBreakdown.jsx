import { useEffect, useRef } from "react";
import { animate } from "animejs";

const COMPONENT_META = {
  price: {
    name: "Price Movement Anomaly",
    weight: "20%",
    color: "#FF4D4D",
    icon: "↑",
    description: "Return z-score evaluated against 20-day historical distribution.",
  },
  volume: {
    name: "Volume Spike Anomaly",
    weight: "20%",
    color: "#EAB308",
    icon: "▲",
    description: "Trading volume percentile vs. 20-day rolling baseline.",
  },
  broker: {
    name: "Broker Accumulation",
    weight: "25%",
    color: "#38BDF8",
    icon: "◈",
    description: "Net dominance of top accumulating vs. distributing brokers.",
  },
  foreign: {
    name: "Foreign Capital Flow",
    weight: "20%",
    color: "#10B981",
    icon: "⇄",
    description: "Cumulative net foreign institutional inflow/outflow (90-day).",
  },
  fundamental: {
    name: "Fundamental Context & News",
    weight: "15%",
    color: "#A78BFA",
    icon: "⬡",
    description: "Corporate announcements, financial filings, and news divergence scan.",
  },
};

function EvidenceCard({ keyName, data, isFull, newsHeadlines }) {
  const barRef = useRef(null);
  const meta = COMPONENT_META[keyName] || {
    name: keyName,
    weight: "—",
    color: "#E5C05B",
    icon: "◆",
    description: "",
  };

  const signalVal = data?.signal;
  const pct = signalVal != null ? Math.max(0, Math.min(100, Math.round(signalVal * 100))) : null;

  useEffect(() => {
    if (barRef.current && pct != null) {
      const state = { w: 0 };
      animate(state, {
        w: pct,
        duration: 1000,
        ease: "outExpo",
        delay: 150,
        onUpdate: () => {
          if (barRef.current) barRef.current.style.width = `${state.w}%`;
        },
      });
    }
  }, [pct]);

  const intensity = pct != null
    ? pct >= 75 ? "Critical" : pct >= 50 ? "Elevated" : pct >= 25 ? "Moderate" : "Low"
    : "—";

  return (
    <div
      className={`glass-panel p-5 sm:p-6 ${isFull ? "md:col-span-2" : ""}`}
      style={{ borderColor: pct != null && pct > 50 ? `${meta.color}20` : undefined }}
    >
      {/* Top accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-[1.5px] rounded-t-2xl opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${meta.color}80, transparent)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Color icon badge */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold"
            style={{ backgroundColor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}
          >
            {meta.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white truncate">{meta.name}</span>
              <span
                className="rounded px-1.5 py-0.5 font-mono text-[10px] font-medium shrink-0"
                style={{ backgroundColor: `${meta.color}15`, color: `${meta.color}cc` }}
              >
                {meta.weight} weight
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{meta.description}</p>
          </div>
        </div>

        {/* Score readout */}
        <div className="shrink-0 text-right">
          <div
            className="font-mono text-2xl font-bold leading-none"
            style={{ color: pct != null ? meta.color : "#64748B" }}
          >
            {pct != null ? `${pct}` : "—"}
          </div>
          <div className="mt-0.5 font-mono text-[10px] text-slate-500">
            {pct != null ? "/ 100" : "unconfirmed"}
          </div>
        </div>
      </div>

      {/* Animated progress bar */}
      {pct != null && (
        <div className="mt-4 bar-track">
          <div
            ref={barRef}
            className="h-full rounded-full"
            style={{
              width: "0%",
              backgroundColor: meta.color,
              boxShadow: `0 0 12px ${meta.color}60`,
            }}
          />
        </div>
      )}

      {/* Intensity label */}
      {pct != null && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-slate-600 font-mono">Signal Strength</span>
          <span
            className="font-mono text-[10px] font-semibold"
            style={{ color: `${meta.color}cc` }}
          >
            {intensity}
          </span>
        </div>
      )}

      {/* Narrative interpretation */}
      {data?.interpretation && (
        <p className="mt-3.5 text-xs leading-relaxed text-slate-300 border-t border-white/[0.05] pt-3">
          {data.interpretation}
        </p>
      )}

      {keyName === "fundamental" && newsHeadlines?.length > 0 && (
        <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-accent border-t border-white/[0.05] pt-2.5">
          <span>📰</span>
          <span>{newsHeadlines.length} corporate filings &amp; news reports cataloged below ↓</span>
        </div>
      )}
    </div>
  );
}

export default function ComponentBreakdown({ breakdown = {}, newsHeadlines = [] }) {
  const ORDER = ["price", "volume", "broker", "foreign", "fundamental"];
  const sorted = ORDER.filter((k) => k in breakdown).concat(
    Object.keys(breakdown).filter((k) => !ORDER.includes(k))
  );

  return (
    <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
      {sorted.map((key) => (
        <EvidenceCard
          key={key}
          keyName={key}
          data={breakdown[key]}
          isFull={key === "fundamental"}
          newsHeadlines={key === "fundamental" ? newsHeadlines : []}
        />
      ))}
    </div>
  );
}
