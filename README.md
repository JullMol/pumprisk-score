# 📊 PumpRisk Score

### *Detecting abnormal stock movements before retail investors get trapped.*

**Sectors Hackathon 2026 · Track 03 - Market Intelligence**

![Track](https://img.shields.io/badge/Track-Market%20Intelligence-1a5f2e?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![Data Source](https://img.shields.io/badge/Data-Sectors%20API-1a1a2e?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## What is PumpRisk Score?

**PumpRisk Score** turns raw Indonesian stock market data into a single,
explainable anomaly score for micro and small-cap stocks on the IDX. The
segment most exposed to pump-and-dump activity and least covered by
existing surveillance tools.

We don't tell you *"this stock is being manipulated."* We tell you:

> *"This stock's recent price and volume behavior is statistically unusual
> relative to its own historical baseline, and lacks independent
> confirmation from broker flow, foreign flow, or fundamental news."*

That distinction matters. It's the difference between an accusation and
an analysis and it's why this tool is safe, defensible, and genuinely
useful for retail investors who don't have time to dig through raw
transaction data before hitting "buy."

> ⚠️ **PumpRisk Score is a statistical analysis tool, not investment
> advice.** It does not recommend buying, selling, or avoiding any
> security. All investment decisions remain the user's sole
> responsibility.

---

## Why This Exists

Indonesia's capital market has had a rough stretch in 2026:

- **Regulatory crackdown**: OJK (Indonesia's Financial Services Authority)
  is currently investigating **32 stock manipulation cases**, involving
  corporations, individuals, and social media influencers with one
  influencer already fined Rp 5.25 billion.
  📰 [CNBC Indonesia](https://www.cnbcindonesia.com/market/20260224094441-17-713319/ojk-buru-influencer-penggoreng-saham-total-ada-32-kasus) ·
  📰 [Kontan](https://investasi.kontan.co.id/news/ojk-update-soal-32-kasus-goreng-saham-tak-semuanya-influencer) ·
  📄 [Academic analysis of the 32 cases](https://ejurnal.kampusakademik.co.id/index.php/jinu/article/view/9876)

- **A market-wide trust crisis**: In January 2026, MSCI froze index
  changes for Indonesian securities over free-float and ownership
  transparency concerns, triggering an ~8-9% single-day crash and
  wiping out roughly USD 80 billion in market value.
  📰 [Tempo English](https://en.tempo.co/read/2084169/ihsg-plunge-explained-what-happened-why-it-matters-and-what-followed) ·
  📰 [Nikkei Asia](https://asia.nikkei.com/business/markets/equities/indonesia-stocks-dive-nearly-9-as-msci-freezes-new-inclusions) ·
  📄 [MSCI official announcement](https://app2.msci.com/webapp/index_ann/DocGet?pub_key=4YgVKowBJiE%3D&lang=en&format=html)

- **A market increasingly driven by retail, not institutions**: retail
  investors accounted for roughly **50% of daily trading activity in
  2025**, up from 33% the year before meaning millions of
  inexperienced participants are directly exposed to whatever happens
  next.
  📰 [The Diplomat](https://thediplomat.com/2026/02/indonesias-stock-market-sell-off-explained/) ·
  📰 [IDX investor count (17M+ SIDs)](https://www.itiger.com/news/2549345866)

There is currently **no free, broker-agnostic tool** that lets an
everyday retail investor check whether a stock's movement is
statistically unusual before they act on a tip from Telegram, TikTok, or
X. PumpRisk Score is our attempt to fill that gap built entirely on
[Sectors API](https://sectors.app) data.

---

## How It Works (in one sentence)

We compare every micro/small-cap stock **against its own historical
behavior** not against other stocks across four independent signals
(price anomaly, volume anomaly, broker/foreign flow, and fundamental
news divergence), then validate the resulting score against **27 historical
IDX trading suspensions** (out of 60 raw announcements in the period,
31 of which matched our universe) to prove it's not just noise.

For the full story problem framing, target users, root-cause analysis,
three-layer market analysis, and solution design see
**[`IDEA.md`](./IDEA.md)**.

For the technical product spec architecture, UI/UX, MVP scope, and data
pipeline see **[`PRD.md`](./PRD.md)**.

---

## Validation Snapshot

We didn't just build a scoring formula and hope for the best. We
backtested it:

| Metric | Result |
|---|---|
| Universe analyzed | 481 IDX micro/small-cap stocks |
| Raw historical suspension announcements (Mar–Sep 2026) | 60 |
| ...of which matched our universe | 31 |
| ...of which had sufficient lookback history to score | 27 |
| Median PumpRisk score, normal trading days | 0.271 |
| Median PumpRisk score, day before an actual IDX suspension (27 cases) | **0.552** |
| Those 27 historical suspensions flagged at ≥ WATCH tier | 74.1% |

The gap between 0.271 and 0.552 is the evidence. Out of 60 raw suspension
announcements, 31 involved a stock in our micro/small-cap universe, and 27
of those had at least 20 trading days of prior history enough for a
reliable point-in-time score. Stocks that IDX independently suspended for
*"significant cumulative price increases"* scored, on average, more than
double what a typical trading day looks like using our model, computed
entirely from Sectors API data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Data source | [Sectors API](https://docs.sectors.app) |
| Data pipeline & scoring | Python, pandas, numpy (Jupyter notebooks) |
| Frontend | React (Vite), TailwindCSS, Framer Motion, Recharts |
| Deployment | Static site (Vercel/Netlify) no live backend required |

---

## Repository Structure

```
├── notebooks/
│   ├── pumprisk_stage1_fetch.py               # universe + historical data fetch
│   ├── pumprisk_stage2_feature_engineering.ipynb  # data audit + anomaly scoring
│   ├── pumprisk_stage2_fetch.py                # broker/foreign/news/filings fetch
│   └── pumprisk_stage3_final_score.ipynb       # combined score + backtesting
├── cache/                                      # cached data outputs (gitignored raw, sample included)
├── frontend/                                   # React web app
├── IDEA.md                                     # problem, users, root-cause & solution design
└── README.md                                   # you are here
```

---

## Team

Built for **Sectors Hackathon 2026 Track 03: Market Intelligence**.

---

## Disclaimer

PumpRisk Score is an analytical tool built for educational and research
purposes as part of a hackathon submission. It is **not** a licensed
financial advisory product, does not execute trades, and does not
provide investment recommendations. All statistics are derived from
publicly available Sectors API data. Always consult a licensed
financial advisor before making investment decisions.
