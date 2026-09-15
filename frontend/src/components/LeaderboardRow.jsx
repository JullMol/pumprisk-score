import { Link } from "react-router-dom";
import { tierConfig } from "../lib/tiers";
import { formatPrice, formatScore } from "../lib/format";

export default function LeaderboardRow({ stock, rank }) {
  const tier = tierConfig(stock.risk_tier);
  const scorePct = Math.max(0, Math.min(100, (stock.score ?? 0) * 100));
  const isHighRisk = stock.risk_tier === "HIGH RISK";

  return (
    <Link
      to={`/stock/${encodeURIComponent(stock.symbol)}`}
      className="group relative flex flex-col gap-2.5 border-b border-white/[0.05] p-3.5 transition-all duration-200
        hover:bg-white/[0.03]
        sm:grid sm:grid-cols-[44px_130px_110px_minmax(180px,1fr)_130px_120px_28px] sm:items-center sm:gap-4 sm:px-4 sm:py-3.5"
    >
      {/* Left edge accent on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r"
        style={{ backgroundColor: tier.color }}
      />

      {/* Rank (desktop) */}
      <div className="hidden font-mono text-xs font-medium text-slate-600 sm:block">
        {String(rank).padStart(2, "0")}
      </div>

      {/* Ticker & Sub-sector & Mobile Price */}
      <div className="flex items-center justify-between sm:block sm:min-w-0">
        <div className="flex items-center gap-2">
          <span className="sm:hidden font-mono text-[10px] font-semibold text-slate-500">#{rank}</span>
          <div className="flex items-center gap-1.5">
            {isHighRisk && (
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: tier.color, boxShadow: `0 0 6px ${tier.color}` }}
              />
            )}
            <span className="font-mono text-sm font-bold tracking-wide text-white group-hover:text-accent transition-colors">
              {stock.symbol}
            </span>
          </div>
          {/* Price inline on mobile */}
          <span className="sm:hidden font-mono text-xs font-semibold text-slate-300 ml-1">
            {formatPrice(stock.close)}
          </span>
        </div>
        <div className="truncate text-[11px] text-slate-500 sm:mt-0.5 sm:block max-w-[150px] sm:max-w-none">
          {stock.sub_sector || "IDX Micro/Small-Cap"}
        </div>
      </div>

      {/* Latest Close Price (desktop) */}
      <div className="hidden sm:block">
        <span className="font-mono text-xs text-slate-300">
          {formatPrice(stock.close)}
        </span>
      </div>

      {/* Score bar + readout */}
      <div className="min-w-0 sm:pr-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="truncate text-[11px] text-slate-400">
            {stock.dominant_signal || "Composite"}
          </span>
          <span className="font-mono text-xs font-bold text-white shrink-0">
            {formatScore(stock.score)}
          </span>
        </div>
        <div className="bar-track">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${scorePct}%`,
              backgroundColor: tier.color,
              boxShadow: `0 0 8px ${tier.color}55`,
            }}
          />
        </div>
      </div>

      {/* Dominant Signal Tag (desktop) */}
      <div className="hidden sm:block">
        <span
          className="inline-block truncate rounded px-2 py-0.5 font-mono text-[10px] border"
          style={{
            color: `${tier.color}cc`,
            backgroundColor: `${tier.color}10`,
            borderColor: `${tier.color}25`,
          }}
        >
          {stock.dominant_signal || "Multi-signal"}
        </span>
      </div>

      {/* Risk Tier Badge & Mobile Signal */}
      <div className="flex items-center justify-between sm:justify-end">
        <span
          className="inline-block truncate rounded px-2 py-0.5 font-mono text-[9px] border sm:hidden"
          style={{
            color: `${tier.color}cc`,
            backgroundColor: `${tier.color}10`,
            borderColor: `${tier.color}25`,
          }}
        >
          {stock.dominant_signal || "Multi-signal"}
        </span>

        <div className="text-right">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold"
            style={{
              color: tier.color,
              backgroundColor: `${tier.color}12`,
              border: `1px solid ${tier.color}30`,
            }}
          >
            <span
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: tier.color }}
            />
            {tier.label}
          </span>
          {!stock.is_confirmed && (
            <div className="mt-0.5 font-mono text-[9px] text-slate-600">Stage 1</div>
          )}
        </div>
      </div>

      {/* Arrow (desktop) */}
      <div className="hidden text-right font-mono text-sm text-slate-700 transition-all duration-200 group-hover:text-accent group-hover:translate-x-0.5 sm:block">
        ↗
      </div>
    </Link>
  );
}
