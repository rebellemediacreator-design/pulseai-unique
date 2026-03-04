import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  const now = new Date();
  const iso = now.toISOString();
  const data = [
    { id: "r1", ts: iso, trackingId: "trk_A1", variantId: "A", amount: 129, currency: "EUR" as const },
    { id: "r2", ts: iso, trackingId: "trk_B1", variantId: "B", amount: 59, currency: "EUR" as const },
    { id: "r3", ts: iso, trackingId: "trk_A1", variantId: "A", amount: 129, currency: "EUR" as const },
  ];
  return NextResponse.json({ ok: true, data });
}
