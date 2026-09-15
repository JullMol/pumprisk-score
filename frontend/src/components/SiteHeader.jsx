import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function SiteHeader() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Market Leaderboard", path: "/" },
    { label: "Methodology", path: "/methodology" },
    { label: "About & Context", path: "/about" },
  ];

  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0D1117]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <Link to="/" className="group flex items-center gap-2.5 sm:gap-3" onClick={() => setMobileMenuOpen(false)}>
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 shadow-glowGold transition-transform group-hover:scale-105">
            <span className="font-mono text-sm sm:text-base font-bold text-accent">PR</span>
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 live-pulse-radar" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-white group-hover:text-accent transition-colors">
                PumpRisk™
              </span>
              <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium text-cyan-400">
                SNAPSHOT 2026
              </span>
            </div>
            <div className="hidden font-mono text-[9px] sm:block sm:text-[10px] tracking-wider text-slate-400">
              IDX MARKET INTELLIGENCE SURVEILLANCE
            </div>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "border border-accent/30 bg-accent/10 text-accent shadow-sm"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Telemetry & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden text-right lg:block">
            <div className="font-mono text-[10px] text-slate-400">
              SNAPSHOT DATE
            </div>
            <div className="font-mono text-xs font-semibold text-slate-200">
              {currentDate}
            </div>
          </div>
          <span className="hidden h-5 w-px bg-white/[0.1] lg:block" />
          <a
            href="https://sectors.app"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-accent/40 hover:text-white"
          >
            <span className="font-mono text-[11px] text-accent">Sectors</span>
            <span className="text-[10px] text-slate-400">API</span>
            <span className="text-xs text-slate-500">↗</span>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-slate-300 sm:hidden hover:border-white/[0.2] hover:text-white"
          >
            {mobileMenuOpen ? (
              <span className="text-base font-bold">✕</span>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.08] bg-[#10141D] px-4 py-3 sm:hidden shadow-2xl animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border border-accent/30 bg-accent/10 text-accent font-semibold"
                      : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="font-mono text-xs text-accent">●</span>}
                </Link>
              );
            })}
            <a
              href="https://sectors.app"
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-xs text-slate-400"
            >
              <span className="font-mono text-accent">Powered by Sectors Financial API</span>
              <span>↗</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
