"use client";

const NAV = [
  { id: "s1", label: "Global Pulse", hint: "Trend-Radar" },
  { id: "s2", label: "Strategy Architect", hint: "30‑Tage Plan" },
  { id: "s3", label: "Ghost Persona", hint: "Avatar-Zentrale" },
  { id: "s4", label: "Hook‑Lab", hint: "3 Sekunden Macht" },
  { id: "s5", label: "Auto‑Production", hint: "Render Fabrik" },
  { id: "s6", label: "Viral Score", hint: "Risiko‑Check" },
  { id: "s7", label: "Smart Distribution", hint: "Multiplikator" },
  { id: "s8", label: "Revenue Tracker", hint: "Goldzähler" },
  { id: "s9", label: "Scale‑O‑Meter", hint: "Wachstumshebel" },
  { id: "s10", label: "Exit‑Vault", hint: "Valuation" },
];

const ROADMAP = [
  { step: "Signal", text: "Trends früher als die Masse. 24h Vorsprung." },
  { step: "Angle", text: "Offer + Zielgruppe in 1 Satz. Klarheit verkauft." },
  { step: "Hook", text: "0–3s = Schicksal. Neugier oder Tod." },
  { step: "Factory", text: "Produzieren, nicht diskutieren. Varianten gewinnen." },
  { step: "Proof", text: "Score + Feedback. Weg mit Vanity." },
  { step: "Distribution", text: "Ein Plan. Viele Plattformen. Wiederholung." },
  { step: "Revenue", text: "Nur Geld zählt. Tracking ID = Wahrheit." },
  { step: "Scale", text: "Winner push. Loser kill. Budget folgt Profit." },
  { step: "Exit", text: "ARR x Multiple. System statt Zufall." },
];

export default function Sidebar() {
  return (
    <aside className="panel p-4 md:p-5 sticky top-4 h-[calc(100vh-2rem)] overflow-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-muted tracking-wide uppercase">PulseAI</div>
          <div className="text-lg font-semibold">The Revenue Engine</div>
        </div>
        <span className="chip">Unique UI</span>
      </div>

      <div className="mt-5">
        <div className="text-xs tracking-wide text-muted uppercase">Modules</div>
        <nav className="mt-3 space-y-1">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="group block rounded-[18px] border border-transparent hover:border-line hover:bg-[rgba(255,255,255,0.06)] transition px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">{n.label}</span>
                <span className="text-[11px] text-muted group-hover:text-[rgba(51,230,255,0.9)] transition">
                  {n.hint}
                </span>
              </div>
            </a>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <div className="text-xs tracking-wide text-muted uppercase">Roadmap zur Million</div>
        <div className="mt-3 space-y-2">
          {ROADMAP.map((r) => (
            <div key={r.step} className="rounded-[18px] border border-line bg-[rgba(0,0,0,0.18)] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[rgba(51,230,255,0.9)]">{r.step}</span>
                <span className="text-[10px] text-[rgba(168,85,247,0.9)]">level</span>
              </div>
              <div className="mt-1 text-sm text-muted">{r.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-xs text-muted">
        Tipp: Scroll = Slidewechsel. Jede Sektion hat ihren eigenen Hintergrund.
      </div>
    </aside>
  );
}
