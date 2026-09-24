import type { Metadata } from "next";
import "./globals.css";
import { CommerceProvider } from "@/context/CommerceContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ForgeCommerce OS | Enterprise B2B Wholesale & RFQ Engine",
  description: "Enterprise B2B wholesale procurement portal with real-time reverse auction, tiered volume pricing matrix, and vendor compliance rating.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080c18] text-slate-100 antialiased flex flex-col font-sans">
        <CommerceProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <footer className="border-t border-slate-800/80 bg-[#050810] py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                © 2026 <span className="text-slate-300 font-bold">ForgeCommerce OS</span> • Titan #12 Sovereign B2B Fleet
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Organization: olyxmintabansos-byte</span>
                <span>•</span>
                <span>Client-Side Local-First</span>
                <span>•</span>
                <span>Static Export Zero-Defect</span>
              </div>
            </div>
          </footer>
        </CommerceProvider>
      </body>
    </html>
  );
}
