    import { NextResponse } from "next/server";
    import OpenAI from "openai";

    export const runtime = "nodejs";
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    export async function POST(req: Request) {
      try{
        const { hook, goal, offer } = await req.json();
        if(!process.env.OPENAI_API_KEY){
          const fallback = `${hook}\n\nProblem: Du postest – aber trackst nicht.\nKontrast: Views sind keine Euros.\n\nLösung:\n1) Hook härten\n2) Tracking ID pro Variante\n3) Winner skalieren\n\nCTA: Bau dir PulseAI als System – nicht als Glück.`;
          return NextResponse.json({ ok:true, script: fallback });
        }
        const model = process.env.OPENAI_MODEL || "gpt-5.1-chat-latest";
        const prompt = `
Schreibe ein Script (DE) für 18-22 Sekunden.
0-1s: Hook (1 Satz)
1-8s: Problem+Kontrast (2-3 Sätze)
8-16s: Lösung (3 Steps)
16-22s: CTA (1 Satz)
Hook: ${String(hook||"").slice(0,220)}
Ziel: ${String(goal||"").slice(0,220)}
Offer: ${String(offer||"").slice(0,220)}
Keine Emojis, keine Hashtags. Gib nur Text mit Zeilenumbrüchen.
`.trim();

        const res = await client.responses.create({ model, input: prompt });
        return NextResponse.json({ ok:true, script: (res.output_text || "").trim() });
      }catch(e:any){
        return NextResponse.json({ ok:false, error: e?.message || "error" }, { status: 500 });
      }
    }
