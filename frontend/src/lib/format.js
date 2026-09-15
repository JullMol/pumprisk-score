export function formatScore(score) {
  if (score === null || score === undefined) return "—";
  return score.toFixed(3);
}

export function formatPrice(price) {
  if (price === null || price === undefined) return "—";
  return `Rp ${price.toLocaleString("en-US")}`;
}

export function formatPercentChange(current, previous) {
  if (!previous) return null;
  const pct = ((current - previous) / previous) * 100;
  return pct;
}
