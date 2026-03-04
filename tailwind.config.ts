import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06060A",
        ink2: "#0B0B12",
        glass: "rgba(255,255,255,0.07)",
        line: "rgba(255,255,255,0.12)",
        text: "rgba(255,255,255,0.92)",
        muted: "rgba(255,255,255,0.68)",
        cyan: "#33E6FF",
        violet: "#A855F7",
        ember: "#FF5A1F"
      },
      borderRadius: { xl2: "22px" },
      boxShadow: {
        neon: "0 0 0 1px rgba(51,230,255,0.22), 0 18px 70px rgba(0,0,0,0.55)",
        neonV: "0 0 0 1px rgba(168,85,247,0.22), 0 18px 70px rgba(0,0,0,0.55)"
      }
    },
  },
  plugins: [],
} satisfies Config;
