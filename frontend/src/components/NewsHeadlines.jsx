import { useState, useEffect } from "react";

// Curated high-resolution editorial imagery tailored for Indonesian corporate & market news
const TOPIC_IMAGES = {
  textile: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80",
  telecom: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80",
  mining: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=80",
  banking: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80",
  regulatory: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
  chart: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80",
  trading: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=80",
};

// Select realistic topic thumbnail based on title, URL, or publisher
function getCuratedImage(title = "", url = "") {
  const text = `${title} ${url}`.toLowerCase();
  if (text.includes("tekstil") || text.includes("textile") || text.includes("seragam") || text.includes("bell")) {
    return TOPIC_IMAGES.textile;
  }
  if (text.includes("telekomunikasi") || text.includes("infrastruktur") || text.includes("chip") || text.includes("bach")) {
    return TOPIC_IMAGES.telecom;
  }
  if (text.includes("hotel") || text.includes("dfam") || text.includes("pariwisata")) {
    return TOPIC_IMAGES.hotel;
  }
  if (text.includes("tambang") || text.includes("nikel") || text.includes("tins") || text.includes("coal")) {
    return TOPIC_IMAGES.mining;
  }
  if (text.includes("reksadana") || text.includes("syariah") || text.includes("fund") || text.includes("bank") || text.includes("bca")) {
    return TOPIC_IMAGES.banking;
  }
  if (text.includes("idx") || text.includes("ksei") || text.includes("announcement") || text.includes("klarifikasi") || text.includes(".pdf")) {
    return TOPIC_IMAGES.regulatory;
  }
  if (text.includes("anjlok") || text.includes("menguat") || text.includes("ihsg") || text.includes("rekomendasi")) {
    return TOPIC_IMAGES.chart;
  }
  return TOPIC_IMAGES.trading;
}

// Clean publisher display name
function getPublisherInfo(url = "") {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace("www.", "");
    if (host.includes("kontan.co.id")) return { name: "Kontan Investasi", host, tagColor: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
    if (host.includes("investor.id")) return { name: "Investor Daily", host, tagColor: "text-blue-400 border-blue-500/30 bg-blue-500/10" };
    if (host.includes("emitennews.com")) return { name: "EmitenNews", host, tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
    if (host.includes("idx.co.id")) return { name: "IDX Official Filing", host, tagColor: "text-purple-400 border-purple-500/30 bg-purple-500/10" };
    if (host.includes("bloombergtechnoz.com")) return { name: "Bloomberg Technoz", host, tagColor: "text-sky-400 border-sky-500/30 bg-sky-500/10" };
    if (host.includes("bisnis.com")) return { name: "Bisnis Indonesia", host, tagColor: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
    if (host.includes("antaranews.com")) return { name: "LKBN Antara", host, tagColor: "text-teal-400 border-teal-500/30 bg-teal-500/10" };
    return { name: host, host, tagColor: "text-slate-400 border-white/10 bg-white/5" };
  } catch {
    return { name: "Financial Media", host: "idx.co.id", tagColor: "text-slate-400 border-white/10 bg-white/5" };
  }
}

// Single rich OG link preview card
function NewsCard({ item, index }) {
  const [ogData, setOgData] = useState(null);
  const [imgSrc, setImgSrc] = useState(item.image || getCuratedImage(item.title, item.url));
  const pub = getPublisherInfo(item.url);
  const favicon = `https://www.google.com/s2/favicons?domain=${pub.host}&sz=32`;

  useEffect(() => {
    // Attempt fast Microlink fetch if URL is available
    if (!item.url || item.image) return;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 2500);

    fetch(`https://api.microlink.io/?url=${encodeURIComponent(item.url)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((json) => {
        if (json.status === "success" && json.data) {
          setOgData(json.data);
          if (json.data.image?.url) {
            setImgSrc(json.data.image.url);
          }
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));

    return () => {
      clearTimeout(timeout);
      ctrl.abort();
    };
  }, [item.url, item.image]);

  const displayTitle = ogData?.title || item.title || "Corporate Announcement";
  const displayDescription = ogData?.description || item.description || null;

  return (
    <a
      href={item.url || "#"}
      target={item.url ? "_blank" : undefined}
      rel="noreferrer noopener"
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#161B26]/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-[#1C2333] hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] ${
        !item.url ? "pointer-events-none opacity-80" : "cursor-pointer"
      }`}
    >
      {/* Thumbnail Image Container */}
      <div className="relative h-40 w-full overflow-hidden bg-[#0D1117]">
        <img
          src={imgSrc}
          alt={displayTitle}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => {
            // Fallback gracefully to curated image on broken URL
            setImgSrc(getCuratedImage(item.title, item.url));
          }}
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161B26] via-transparent to-black/30" />

        {/* Top Floating Badge: Publisher */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md border backdrop-blur-md px-2 py-1 text-[10px] font-medium shadow-sm"
             style={{ backgroundColor: "rgba(13, 17, 23, 0.8)" }}>
          <img
            src={favicon}
            alt=""
            className="h-3.5 w-3.5 rounded-sm object-contain"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <span className="font-mono font-semibold tracking-wide text-white">{pub.name}</span>
        </div>

        {/* Top Right: Date Badge */}
        {item.date && (
          <div className="absolute top-3 right-3 rounded-md border border-white/10 bg-black/60 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] text-slate-300">
            {item.date}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Headline / Title as Hyperlink */}
        <h4 className="font-sans text-sm font-semibold leading-snug text-slate-100 transition-colors duration-200 group-hover:text-accent line-clamp-2">
          {displayTitle}
        </h4>

        {/* Optional Excerpt */}
        {displayDescription ? (
          <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
            {displayDescription}
          </p>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-slate-500 italic line-clamp-2">
            Direct IDX disclosure coverage and market intelligence scan.
          </p>
        )}

        {/* Card Footer: Domain + External Indicator */}
        <div className="mt-auto pt-3.5 flex items-center justify-between border-t border-white/[0.06] text-[11px]">
          <span className="font-mono text-slate-500 truncate">{pub.host}</span>
          <span className="inline-flex items-center gap-1 font-mono font-medium text-accent transition-transform duration-200 group-hover:translate-x-0.5">
            <span>Read Story</span>
            <span className="text-xs">↗</span>
          </span>
        </div>
      </div>
    </a>
  );
}

export default function NewsHeadlines({ headlines = [], tickerSymbol = "" }) {
  if (!headlines || !headlines.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.08] bg-white/[0.01] p-6 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04] text-slate-400">
          📰
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-300">
          No Adverse Media or Regulatory Disclosures Flagged
        </p>
        <p className="mt-1 text-[11px] text-slate-500 max-w-md mx-auto">
          Surveillance scan found no high-divergence news or corporate announcements for{" "}
          <strong className="text-slate-400">{tickerSymbol || "this ticker"}</strong> during the monitoring period.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {headlines.map((item, idx) => (
        <NewsCard key={idx} item={item} index={idx} />
      ))}
    </div>
  );
}
