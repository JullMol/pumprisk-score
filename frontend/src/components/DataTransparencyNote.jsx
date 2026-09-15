function formatTimestamp(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function DataTransparencyNote({ meta }) {
  if (!meta) return null;

  const confirmed = meta.confirmed_stocks ?? 0;
  const total     = meta.total_stocks ?? 0;
  const confPct   = total > 0 ? Math.round((confirmed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#12182580]/80 px-4 py-3.5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {/* Info badge */}
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/10">
          <span className="font-mono text-[10px] font-bold text-accent">i</span>
        </div>

        <div className="text-[11px] leading-relaxed text-slate-500">
          <span className="font-semibold text-slate-300">
            {confirmed}/{total} stocks ({confPct}%)
          </span>{" "}
          are fully validated across 4 confirmation layers (Broker + Foreign + News + Filings).
          The remaining {total - confirmed} stocks carry Stage 1 price/volume signals only.
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] text-slate-600">
        {/* Mini donut indicator */}
        <div className="relative h-5 w-5 shrink-0">
          <svg viewBox="0 0 20 20" className="-rotate-90">
            <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
            <circle
              cx="10" cy="10" r="8" fill="none"
              stroke="#E5C05B" strokeWidth="3"
              strokeDasharray={`${(confPct / 100) * 50.3} 50.3`}
              strokeLinecap="round"
            />
          </svg>
        </div>
        {meta.generated_at && (
          <span>Snapshot {formatTimestamp(meta.generated_at)}</span>
        )}
      </div>
    </div>
  );
}
