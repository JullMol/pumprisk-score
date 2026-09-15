import { formatPrice } from "../lib/format";

function formatCompactVolume(num) {
  if (num == null) return "—";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return Math.round(num).toLocaleString("en-US");
}

export default function RangeStats({ history = [] }) {
  const closes = history.map((h) => h.close).filter((v) => v != null);
  const volumes = history.map((h) => h.volume).filter((v) => v != null);

  if (!closes.length) return null;

  const high = Math.max(...closes);
  const low = Math.min(...closes);
  const current = closes[closes.length - 1];
  const avgVol = volumes.reduce((a, b) => a + b, 0) / Math.max(volumes.length, 1);
  const maxVol = Math.max(...volumes);
  const days = history.length;

  // Current price position in range (0–100%)
  const rangePct = high !== low ? Math.max(0, Math.min(100, Math.round(((current - low) / (high - low)) * 100))) : 50;

  return (
    <div className="space-y-3">
      {/* Visual Range Position Bar */}
      <div className="rounded-xl border border-white/[0.07] bg-[#161B26]/70 p-3.5">
        <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase tracking-wider">{days}D Low</span>
            <span className="font-semibold text-sky-400">{formatPrice(low)}</span>
          </div>
          <div className="text-center">
            <span className="text-slate-500 text-[10px] block uppercase tracking-wider">Range Position</span>
            <span className="font-bold text-accent">{rangePct}%</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-[10px] block uppercase tracking-wider">{days}D High</span>
            <span className="font-semibold text-rose-400">{formatPrice(high)}</span>
          </div>
        </div>

        {/* Range Track with marker */}
        <div className="relative h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
            style={{ width: `${rangePct}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/[0.05] pt-2">
          <span>Current: <strong className="text-white">{formatPrice(current)}</strong></span>
          <span>Spread: <strong className="text-slate-300">{high > low ? `+${Math.round(((high - low) / low) * 100)}%` : "0%"}</strong></span>
        </div>
      </div>

      {/* 2x2 Grid for Metric Cards — never overflows in 380px-400px sidebar */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Peak High */}
        <div className="rounded-xl border border-rose-500/15 bg-[#161B26]/60 p-3 transition-colors hover:border-rose-500/30">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span className="text-rose-400 font-bold">↑</span>
            <span className="truncate">{days}D High</span>
          </div>
          <div className="mt-1.5 font-mono text-base font-bold text-white whitespace-nowrap">
            {formatPrice(high)}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
            Peak close
          </div>
        </div>

        {/* Trough Low */}
        <div className="rounded-xl border border-sky-500/15 bg-[#161B26]/60 p-3 transition-colors hover:border-sky-500/30">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span className="text-sky-400 font-bold">↓</span>
            <span className="truncate">{days}D Low</span>
          </div>
          <div className="mt-1.5 font-mono text-base font-bold text-white whitespace-nowrap">
            {formatPrice(low)}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
            Trough close
          </div>
        </div>

        {/* Avg Volume */}
        <div className="rounded-xl border border-emerald-500/15 bg-[#161B26]/60 p-3 transition-colors hover:border-emerald-500/30">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span className="text-emerald-400 font-bold">▲</span>
            <span className="truncate">Avg Daily Vol</span>
          </div>
          <div className="mt-1.5 font-mono text-base font-bold text-white whitespace-nowrap">
            {formatCompactVolume(avgVol)}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
            {Math.round(avgVol).toLocaleString("en-US")} shs
          </div>
        </div>

        {/* Peak Volume */}
        <div className="rounded-xl border border-amber-500/15 bg-[#161B26]/60 p-3 transition-colors hover:border-amber-500/30">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span className="text-amber-400 font-bold">◈</span>
            <span className="truncate">Max Volume</span>
          </div>
          <div className="mt-1.5 font-mono text-base font-bold text-white whitespace-nowrap">
            {formatCompactVolume(maxVol)}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5 truncate">
            Peak session
          </div>
        </div>
      </div>
    </div>
  );
}
