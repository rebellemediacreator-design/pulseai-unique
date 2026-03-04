import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // MVP: simulated but shaped as "Top 100 hooks" feed
  const now = new Date().toISOString();
  const data = Array.from({ length: 30 }, (_, i) => ({
    id: `t${i + 1}`,
    platform: (i % 3 === 0 ? "TikTok" : i % 3 === 1 ? "Reels" : "Pinterest") as const,
    hook: [
      "POV: Du verbrennst Geld, ohne es zu merken.",
      "3 Dinge, die deine Reichweite töten.",
      "Du brauchst kein Talent. Du brauchst ein System.",
      "Dieses eine Detail macht aus Views Umsatz.",
      "Wenn du DAS nicht trackst, ist alles Vanity.",
    ][i % 5],
    sound: i % 2 === 0 ? "Rising Sound #"+(9+i) : undefined,
    keywords: ["offer", "hook", "revenue", "scale", "pivot"].slice(0, (i % 5) + 1),
    velocity: 55 + ((i * 7) % 45),
    nicheFit: 50 + ((i * 9) % 50),
    capturedAt: now,
    sourceUrl: "https://example.com"
  }));

  return NextResponse.json({ ok: true, data });
}
