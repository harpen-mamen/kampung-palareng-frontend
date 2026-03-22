import type { Metadata } from "next";
import "./leaflet.css";
import "./globals.css";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export const metadata: Metadata = {
  title: "Portal Kampung Palareng",
  description:
    "Portal digital Kampung Palareng, Kabupaten Kepulauan Sangihe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body suppressHydrationWarning className="bg-[var(--color-surface)] text-slate-900 antialiased">
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
