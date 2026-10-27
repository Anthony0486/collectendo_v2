import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Collectendo",
  description: "Une app pour gérer une collection de jeux et objets Nintendo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
