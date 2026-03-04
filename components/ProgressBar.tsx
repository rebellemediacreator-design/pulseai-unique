"use client";

export default function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-3 rounded-full bg-[rgba(0,0,0,0.30)] border border-line overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${v}%`,
          background: "linear-gradient(90deg, rgba(51,230,255,0.95), rgba(168,85,247,0.95))",
          boxShadow: "0 0 30px rgba(51,230,255,0.25)",
        }}
      />
    </div>
  );
}
