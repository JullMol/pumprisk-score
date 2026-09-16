import os
import numpy as np
import pandas as pd
from scipy.stats import spearmanr

CACHE_DIR = "cache"
ROLLING_WINDOW = 20

def compute_point_in_time(group: pd.DataFrame, window: int = ROLLING_WINDOW) -> pd.DataFrame:
    g = group.sort_values("date").copy()
    g["return"] = g["close"].pct_change()
    roll_mean = g["return"].rolling(window, min_periods=10).mean()
    roll_std = g["return"].rolling(window, min_periods=10).std()
    g["return_zscore"] = (g["return"] - roll_mean) / (roll_std + 1e-8)
    g["volume_percentile"] = g["volume"].rolling(window, min_periods=10).apply(
        lambda x: x.rank(pct=True).iloc[-1] if len(x) > 0 else np.nan, raw=False
    )
    return g

def minmax_norm(s: pd.Series) -> pd.Series:
    valid = s.dropna()
    if len(valid) < 2 or valid.max() == valid.min():
        return pd.Series(0.5, index=s.index)
    return (s - valid.min()) / (valid.max() - valid.min())


def run_level1():
    print("LEVEL 1: Stage-1 (Price/Volume) Weight Sensitivity vs Ground Truth")

    raw = pd.read_csv(os.path.join(CACHE_DIR, "daily_all_combined.csv"), parse_dates=["date"])
    raw = raw.sort_values(["symbol", "date"])
    raw_feat = raw.groupby("symbol", group_keys=False).apply(compute_point_in_time)

    raw_feat["price_anomaly_signal"] = minmax_norm(raw_feat["return_zscore"].abs())
    raw_feat["volume_anomaly_signal"] = raw_feat["volume_percentile"].fillna(0.5)

    matched_df = pd.read_csv(os.path.join(CACHE_DIR, "backtest_point_in_time.csv"))
    matched_df["last_trading_day_before"] = pd.to_datetime(matched_df["last_trading_day_before"])

    # Re-attach price/volume signals to the exact (symbol, date) pairs used in the original backtest
    lookup = raw_feat.set_index(["symbol", "date"])
    price_sigs, vol_sigs = [], []
    for _, row in matched_df.iterrows():
        key = (row["symbol"], row["last_trading_day_before"])
        if key in lookup.index:
            r = lookup.loc[key]
            price_sigs.append(r["price_anomaly_signal"] if not isinstance(r, pd.DataFrame) else r["price_anomaly_signal"].iloc[0])
            vol_sigs.append(r["volume_anomaly_signal"] if not isinstance(r, pd.DataFrame) else r["volume_anomaly_signal"].iloc[0])
        else:
            price_sigs.append(np.nan)
            vol_sigs.append(np.nan)
    matched_df["price_anomaly_signal"] = price_sigs
    matched_df["volume_anomaly_signal"] = vol_sigs
    matched_df = matched_df.dropna(subset=["price_anomaly_signal", "volume_anomaly_signal"])

    results = []
    for price_w in [0.3, 0.4, 0.5, 0.6, 0.7]:
        vol_w = 1 - price_w
        baseline_w = price_w * raw_feat["price_anomaly_signal"] + vol_w * raw_feat["volume_anomaly_signal"]
        suspended_w = price_w * matched_df["price_anomaly_signal"] + vol_w * matched_df["volume_anomaly_signal"]

        baseline_median = baseline_w.median()
        suspended_median = suspended_w.median()
        watch_threshold_w = np.percentile(baseline_w.dropna(), 75)
        recall_w = (suspended_w >= watch_threshold_w).mean()

        results.append({
            "price_weight": price_w,
            "volume_weight": vol_w,
            "baseline_median": round(baseline_median, 3),
            "suspended_median": round(suspended_median, 3),
            "gap_ratio": round(suspended_median / baseline_median, 2),
            "recall_at_watch": round(recall_w * 100, 1),
        })

    results_df = pd.DataFrame(results)
    print(f"\nTested on the same {len(matched_df)} ground-truth suspension cases:\n")
    print(results_df.to_string(index=False))

    results_df.to_csv(os.path.join(CACHE_DIR, "sensitivity_level1_stage1.csv"), index=False)
    print(f"\nSaved to cache/sensitivity_level1_stage1.csv")
    return results_df

def run_level2():
    print("LEVEL 2: 4-Signal Blend Weight Sensitivity - Ranking Stability")

    final = pd.read_csv(os.path.join(CACHE_DIR, "pumprisk_final_score.csv"))
    confirmed = final[final["is_confirmed"] == True].copy()  # noqa: E712
    print(f"\nTested on {len(confirmed)} currently-confirmed stocks (today's snapshot)\n")

    schemes = {
        "Baseline (current)": {"stage1": 0.40, "broker": 0.25, "foreign": 0.20, "fundamental": 0.15},
        "Equal": {"stage1": 0.25, "broker": 0.25, "foreign": 0.25, "fundamental": 0.25},
        "Market-focused": {"stage1": 0.50, "broker": 0.20, "foreign": 0.20, "fundamental": 0.10},
        "Flow-focused": {"stage1": 0.35, "broker": 0.30, "foreign": 0.25, "fundamental": 0.10},
    }

    scheme_scores = {}
    for name, w in schemes.items():
        scheme_scores[name] = (
            w["stage1"] * confirmed["stage1_score"]
            + w["broker"] * confirmed["broker_signal"]
            + w["foreign"] * confirmed["foreign_signal"]
            + w["fundamental"] * confirmed["fundamental_signal"]
        )

    scores_df = pd.DataFrame(scheme_scores)
    scores_df.insert(0, "symbol", confirmed["symbol"].values)

    baseline_rank = scores_df["Baseline (current)"].rank(ascending=False)

    print("Top 5 flagged stock under each weighting scheme:\n")
    for name in schemes:
        top5 = scores_df.nlargest(5, name)["symbol"].tolist()
        print(f"  {name:<20}: {top5}")

    print("\nSpearman rank correlation vs Baseline scheme:")
    correlations = {}
    for name in schemes:
        if name == "Baseline (current)":
            continue
        corr, _ = spearmanr(baseline_rank, scores_df[name].rank(ascending=False))
        correlations[name] = round(corr, 3)
        print(f"  {name:<20}: rho = {corr:.3f}")

    scores_df.to_csv(os.path.join(CACHE_DIR, "sensitivity_level2_blend.csv"), index=False)
    print(f"\nSaved to cache/sensitivity_level2_blend.csv")
    return scores_df, correlations

if __name__ == "__main__":
    run_level1()
    run_level2()