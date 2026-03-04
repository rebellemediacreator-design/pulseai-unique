    import { NextResponse } from "next/server";
    import OpenAI from "openai";

    export const runtime = "nodejs";
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    export async function POST(req: Request) {
      try{
        const { goal, audience, offer } = await req.json();
        if(!process.env.OPENAI_API_KEY){
          // fallback hooks
          return NextResponse.json({ ok:true, hooks:[
            "Du verlierst Umsatz – weil du deinen Hook weichspülst.",
            "Wenn du DAS nicht misst, sind deine Views wertlos.",
            "3 Sekunden entscheiden, ob du Geld siehst – oder nicht.",
            "Dein Angebot ist gut. Dein Einstieg ist schwach.",
            "Stop. Postest du – oder baust du eine Maschine?"
          ]});
        }
        const model = process.env.OPENAI_MODEL || "gpt-5.1-chat-latest";
        const prompt = `
Erzeuge 5 ultrakurze Hooks (DE), maximal 11 Wörter, B2B, ohne Emojis.
Kontext:
Ziel: ${String(goal||"").slice(0,240)}
Zielgruppe: ${String(audience||"").slice(0,240)}
Offer: ${String(offer||"").slice(0,240)}
Gib ausschließlich JSON-Array zurück: ["..","..","..","..",".."]
`.trim();

        const res = await client.responses.create({ model, input: prompt });
        const text = (res.output_text || "").trim();
        let hooks: string[] = [];
        try { hooks = JSON.parse(text); }
        catch { hooks = text.split("\n").map(l=>l.replace(/^[-\d\.\)\s]+/,"").trim()).filter(Boolean).slice(0,5); }
        return NextResponse.json({ ok:true, hooks });
      }catch(e:any){
        return NextResponse.json({ ok:false, error: e?.message || "error" }, { status: 500 });
      }
    }
