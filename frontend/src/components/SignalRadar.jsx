import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const AXIS_META = {
  price:       { label: "Price",       color: "#FF4D4D" },
  volume:      { label: "Volume",      color: "#EAB308" },
  broker:      { label: "Broker",      color: "#38BDF8" },
  foreign:     { label: "Foreign",     color: "#10B981" },
  fundamental: { label: "Fundamental", color: "#A78BFA" },
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const meta = AXIS_META[item.key] ?? {};
  return (
    <div className="rounded-lg border border-white/[0.12] bg-[#1C2333]/95 px-3 py-2.5 shadow-xl backdrop-blur-md">
      <div className="font-mono text-[11px] text-slate-400 mb-0.5">{meta.label ?? item.axis}</div>
      <div
        className="font-mono text-lg font-bold"
        style={{ color: meta.color ?? "#E5C05B" }}
      >
        {item.value}
        <span className="text-xs text-slate-500 font-normal"> / 100</span>
      </div>
    </div>
  );
}

export default function SignalRadar({ breakdown }) {
  const data = Object.entries(breakdown || {}).map(([key, item]) => {
    const rawSignal = item?.signal;
    const value = rawSignal == null ? 0 : Math.round(rawSignal * 100);
    return {
      key,
      axis: AXIS_META[key]?.label ?? key,
      value,
      fullMark: 100,
    };
  });

  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-xs text-slate-600">
        No signal data available
      </div>
    );
  }

  return (
    <div className="relative h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="62%"
          margin={{ top: 24, right: 48, bottom: 24, left: 48 }}
        >
          <PolarGrid
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="2 4"
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={{
              fontSize: 11,
              fill: "#64748B",
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
            }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Anomaly Signal"
            dataKey="value"
            stroke="#E5C05B"
            strokeWidth={1.5}
            fill="#E5C05B"
            fillOpacity={0.18}
            dot={{ r: 3, fill: "#E5C05B", fillOpacity: 0.9, stroke: "none" }}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
