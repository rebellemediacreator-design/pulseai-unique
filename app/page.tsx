"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import SectionCard from "@/components/SectionCard";
import ProgressBar from "@/components/ProgressBar";
import BackgroundStage from "@/components/BackgroundStage";
import { viralScore } from "@/lib/scoring";
import type { TrendItem, RevenueEvent } from "@/lib/types";

function GlobeHotspots({ trends }: { trends: TrendItem[] }) {
  // A tiny "rotating globe vibe" without heavy libs: orbiting dots + glow
  const hot = trends.slice(0, 8);
  return (
    <div className="relative w-full aspect-[16/10] rounded-[22px] border border-line bg-[rgba(0,0,0,0.22)] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.18]"
        style={{ background: "radial-gradient(420px 240px at 55% 45%, rgba(51,230,255,0.55), transparent 62%)" }}
      />
      <div className="absolute inset-0 opacity-[0.12]"
        style={{ background: "radial-gradient(420px 240px at 45% 55%, rgba(168,85,247,0.55), transparent 62%)" }}
      />
      <div className="absolute left-1/2 top-1/2 w-[78%] h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.10)]"
        style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.55)" }}
      />
      <div className="absolute left-1/2 top-1/2 w-[66%] h-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.08)]" />
      <div className="absolute left-1/2 top-1/2 w-[54%] h-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.06)]" />
      {hot.map((t, i) => (
        <div key={t.id}
          className="absolute w-2.5 h-2.5 rounded-full"
          style={{
            left: `${18 + (i * 9)}%`,
            top: `${22 + ((i * 13) % 55)}%`,
            background: i % 2 === 0 ? "rgba(51,230,255,0.95)" : "rgba(168,85,247,0.95)",
            boxShadow: i % 2 === 0 ? "0 0 22px rgba(51,230,255,0.45)" : "0 0 22px rgba(168,85,247,0.45)",
            animation: `orbit ${6 + i}s linear infinite`,
            transformOrigin: "140px 120px",
          }}
          title={`${t.platform}: ${t.hook}`}
        />
      ))}
      <style jsx>{`
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
        <div className="text-xs text-muted">Global Pulse Hotspots (MVP)</div>
        <div className="chip">Noise‑Filter: nicheFit + velocity</div>
      </div>
    </div>
  );
}

export default function Page() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [trLoading, setTrLoading] = useState(false);

  const [goal, setGoal] = useState("Verkaufe 500 Coaching‑Plätze");
  const [audience, setAudience] = useState("Founderinnen & Creatorinnen (DACH), Premium, wenig Zeit");
  const [price, setPrice] = useState("990 €");
  const [benefits, setBenefits] = useState<string[]>(["mehr Umsatz", "weniger Chaos", "skalierbarer Content"]);
  const [benefitInput, setBenefitInput] = useState("");

  const [personaFiles, setPersonaFiles] = useState<File[]>([]);
  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState("");
  const [script, setScript] = useState("");
  const [pipeline, setPipeline] = useState({ status: "idle" as "idle"|"running"|"done", progress: 0 });

  const [revenue, setRevenue] = useState<RevenueEvent[]>([]);
  const [revLoading, setRevLoading] = useState(false);

  const currentTrend = useMemo(() => trends.slice().sort((a,b)=> (b.velocity+b.nicheFit)-(a.velocity+a.nicheFit))[0], [trends]);

  const score = useMemo(() => {
    const trendVelocity = currentTrend?.velocity ?? 58;
    const nicheFit = currentTrend?.nicheFit ?? 62;
    const hookStrength = selectedHook.length > 20 ? 78 : selectedHook.length > 10 ? 62 : 48;
    const offerClarity = String(price).length > 0 && benefits.length >= 2 ? 74 : 58;
    const friction = String(price).includes("€") ? 22 : 35;
    return viralScore({ trendVelocity, nicheFit, hookStrength, offerClarity, friction });
  }, [currentTrend, selectedHook, price, benefits]);

  const revenueToday = useMemo(() => revenue.reduce((s,r)=>s+(r.amount||0),0), [revenue]);

  async function loadTrends() {
    setTrLoading(true);
    try{
      const r = await fetch("/api/trends");
      const j = await r.json();
      setTrends(j?.data || []);
    } finally { setTrLoading(false); }
  }

  async function loadRevenue() {
    setRevLoading(true);
    try{
      const r = await fetch("/api/revenue/mock");
      const j = await r.json();
      setRevenue(j?.data || []);
    } finally { setRevLoading(false); }
  }

  useEffect(() => { loadTrends(); loadRevenue(); }, []);

  function addBenefit() {
    const v = benefitInput.trim();
    if(!v) return;
    setBenefits((b)=> Array.from(new Set([...b, v])).slice(0,8));
    setBenefitInput("");
  }

  async function genHooks() {
    setHooks([]);
    setSelectedHook("");
    const r = await fetch("/api/generate/hooks", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ goal, audience, offer: `Preis: ${price}. Benefits: ${benefits.join(", ")}` })
    });
    const j = await r.json();
    if(j?.ok) setHooks(j.hooks || []);
  }

  async function genScript() {
    if(!selectedHook) return;
    setScript("");
    const r = await fetch("/api/generate/script", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ hook: selectedHook, goal, offer: `Preis: ${price}. Benefits: ${benefits.join(", ")}` })
    });
    const j = await r.json();
    if(j?.ok) setScript(j.script || "");
  }

  function startPipeline() {
    if(!script) return;
    setPipeline({ status:"running", progress: 0 });
    let p = 0;
    const t = setInterval(()=> {
      p += Math.random()*16 + 8;
      if(p >= 100){
        clearInterval(t);
        setPipeline({ status:"done", progress: 100 });
        return;
      }
      setPipeline({ status:"running", progress: Math.round(p) });
    }, 520);
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <BackgroundStage />

      <div className="mx-auto max-w-[1320px] grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4 md:gap-6">
        <Sidebar />

        <div className="space-y-5 md:space-y-6">
          {/* HERO */}
          <div className="panel p-5 md:p-6 overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.12]"
              style={{ background: "radial-gradient(900px 420px at 20% 0%, rgba(51,230,255,0.7), transparent 60%), radial-gradient(900px 420px at 90% 10%, rgba(168,85,247,0.6), transparent 62%)" }}
            />
            <div className="relative">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-xs text-muted tracking-widest uppercase">Cyberpunk‑Editorial SaaS</div>
                  <h1 className="mt-2 text-2xl md:text-3xl font-semibold">PulseAI – Slide Theater</h1>
                  <p className="mt-2 text-sm text-muted max-w-[70ch]">
                    Kein Standard‑Dashboard. Jede Sektion ist ein eigenes Set – mit eigenem Hintergrund, eigener Spannung, eigener Handlung.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btnC" onClick={loadTrends} disabled={trLoading}>{trLoading ? "Refresh…" : "Refresh Pulse"}</button>
                  <button className="btn btnV" onClick={loadRevenue} disabled={revLoading}>{revLoading ? "Sync…" : "Sync Revenue"}</button>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 1 */}
          <SectionCard id="s1" title="Global Pulse" subtitle="Trend‑Radar: Hooks, Sounds, Keywords. Noise‑Filter: nur nischige Signale." tone="cyan">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
              <GlobeHotspots trends={trends} />
              <div className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Top Signals</div>
                  <span className="chip">early</span>
                </div>
                <div className="mt-3 space-y-2 max-h-[280px] overflow-auto pr-1">
                  {trends.slice(0,10).map((t)=>(
                    <div key={t.id} className="rounded-[18px] border border-line bg-[rgba(255,255,255,0.04)] p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted">{t.platform}</span>
                        <span className="text-xs text-[rgba(51,230,255,0.9)]">V {t.velocity}</span>
                      </div>
                      <div className="mt-1 text-sm">{t.hook}</div>
                      <div className="mt-2 text-xs text-muted">Keywords: {t.keywords.join(", ")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* SLIDE 2 */}
          <SectionCard id="s2" title="Strategy Architect" subtitle="Ziel → AIDA‑Plan. Keine Inspiration. Nur Mechanik." tone="violet">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <div className="label">Ziel</div>
                <input className="input mt-1" value={goal} onChange={(e)=>setGoal(e.target.value)} />
              </div>
              <div>
                <div className="label">Zielgruppe</div>
                <input className="input mt-1" value={audience} onChange={(e)=>setAudience(e.target.value)} />
              </div>
              <div>
                <div className="label">Preis</div>
                <input className="input mt-1" value={price} onChange={(e)=>setPrice(e.target.value)} />
              </div>
              <div>
                <div className="label">Benefits (kurz, konkret)</div>
                <div className="flex gap-2 mt-1">
                  <input className="input" value={benefitInput} onChange={(e)=>setBenefitInput(e.target.value)} onKeyDown={(e)=> e.key==="Enter" ? (e.preventDefault(), addBenefit()) : null} />
                  <button className="btn btnC" onClick={addBenefit}>Add</button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {benefits.map((b)=> <span key={b} className="chip">{b}</span>)}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
              <div className="text-sm font-semibold">AIDA Preview (MVP)</div>
              <div className="mt-2 grid md:grid-cols-4 gap-2">
                {["Attention","Interest","Desire","Action"].map((x)=>(
                  <div key={x} className="rounded-[18px] border border-line bg-[rgba(255,255,255,0.04)] p-3">
                    <div className="text-xs text-muted">{x}</div>
                    <div className="mt-1 text-sm">1 Video‑Idee + 1 CTA</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* SLIDE 3 */}
          <SectionCard id="s3" title="Ghost Persona Studio" subtitle="5 Referenzfotos. Stimme. Outfit. Location. (MVP: lokale Auswahl + ready für Storage)." tone="cyan">
            <div className="grid md:grid-cols-2 gap-3 items-start">
              <div>
                <div className="label">Upload (max 5)</div>
                <input className="input mt-1" type="file" accept="image/*" multiple
                  onChange={(e)=> setPersonaFiles(Array.from(e.target.files || []).slice(0,5))}
                />
                <div className="mt-2 text-sm text-muted">{personaFiles.length}/5 ausgewählt</div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {personaFiles.map((f)=>(
                    <div key={f.name} className="rounded-[14px] border border-line bg-[rgba(0,0,0,0.18)] p-2 text-[10px] text-muted truncate" title={f.name}>
                      {f.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                <div className="text-sm font-semibold">Presets (MVP)</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="chip">Outfit: Minimal Black</span>
                  <span className="chip">Location: Penthouse</span>
                  <span className="chip">Voice: Calm‑Authority</span>
                </div>
                <div className="mt-3 text-sm text-muted">
                  Später: Upload → Supabase Storage → Persona‑ID → Provider Profile.
                </div>
              </div>
            </div>
          </SectionCard>

          {/* SLIDE 4 */}
          <SectionCard id="s4" title="Hook‑Lab" subtitle="5 Hook‑Typen. Eine Wahrheit: 0–3 Sekunden entscheiden." tone="violet">
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn btnV" onClick={genHooks}>Generate Hooks</button>
              <button className="btn btnC" onClick={genScript} disabled={!selectedHook}>Write Script</button>
              <span className="chip">Selected: {selectedHook ? "✓" : "—"}</span>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-3">
              {hooks.map((h, idx)=>(
                <button key={idx}
                  onClick={()=> setSelectedHook(h)}
                  className={`text-left rounded-[22px] border p-4 transition ${
                    selectedHook===h ? "border-[rgba(51,230,255,0.45)] bg-[rgba(51,230,255,0.08)]" : "border-line bg-[rgba(0,0,0,0.18)] hover:bg-[rgba(255,255,255,0.06)]"
                  }`}
                >
                  <div className="text-xs text-muted">Hook {idx+1}</div>
                  <div className="mt-1 text-sm">{h}</div>
                </button>
              ))}
            </div>
            {script ? (
              <pre className="mt-4 whitespace-pre-wrap rounded-[22px] border border-line bg-[rgba(0,0,0,0.24)] p-4 text-sm">{script}</pre>
            ) : null}
          </SectionCard>

          {/* SLIDE 5 */}
          <SectionCard id="s5" title="Auto‑Production Pipeline" subtitle="Render‑Button. Progress. Rohschnitt‑Preview. (MVP: Job Simulation)." tone="cyan">
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn btnC" onClick={startPipeline} disabled={!script || pipeline.status==="running"}>
                {pipeline.status==="running" ? "Rendering…" : "Render"}
              </button>
              <span className="chip">status: {pipeline.status}</span>
            </div>
            <div className="mt-3">
              <ProgressBar value={pipeline.progress} />
              <div className="mt-2 text-xs text-muted">{pipeline.progress}%</div>
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-3">
              {["Captions","Music Sync","Export"].map((x)=>(
                <div key={x} className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                  <div className="text-sm font-semibold">{x}</div>
                  <div className="mt-2 text-sm text-muted">Adapter ready. Provider später.</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* SLIDE 6 */}
          <SectionCard id="s6" title="The Viral Score" subtitle="0–100. Feedback. Risiko. Vergleich mit aktuellen Hits." tone="violet">
            <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-4">
              <div className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                <div className="text-xs text-muted">Score</div>
                <div className="mt-1 text-4xl font-semibold">
                  {score}<span className="text-sm text-muted"> /100</span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={score} />
                </div>
                <div className="mt-3 text-sm text-muted">
                  MVP‑Heuristik: TrendFit + HookStrength + OfferClarity − Friction
                </div>
              </div>
              <div className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                <div className="text-sm font-semibold">Feedback (MVP)</div>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>• Hook: {selectedHook ? "ok" : "fehlt"} — kürzer = härter.</li>
                  <li>• Offer: Benefits konkretisieren (Zahl/Proof).</li>
                  <li>• Kontrast: 1 Satz “das kostet dich Geld”.</li>
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* SLIDE 7 */}
          <SectionCard id="s7" title="Smart Distribution" subtitle="Ein Plan. Viele Plattformen. Richtige Uhrzeit." tone="cyan">
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { p:"TikTok", t:"12:15", s:"Geplant" },
                { p:"Reels", t:"18:40", s:"Geplant" },
                { p:"Pinterest", t:"11:05", s:"Geplant" },
              ].map((x)=>(
                <div key={x.p} className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                  <div className="text-xs text-muted">{x.p}</div>
                  <div className="mt-1 text-2xl font-semibold">{x.t}</div>
                  <div className="mt-2 chip">{x.s}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* SLIDE 8 */}
          <SectionCard id="s8" title="Revenue & Sales Tracker" subtitle="Goldzähler. Umsatz heute. Video → Geld." tone="violet">
            <div className="grid md:grid-cols-[1fr_1fr] gap-4">
              <div className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                <div className="text-xs text-muted">Einnahmen heute (mock)</div>
                <div className="mt-1 text-3xl font-semibold">{revenueToday.toFixed(2)} EUR</div>
                <div className="mt-3 text-sm text-muted">Million Tip: Kill Vanity. Scale Winners.</div>
              </div>
              <div className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                <div className="text-sm font-semibold">Events</div>
                <div className="mt-3 space-y-2 max-h-[220px] overflow-auto pr-1">
                  {revenue.map((r)=>(
                    <div key={r.id} className="rounded-[18px] border border-line bg-[rgba(255,255,255,0.04)] p-3 flex items-center justify-between gap-3">
                      <div className="text-sm"><span className="text-[rgba(51,230,255,0.9)]">{r.variantId}</span> <span className="text-muted">/</span> <span className="text-muted">{r.trackingId}</span></div>
                      <div className="text-sm font-semibold">{r.amount.toFixed(2)} EUR</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* SLIDE 9 */}
          <SectionCard id="s9" title="Scale‑O‑Meter" subtitle="Budget folgt Profit. Nicht Hoffnung." tone="cyan">
            <div className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Boost Vorschlag (MVP)</div>
                  <div className="mt-1 text-sm text-muted">
                    {score >= 78 ? "Winner: +30% Budget" : score >= 65 ? "Test: +10% Budget" : "Hold: erst Hook/Offer härten"}
                  </div>
                </div>
                <button className="btn btnC">Apply (stub)</button>
              </div>
            </div>
          </SectionCard>

          {/* SLIDE 10 */}
          <SectionCard id="s10" title="The Exit‑Vault" subtitle="ARR x Multiple. Valuation als Spiegel deiner Maschine." tone="violet">
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { k:"MRR", v:"3.900 €", c:"text-[rgba(51,230,255,0.9)]" },
                { k:"ARR", v:"46.800 €", c:"text-[rgba(168,85,247,0.9)]" },
                { k:"Valuation (6–12x)", v:"280k – 560k €", c:"text-[rgba(255,255,255,0.92)]" },
              ].map((x)=>(
                <div key={x.k} className="rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
                  <div className="text-xs text-muted">{x.k}</div>
                  <div className={`mt-2 text-2xl font-semibold ${x.c}`}>{x.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[22px] border border-line bg-[rgba(0,0,0,0.18)] p-4">
              <div className="text-sm font-semibold">Investor Notes (MVP)</div>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>• Zeig Attribution: Video → Click → Checkout → Repeat.</li>
                <li>• Zeig Moat: Profit‑Pivot Automation + White‑Label Tenanting.</li>
                <li>• Zeig Growth: MRR trend + retention.</li>
              </ul>
            </div>
          </SectionCard>

          <div className="text-xs text-muted pb-10">
            Backgrounds liegen in <code className="px-2 py-1 rounded bg-[rgba(0,0,0,0.35)] border border-line">/public/pulse/bg</code>.
          </div>
        </div>
      </div>
    </main>
  );
}
