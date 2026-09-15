import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const THRESHOLD = 2.0;

function AnomalyDot({ cx, cy, payload }) {
  if (payload.return_zscore == null || Math.abs(payload.return_zscore) <= THRESHOLD) {
    return null;
  }
  const isSpike = payload.return_zscore > 0;
  const color = isSpike ? "#FF4D4D" : "#38BDF8";

  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={4} fill={color} stroke="#FFFFFF" strokeWidth={1.5} />
    </g>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const isAnomalous = data.return_zscore != null && Math.abs(data.return_zscore) > THRESHOLD;

  return (
    <div className="rounded-xl border border-white/[0.15] bg-[#141924]/95 p-3.5 shadow-2xl backdrop-blur-md font-sans">
      <div className="border-b border-white/[0.08] pb-2">
        <span className="font-mono text-xs font-semibold text-slate-300">
          {label}
        </span>
        {isAnomalous && (
          <span className="ml-2 rounded bg-red-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-red-400 border border-red-500/30">
            {data.return_zscore > 0 ? "PRICE SPIKE" : "PRICE CRASH"} {Math.abs(data.return_zscore).toFixed(1)}σ
          </span>
        )}
      </div>

      <div className="mt-2.5 space-y-1.5 font-mono text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Close Price:</span>
          <span className="font-bold text-white">
            Rp {data.close?.toLocaleString("en-US")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-400">Volume:</span>
          <span className="text-slate-200">
            {data.volume?.toLocaleString("en-US")} shares
          </span>
        </div>
        {data.return_zscore != null && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Return Z-Score:</span>
            <span className={isAnomalous ? "font-bold text-red-400" : "text-slate-300"}>
              {data.return_zscore.toFixed(2)}σ
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PriceVolumeChart({ history = [] }) {
  const data = history.slice(-90); // display up to last 90 trading sessions

  return (
    <div className="h-[280px] sm:h-[380px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 15, right: 15, left: -5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E5C05B" stopOpacity={0.28} />
              <stop offset="85%" stopColor="#E5C05B" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(255, 255, 255, 0.06)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#64748B", fontFamily: "'IBM Plex Mono'" }}
            tickFormatter={(d) => d?.slice(5)}
            interval="preserveStartEnd"
            minTickGap={35}
            stroke="rgba(255, 255, 255, 0.1)"
          />

          <YAxis
            yAxisId="price"
            tick={{ fontSize: 10, fill: "#94A3B8", fontFamily: "'IBM Plex Mono'" }}
            stroke="rgba(255, 255, 255, 0.1)"
            domain={["auto", "auto"]}
            tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
          />

          <YAxis
            yAxisId="vol"
            orientation="right"
            hide
            domain={[0, "dataMax * 3.5"]}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Volume Bar Underlay */}
          <Bar
            yAxisId="vol"
            dataKey="volume"
            fill="url(#volFill)"
            barSize={4}
            radius={[2, 2, 0, 0]}
            isAnimationActive={true}
          />

          {/* Price Smooth Area & Line */}
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="close"
            stroke="#E5C05B"
            strokeWidth={2.5}
            fill="url(#priceFill)"
            dot={<AnomalyDot />}
            activeDot={{ r: 5, fill: "#FFFFFF", stroke: "#E5C05B", strokeWidth: 2 }}
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
