import os
import time
import json
import requests
import pandas as pd

API_KEY = os.environ.get("SECTORS_API_KEY", "")
BASE_URL = "https://api.sectors.app/v2"
HEADERS = {"Authorization": API_KEY}

CACHE_DIR = "cache"
NEWS_DETAIL_DIR = os.path.join(CACHE_DIR, "stage2", "news_detail")
os.makedirs(NEWS_DETAIL_DIR, exist_ok=True)

DRY_RUN = False

if not API_KEY:
    raise SystemExit('SECTORS_API_KEY not yet set')

def test_sector_fields():
    params = {
        "where": "market_cap > 0 and sub_sector != ''",
        "order_by": "-market_cap",
        "limit": 3,
        "offset": 0,
        "include_query_values": "true",
    }
    resp = requests.get(f"{BASE_URL}/companies/", headers=HEADERS, params=params, timeout=20)
    print(f"Status: {resp.status_code}")
    payload = resp.json()
    print(json.dumps(payload.get("results", payload), indent=2)[:2000])
    return payload

def fetch_all_sectors(chunk_size: int = 200) -> list[dict]:
    all_rows = []
    offset = 0
    while True:
        params = {
            "where": "market_cap > 0 and sub_sector != ''",
            "order_by": "-market_cap",
            "limit": chunk_size,
            "offset": offset,
            "include_query_values": "true",
        }
        resp = requests.get(f"{BASE_URL}/companies/", headers=HEADERS, params=params, timeout=20)
        resp.raise_for_status()
        payload = resp.json()
        results = payload.get("results", [])
        if not results:
            break
        for r in results:
            qv = r.get("query_values") or {}
            all_rows.append({
                "symbol": (r.get("symbol") or "").replace(".JK", ""),
                "sub_sector": qv.get("sub_sector"),
            })
        pagination = payload.get("pagination", {})
        if not pagination.get("has_next"):
            break
        offset = pagination.get("next_offset", offset + chunk_size)
        time.sleep(0.8)
    return all_rows

def merge_sectors_into_final(sector_rows: list[dict]) -> None:
    sector_df = pd.DataFrame(sector_rows)
    sector_df.to_csv(os.path.join(CACHE_DIR, "universe_sectors.csv"), index=False)

    final_path = os.path.join(CACHE_DIR, "pumprisk_final_score.csv")
    final = pd.read_csv(final_path)
    final = final.drop(columns=[c for c in ["sub_sector"] if c in final.columns])
    final = final.merge(sector_df, on="symbol", how="left")
    final.to_csv(final_path, index=False)
    print(f"Merged sub_sector into {final_path}: "
          f"{final['sub_sector'].notna().sum()} / {len(final)} stocks have sub_sector data")

def fetch_news_detail(symbol: str) -> bool:
    path = os.path.join(NEWS_DETAIL_DIR, f"{symbol}.json")
    if os.path.exists(path):
        return True
    resp = requests.get(
        f"{BASE_URL}/news/",
        headers=HEADERS,
        params={"symbols": symbol, "extension": "idx", "limit": 10},
        timeout=20,
    )
    if resp.status_code != 200:
        return False
    data = resp.json()
    articles = data if isinstance(data, list) else data.get("results", data.get("data", []))

    cleaned = []
    for a in (articles or [])[:5]:
        cleaned.append({
            "title": a.get("title"),
            "date": (a.get("timestamp") or "")[:10], 
            "url": a.get("source"),                   
        })
    with open(path, "w") as f:
        json.dump(cleaned, f, indent=2)
    return True

def fetch_news_details_for_confirmed_stocks() -> None:
    shortlist = pd.read_csv(os.path.join(CACHE_DIR, "stage2_shortlist.csv"))
    symbols = shortlist["symbol"].tolist()

    to_fetch = []
    for symbol in symbols:
        count_path = os.path.join(CACHE_DIR, "stage2", "news", f"{symbol}.csv")
        if not os.path.exists(count_path):
            continue
        count_df = pd.read_csv(count_path)
        if int(count_df["n_news_articles"].iloc[0]) > 0:
            to_fetch.append(symbol)

    print(f"Stocks with 0 news articles (skipped, 0 credits): {len(symbols) - len(to_fetch)}")
    print(f"Stocks needing headline fetch: {len(to_fetch)} (~{len(to_fetch)} credits)")

    for i, symbol in enumerate(to_fetch):
        ok = fetch_news_detail(symbol)
        print(f"  [{i + 1}/{len(to_fetch)}] {symbol}: {'OK' if ok else 'FAILED'}")
        time.sleep(0.8)

def main() -> None:
    print("STEP 1: Fetching sub_sector for full universe")
    sector_rows = fetch_all_sectors()
    merge_sectors_into_final(sector_rows)

    print("\nSTEP 2: Fetching news headlines (confirmed stocks with articles only)")
    fetch_news_details_for_confirmed_stocks()

    print("\nDone")

if __name__ == "__main__":
    main()