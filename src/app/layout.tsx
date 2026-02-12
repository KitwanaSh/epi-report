import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EPI-RDC — Rapport Épidémiologique Hebdomadaire",
  description:
    "Système de génération de rapports épidémiologiques hebdomadaires pour la RDC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}