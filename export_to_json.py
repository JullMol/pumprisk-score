import os
import json
import math
import numpy as np
import pandas as pd

CACHE_DIR = "cache"
OUTPUT_DIR = os.path.join("frontend", "public", "data")
TICKER_DIR = os.path.join(OUTPUT_DIR, "ticker")
NEWS_DETAIL_DIR = os.path.join(CACHE_DIR, "stage2", "news_detail")

os.makedirs(TICKER_DIR, exist_ok=True)

def clean_value(v):
    if pd.isna(v) if not isinstance(v, (list, dict)) else False:
        return None
    if isinstance(v, (np.integer,)):
        return int(v)
    if isinstance(v, (np.floating,)):
        return round(float(v), 6)
    if isinstance(v, (np.bool_,)):
        return bool(v)
    return v

def clean_row(row: dict) -> dict:
    return {k: clean_value(v) for k, v in row.items()}

def ordinal(n) -> str:
    n = int(round(n))
    if 10 <= (n % 100) <= 20:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"

def pluralize(n: int, singular: str, plural: str = None) -> str:
    plural = plural or f"{singular}s"
    return singular if n == 1 else plural

def format_idr_magnitude(value: float) -> str:
    abs_val = abs(value)
    if abs_val >= 1e12:
        return f"Rp {abs_val / 1e12:.2f}Tr"
    elif abs_val >= 1e9:
        return f"Rp {abs_val / 1e9:.1f}B"
    elif abs_val >= 1e6:
        return f"Rp {abs_val / 1e6:.1f}M"
    elif abs_val >= 1e3:
        return f"Rp {abs_val / 1e3:.1f}K"
    return f"Rp {abs_val:.0f}"

def interpret_price(return_zscore) -> str:
    if pd.isna(return_zscore):
        return "Price movement data is not available for this stock."
    direction = "risen" if return_zscore > 0 else "fallen"
    return (
        f"Today's price has {direction} at a level equivalent to a "
        f"{abs(return_zscore):.1f} standard-deviation move relative to this "
        f"stock's typical daily return over the last 20 trading days."
    )

def interpret_volume(volume_percentile) -> str:
    if pd.isna(volume_percentile):
        return "Volume data is not available for this stock."
    pct_rank = volume_percentile * 100
    return (
        f"Today's trading volume sits at the {ordinal(pct_rank)} percentile "
        f"compared to this stock's last 20 trading days."
    )

def interpret_broker(broker_net_dominance, top_accumulator, top_distributor, is_confirmed: bool):
    if pd.isna(broker_net_dominance):
        if not is_confirmed:
            return "This stock was not shortlisted for detailed broker analysis."
        return None
    if broker_net_dominance >= 0:
        return f"Broker activity shows net accumulation, led by broker {top_accumulator}."
    return f"Broker activity shows net distribution, led by broker {top_distributor}."

def interpret_foreign(foreign_net_total, is_confirmed: bool):
    if pd.isna(foreign_net_total):
        if not is_confirmed:
            return "This stock was not shortlisted for detailed foreign-flow analysis."
        return None
    direction = "net inflow" if foreign_net_total >= 0 else "net outflow"
    magnitude = format_idr_magnitude(foreign_net_total)
    return f"Foreign investors recorded a {direction} of {magnitude} over the past 90 days."

def interpret_fundamental(n_news, n_filings, is_confirmed: bool):
    news_missing = pd.isna(n_news)
    filings_missing = pd.isna(n_filings)

    if news_missing and filings_missing:
        if not is_confirmed:
            return "This stock was not shortlisted for detailed fundamental (news/filings) analysis."
        return None

    n_news = 0 if news_missing else int(n_news)
    n_filings = 0 if filings_missing else int(n_filings)

    if n_news > 0 or n_filings > 0:
        news_word = pluralize(n_news, "article")
        filing_word = pluralize(n_filings, "filing")
        return (
            f"This stock has {n_news} news {news_word} and {n_filings} "
            f"insider {filing_word} in the recent period that may explain "
            f"this movement."
        )
    return (
        "No news articles or insider filings were found that explain this "
        "movement - it lacks independent confirmation."
    )

SIGNAL_LABELS = {
    "broker_signal": "Broker Distribution",
    "foreign_signal": "Foreign Outflow",
    "price_anomaly_signal": "Price Spike",
    "volume_anomaly_signal": "Volume Spike",
    "fundamental_signal": "No Fundamental Support",
}

def dominant_signal_label(row) -> str | None:
    candidates = {}
    for col, label in SIGNAL_LABELS.items():
        val = row.get(col)
        if val is not None and not (isinstance(val, float) and math.isnan(val)):
            candidates[label] = val
    if not candidates:
        return None
    return max(candidates, key=candidates.get)

TIER_PRIORITY = {
    "HIGH RISK": 0,
    "MEDIUM RISK": 1,
    "WATCH": 2,
    "NORMAL": 3,
    "UNCONFIRMED": 4,
}

def build_leaderboard() -> pd.DataFrame:
    final = pd.read_csv(os.path.join(CACHE_DIR, "pumprisk_final_score.csv"))
    final["_tier_rank"] = final["risk_tier"].map(TIER_PRIORITY).fillna(99)
    final = final.sort_values(
        ["_tier_rank", "combined_score"], ascending=[True, False]
    ).drop(columns="_tier_rank").reset_index(drop=True)

    leaderboard = []
    for _, row in final.iterrows():
        entry = clean_row({
            "symbol": row["symbol"],
            "score": row.get("combined_score"),
            "risk_tier": row.get("risk_tier"),
            "is_confirmed": bool(row.get("is_confirmed", False)),
            "close": row.get("close"),
            "return_zscore": row.get("return_zscore"),
            "volume_percentile": row.get("volume_percentile"),
            "dominant_signal": dominant_signal_label(row),
            "sub_sector": row.get("sub_sector"),
        })
        leaderboard.append(entry)

    with open(os.path.join(OUTPUT_DIR, "leaderboard.json"), "w", encoding="utf-8") as f:
        json.dump(leaderboard, f, indent=2)

    print(f"leaderboard.json: {len(leaderboard)} stocks")
    return final

def build_meta(final: pd.DataFrame) -> None:
    thresholds_path = os.path.join(CACHE_DIR, "risk_tier_thresholds.csv")
    thresholds = {}
    if os.path.exists(thresholds_path):
        t = pd.read_csv(thresholds_path).iloc[0]
        thresholds = clean_row(t.to_dict())

    confirmed = final[final["is_confirmed"] == True]
    meta = {
        "generated_at": pd.Timestamp.now().isoformat(),
        "total_stocks": int(len(final)),
        "confirmed_stocks": int(len(confirmed)),
        "tier_distribution": confirmed["risk_tier"].value_counts().to_dict(),
        "thresholds": thresholds,
    }

    with open(os.path.join(OUTPUT_DIR, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    print(f"meta.json: {meta['total_stocks']} total, {meta['confirmed_stocks']} confirmed")

def load_news_headlines(symbol: str) -> list:
    path = os.path.join(NEWS_DETAIL_DIR, f"{symbol}.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def build_ticker_details(final: pd.DataFrame) -> None:
    history = pd.read_csv(
        os.path.join(CACHE_DIR, "daily_with_features.csv"), parse_dates=["date"]
    )

    final_by_symbol = final.set_index("symbol")
    n_written = 0

    for symbol, group in history.groupby("symbol"):
        group = group.sort_values("date")

        price_history = [
            clean_row({
                "date": d.strftime("%Y-%m-%d"),
                "close": c,
                "volume": v,
                "return_zscore": z,
            })
            for d, c, v, z in zip(
                group["date"], group["close"], group["volume"], group["return_zscore"]
            )
        ]

        if symbol not in final_by_symbol.index:
            continue
        row = final_by_symbol.loc[symbol]
        if isinstance(row, pd.DataFrame):
            row = row.iloc[0]

        is_confirmed = bool(row.get("is_confirmed", False))

        breakdown = {
            "price": {
                "signal": clean_value(row.get("price_anomaly_signal")),
                "interpretation": interpret_price(row.get("return_zscore")),
            },
            "volume": {
                "signal": clean_value(row.get("volume_anomaly_signal")),
                "interpretation": interpret_volume(row.get("volume_percentile")),
            },
            "broker": {
                "signal": clean_value(row.get("broker_signal")),
                "interpretation": interpret_broker(
                    row.get("broker_net_dominance"),
                    row.get("top_accumulator"),
                    row.get("top_distributor"),
                    is_confirmed,
                ),
            },
            "foreign": {
                "signal": clean_value(row.get("foreign_signal")),
                "interpretation": interpret_foreign(
                    row.get("foreign_net_total"), is_confirmed
                ),
            },
            "fundamental": {
                "signal": clean_value(row.get("fundamental_signal")),
                "interpretation": interpret_fundamental(
                    row.get("n_news_articles"), row.get("n_filings"), is_confirmed
                ),
            },
        }

        detail = {
            "symbol": symbol,
            "score": clean_value(row.get("combined_score")),
            "risk_tier": row.get("risk_tier"),
            "is_confirmed": is_confirmed,
            "percentile_vs_normal": clean_value(row.get("percentile_vs_normal")),
            "sub_sector": clean_value(row.get("sub_sector")),
            "news_headlines": load_news_headlines(symbol),
            "price_history": price_history,
            "breakdown": breakdown,
        }

        with open(os.path.join(TICKER_DIR, f"{symbol}.json"), "w", encoding="utf-8") as f:
            json.dump(detail, f, indent=2)
        n_written += 1

    print(f"ticker details: {n_written} files")

def main() -> None:
    final = build_leaderboard()
    build_meta(final)
    build_ticker_details(final)
    print("Export complete")

if __name__ == "__main__":
    main()