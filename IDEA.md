# PumpRisk Score - Idea & Strategy Document

**Sectors Hackathon 2026 · Track 03: Market Intelligence**

This document captures the full reasoning behind PumpRisk Score, from
problem framing through solution design before any UI/UX or technical
architecture decisions were made. See [`PRD.md`](./PRD.md) for the
product/technical spec that follows from this reasoning.

---

## 1. Problem Statement

> Amid 32 stock manipulation cases currently under OJK (Financial
> Services Authority) investigation and an upcoming regulation targeting
> capital market influencers, retail investors in IDX small-cap and
> micro-cap stocks lack an affordable surveillance tool to distinguish
> fundamentally-driven price movement from movement that is
> statistically anomalous relative to a stock's own historical behavior
> leading many buy decisions to be driven by FOMO rather than data.

Keywords deliberately embedded to connect with regulator language and
Track 03 judging criteria: *market surveillance, transparency,
statistical deviation, retail investor protection, small-cap risk.*

**Empirical validation of this problem**: IDX routinely suspends stocks
with the stated reason of *"a significant cumulative price increase...
as a cooling-down measure to protect investors"* an official mechanism
that proves this problem is real and already recognized by the
regulator, not a narrative we invented. See the [References](#references)
section for full sourcing.

---

## 2. Target & User

| Element | Detail |
|---|---|
| **Target ecosystem** | IDX retail investors, focused on small/micro-cap stocks (low free float, low liquidity, most exposed to price manipulation) |
| **Primary user (dominant)** | First-time retail investors & swing traders high FOMO exposure, driven by viral stock tips on Telegram/TikTok/X, no time or technical capacity to manually verify transaction anomalies |
| **Secondary user (supporting only)** | Financial educators / capital market analysts need objective, data-backed proof points; not the primary design target |

---

## 3. Issue Tree (MECE)

```
Root: Retail investors are exposed to anomalous stock movements in the small/micro-cap segment
├── 1. Investor side (demand-side)
│   ├── 1.1 Lack of access to affordable statistical analysis tools ⭐ PRIORITY
│   ├── 1.2 Psychological bias FOMO, herd behavior
│   └── 1.3 Low literacy in reading market signals
├── 2. Market structure & information side
│   ├── 2.1 Information asymmetry around free float & ownership concentration ⭐ PRIORITY
│   ├── 2.2 Structural characteristics of small-caps: low liquidity, easy to move ⭐ PRIORITY
│   └── 2.3 Regulatory enforcement lag (out of product scope)
└── 3. Bad-actor side
    ├── 3.1 Influencer/pump activity without disclosure (out of product scope)
    └── 3.2 Coordinated price manipulation (out of product scope)
```

**MECE check**: the three branches represent three distinct, non-overlapping
perspectives (investor, market structure, bad actors) that together cover
the full anatomy of the problem there is no meaningful fourth branch.

**Product priority**: branches 1.1 + 2.1 + 2.2 are addressed directly
(data available, high impact, high feasibility). 1.2 and 1.3 are
secondary benefits the "reality check" positioning naturally reduces
FOMO-driven decisions. 2.3, 3.1, 3.2 are deliberately out of scope
these are regulatory/enforcement domains, not something a data product
should claim to solve (also consistent with the hackathon's ban on
automated trading / investment recommendations).

---

## 4. Three-Layer Analysis

### Macro (PESTEL)
- **Political**: OJK's draft regulation (RPOJK) on influencer oversight
  is being prepared, targeted for enactment in H1 2026 supportive
  regulatory momentum, but no mandate yet for third-party platforms to
  provide public detection tools → a gap the product can fill.
- **Economic**: IHSG under pressure, worsened by the MSCI index freeze
  and simultaneous foreign/retail capital outflow low market trust
  makes an objective, data-driven tool valuable for "rebuilding trust."
- **Social**: strong culture of viral stock tips on Telegram/TikTok/X
  among younger investors; 17M+ registered capital market investor
  accounts (KSEI, as of mid-2025) and growing.
- **Technological**: Sectors API is a new enabler granular financial
  data previously exclusive to institutions is now accessible to
  independent developers.
- **Legal**: the product must position itself as an analysis tool, not
  an investment recommendation, to avoid legal exposure and comply with
  hackathon rules.

### Micro
- **Competitors**: brokerage app features (e.g. live orderbook views)
  are exclusive to each broker's own clients; platforms like Stockbit/RTI
  provide raw data but no explicit, cross-broker anomaly score. No
  consumer-facing, broker-neutral anomaly scoring tool currently exists.
- **Suppliers**: Sectors API is the sole data source a single-source
  dependency risk (addressed in Risk & Mitigation).
- **Channel**: better distributed through financial education
  communities/campuses than through brokerages (avoids competing
  directly with incumbent broker features).

### Internal (team)
- 1,500 Sectors API credits (down to ~151 remaining after build &
  testing), a small hackathon team with a Data Science background
  (strong in statistics/EDA, not deep learning) this shaped the
  decision to use a transparent statistical model rather than a
  Graph Neural Network.
- Deadline: 30 September 2026.

---

## 5. Solution Design

**What**: PumpRisk Score a 0–1 anomaly score per stock built from 4
statistical components, presented as a daily leaderboard plus a
per-ticker detail page.

**Objective**: Give first-time retail investors an objective second
opinion before executing a buy decision.

**Why**: A real market gap no affordable, broker-neutral surveillance
tool exists for small-cap stocks.

**How**: Fetch 180 days of history → compute z-scores/percentiles per
stock relative to its own baseline → combine 4 signals with adaptive
weighting → validate against ground-truth suspension data → present with
plain-language interpretation.

**Context / Conflict / Insight / Impact**
- *Context*: a pressured market, an active regulatory crackdown, 17M+
  exposed retail accounts.
- *Conflict*: the pull of viral trends vs. the lack of a fast
  verification tool.
- *Insight*: small-cap anomalies are more meaningfully read relative to
  a stock's own history, not relative to other stocks unlike a
  graph-correlation approach suited to highly-correlated blue-chips.
- *Impact*: an objective checkpoint before a FOMO-driven purchase.

**Explicit differentiation from Sectors' official GNN recipe** (stated
in the README and demo video): the transparent statistical approach was
a deliberate choice for idiosyncratic small-cap stocks, where a
correlation graph becomes too sparse to be meaningful not a
limitation of the team's capability.

**Business Model (lean canvas)**

| Element | Content |
|---|---|
| Value proposition | Free, broker-agnostic reality check before buying a small-cap stock |
| Channel | Financial education communities, campuses |
| Revenue (post-hackathon potential) | Freemium free basic leaderboard, paid detailed breakdown/watchlist |
| Key resources | Sectors API subscription, statistical model |
| Cost structure | API credits, lightweight hosting |

---

## 6. Methodology Summary (Execution Results)

| Stage | Result |
|---|---|
| Universe | 481 micro/small-cap stocks (log10 market cap quartile) |
| Data quality audit | 74 excluded (inactive/insufficient history) → 407 active stocks |
| Stage 1: Price + Volume anomaly | Full 407 stocks, z-score & percentile vs. 20-day baseline |
| Stage 2 shortlist | Top 63 stocks (budget-constrained by remaining API credits) |
| Stage 2: Broker dominance + Foreign flow + Fundamental divergence | 8/8 signals fetched successfully for 63 stocks |
| Combined score | `0.40×Price/Volume + 0.25×Broker + 0.20×Foreign + 0.15×Fundamental` |
| Backtesting | Out of 60 raw IDX suspension announcements, 31 matched our universe, and 27 had sufficient 20-day lookback history for point-in-time evaluation. Median score right before suspension = 0.552 vs. 0.271 normal-day median (statistically validated) |
| Calibrated thresholds | HIGH ≥ 0.578 · MEDIUM ≥ 0.449 · WATCH ≥ 0.309 · NORMAL < 0.309 (from empirical distributions, 74.1% recall at WATCH+) |
| Final tier distribution (63 confirmed stocks) | 1 HIGH · 29 MEDIUM · 25 WATCH · 8 NORMAL |

**Core principles maintained throughout**: stocks are compared to their
own history (not a correlation graph), anomaly captures both spikes and
crashes (`abs(return_zscore)`), broker dominance score avoids the
zero-sum trap, a two-stage funnel keeps API cost sustainable, and
inactive/low-quality data is excluded before scoring.

---

## 7. Risk & Mitigation

| Risk | Mitigation |
|---|---|
| API credit constraints | Precompute once, serve static data not continuous live refresh |
| Missing data for very small stocks (broker/foreign/news) | Adaptive weighting, fallback to Stage-1-only score with an "Unconfirmed" label |
| False positives on newly-listed stocks | Exclude stocks with < 30 days of trading history |
| Legal risk perceived as accusing a stock of manipulation | Neutral statistical language, persistent disclaimer on every output |
| Single-source dependency on Sectors API | Data cached locally as the product's single source of truth |
| Perceived as copying Sectors' official GNN recipe | Differentiation explicitly documented in README & demo video |

---

## References

1. CNBC Indonesia [*"OJK Buru Influencer Penggoreng Saham, Total Ada 32 Kasus"*](https://www.cnbcindonesia.com/market/20260224094441-17-713319/ojk-buru-influencer-penggoreng-saham-total-ada-32-kasus) (Feb 24, 2026)
2. Kontan [*"OJK Update Soal 32 Kasus Goreng Saham, Tak Semuanya Influencer"*](https://investasi.kontan.co.id/news/ojk-update-soal-32-kasus-goreng-saham-tak-semuanya-influencer) (Feb 23, 2026)
3. Academic journal [*"Fenomena Saham Gorengan dan Tantangan Penegakan Hukum di Pasar Modal Indonesia: Analisis terhadap 32 Kasus Manipulasi oleh OJK Tahun 2026"*](https://ejurnal.kampusakademik.co.id/index.php/jinu/article/view/9876)
4. Tempo (English) [*"IHSG Plunge Explained: What Happened, Why It Matters, and What Followed"*](https://en.tempo.co/read/2084169/ihsg-plunge-explained-what-happened-why-it-matters-and-what-followed) (Jan 2026)
5. Nikkei Asia [*"Indonesia stocks dive nearly 9% as MSCI freezes new inclusions"*](https://asia.nikkei.com/business/markets/equities/indonesia-stocks-dive-nearly-9-as-msci-freezes-new-inclusions) (Jan 28, 2026)
6. MSCI [Official announcement: Results of Consultation on Free Float Assessment of Indonesian Securities](https://app2.msci.com/webapp/index_ann/DocGet?pub_key=4YgVKowBJiE%3D&lang=en&format=html) (Jan 27, 2026)
7. The Diplomat [*"Indonesia's Stock Market Sell-Off, Explained"*](https://thediplomat.com/2026/02/indonesias-stock-market-sell-off-explained/) (Feb 2026)
8. Tempo (via iTiger) [*"IDX Reports 17 Million Investors in Indonesia's Capital Market"*](https://www.itiger.com/news/2549345866) (Jul 2025)
9. [Sectors API Documentation](https://docs.sectors.app) primary data source for all analysis in this project
