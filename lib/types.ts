export type TrendItem = {
  id: string;
  platform: "TikTok" | "Reels" | "Pinterest";
  hook: string;
  sound?: string;
  keywords: string[];
  velocity: number;   // 0..100
  nicheFit: number;   // 0..100
  capturedAt: string;
  sourceUrl?: string;
};

export type RevenueEvent = {
  id: string;
  ts: string;
  trackingId: string;
  variantId: string;
  amount: number;
  currency: "EUR";
};
