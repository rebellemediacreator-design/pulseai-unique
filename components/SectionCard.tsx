"use client";

export default function SectionCard({
  id,
  title,
  subtitle,
  children,
  tone = "cyan",
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tone?: "cyan" | "violet";
}) {
  const klass = tone === "violet" ? "panelV" : "panel";
  return (
    <section id={id} className={`${klass} p-5 md:p-6 relative overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.12]"
        style={{
          background:
            tone === "violet"
              ? "radial-gradient(600px 300px at 80% 10%, rgba(168,85,247,0.55), transparent 60%)"
              : "radial-gradient(600px 300px at 20% 10%, rgba(51,230,255,0.55), transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          <a className="text-xs text-[rgba(255,255,255,0.70)] hover:text-[rgba(51,230,255,0.9)] transition" href={`#${id}`}>
            #{id}
          </a>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}
