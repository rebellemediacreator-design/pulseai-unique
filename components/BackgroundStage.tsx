"use client";

import { useEffect, useMemo, useState } from "react";

const BG = [
  "/pulse/bg/bg-01.jpg",
  "/pulse/bg/bg-02.jpg",
  "/pulse/bg/bg-03.jpg",
  "/pulse/bg/bg-04.jpg",
  "/pulse/bg/bg-05.jpg",
  "/pulse/bg/bg-06.jpg",
  "/pulse/bg/bg-07.jpg",
  "/pulse/bg/bg-08.jpg",
  "/pulse/bg/bg-09.jpg",
  "/pulse/bg/bg-10.jpg",
];

export default function BackgroundStage() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const ids = Array.from({ length: 10 }, (_, i) => `s${i + 1}`);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        // choose most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (!visible) return;
        const id = (visible.target as HTMLElement).id;
        const n = Number(id.replace("s", "")) - 1;
        if (!Number.isNaN(n)) setIdx(Math.max(0, Math.min(9, n)));
      },
      { threshold: [0.2, 0.35, 0.5, 0.65, 0.8] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = BG[idx] || BG[0];

  return (
    <div className="fixed inset-0 -z-10">
      {/* image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${current})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.15) contrast(1.06)",
          transform: "scale(1.04)",
        }}
      />
      {/* cinematic overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(6,6,10,0.86), rgba(6,6,10,0.52), rgba(6,6,10,0.86))",
        }}
      />
      {/* bloom corners */}
      <div
        className="absolute inset-0 opacity-[0.40]"
        style={{
          background:
            "radial-gradient(900px 500px at 18% 12%, rgba(51,230,255,0.20), transparent 60%), radial-gradient(900px 500px at 86% 18%, rgba(168,85,247,0.18), transparent 62%)",
        }}
      />
      {/* scanlines + grain */}
      <div className="absolute inset-0 scanlines" />
      <div className="absolute inset-0 grain" />
    </div>
  );
}
