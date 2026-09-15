import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ value, onChange }) {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const symbol = value.trim().toUpperCase();
    if (symbol) {
      navigate(`/stock/${encodeURIComponent(symbol)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center rounded-xl border bg-[#161B27]/80 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all duration-200 ${
        isFocused
          ? "border-accent/50 ring-2 ring-accent/10 shadow-glowGold"
          : "border-white/[0.08] hover:border-white/[0.15]"
      }`}
    >
      {/* Search Icon */}
      <svg
        className="h-4 w-4 shrink-0 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="Filter ticker symbol (e.g. JELI, VINS, KLIN)..."
        className="ml-3 min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-slate-400"
      />

      {/* Clear button if text exists */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mr-2 text-xs text-slate-400 hover:text-white"
        >
          ✕
        </button>
      )}

      {/* Direct Inspect CTA */}
      <button
        type="submit"
        disabled={!value.trim()}
        className="hidden rounded-md border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] font-medium text-slate-300 transition-colors hover:border-accent/40 hover:text-accent disabled:pointer-events-none disabled:opacity-30 sm:block"
      >
        Open Ticker ↗
      </button>
    </form>
  );
}
