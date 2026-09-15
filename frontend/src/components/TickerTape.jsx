import { Link } from "react-router-dom";
import { tierConfig } from "../lib/tiers";
import { formatPrice, formatScore } from "../lib/format";

function TickerItem({ stock }) {
  const tier = tierConfig(stock.risk_tier);

  return (
    <Link
      to={`/stock/${encodeURIComponent(stock.symbol)}`}
      className="inline-flex items-center gap-2 rounded border border-transparent px-3 py-1.5 font-mono text-[11px] transition-all hover:border-white/[0.1] hover:bg-white/[0.04]"
    >
      {/* Score dot */}
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: tier.color, boxShadow: `0 0 5px ${tier.color}` }}
      />
      <span className="font-bold text-slate-200 tracking-wide">{stock.symbol}</span>
      <span className="text-slate-500">{formatPrice(stock.close)}</span>
      <span className="font-semibold" style={{ color: tier.color }}>
        {formatScore(stock.score)}
      </span>
    </Link>
  );
}

export default function TickerTape({ stocks = [] }) {
  const items = stocks.slice(0, 18);
  if (!items.length) return null;

  return (
    <div className="border-b border-white/[0.05] bg-[#0A0D13]/80 py-1.5 backdrop-blur-md overflow-hidden">
      <div className="flex w-full items-center">
        {/* Label */}
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-white/[0.07] bg-[#0A0D13] px-4 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-accent live-pulse-radar" />
          <span className="text-slate-500">Radar</span>
        </div>

        {/* Marquee */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-ticker gap-0 px-2">
            {[...items, ...items].map((stock, i) => (
              <TickerItem key={`${stock.symbol}-${i}`} stock={stock} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
