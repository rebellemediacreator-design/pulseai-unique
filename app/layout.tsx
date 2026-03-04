import "./globals.css";

export const metadata = {
  title: "PulseAI – The Revenue Engine",
  description: "Autonomous marketing app that turns content into revenue.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
