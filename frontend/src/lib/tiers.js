export const TIER_CONFIG = {
  "HIGH RISK": { label: "High Risk", color: "#E85D4C", key: "high" },
  "MEDIUM RISK": { label: "Medium Risk", color: "#F0A93B", key: "medium" },
  WATCH: { label: "Watch", color: "#E8D34C", key: "watch" },
  NORMAL: { label: "Normal", color: "#4CAF7D", key: "normal" },
  UNCONFIRMED: { label: "Unconfirmed", color: "#6B7280", key: "unconfirmed" },
};

export function tierConfig(tier) {
  return TIER_CONFIG[tier] ?? TIER_CONFIG.UNCONFIRMED;
}
