const TABS = [
  { key: "all",          label: "All Stocks",   dot: null,        activeStyle: "border-accent/40 bg-accent/10 text-accent" },
  { key: "HIGH RISK",    label: "High Risk",    dot: "#FF5757",   activeStyle: "border-red-500/40 bg-red-500/10 text-red-400" },
  { key: "MEDIUM RISK",  label: "Medium Risk",  dot: "#F59E0B",   activeStyle: "border-amber-500/40 bg-amber-500/10 text-amber-400" },
  { key: "WATCH",        label: "Watch",        dot: "#EAB308",   activeStyle: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400" },
  { key: "NORMAL",       label: "Normal",       dot: "#34D399",   activeStyle: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400" },
  { key: "unconfirmed",  label: "Unconfirmed",  dot: "#94A3B8",   activeStyle: "border-slate-400/30 bg-slate-400/8 text-slate-300" },
];

export default function RiskFilterTabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium tracking-wide transition-all duration-150 whitespace-nowrap ${
              isActive
                ? `${tab.activeStyle} shadow-sm`
                : "border-white/[0.07] bg-[#1C2333]/60 text-slate-400 hover:border-white/[0.13] hover:bg-[#1F2940]/80 hover:text-slate-200"
            }`}
          >
            {tab.dot && (
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor: tab.dot,
                  boxShadow: isActive ? `0 0 5px ${tab.dot}` : "none",
                }}
              />
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
