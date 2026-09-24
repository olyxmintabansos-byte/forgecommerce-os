"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PackageOpen,
  Gavel,
  BarChart3,
  ShieldCheck,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { useCommerce } from "@/context/CommerceContext";

export function Navbar() {
  const pathname = usePathname();
  const { rfqs, invoices, vendors } = useCommerce();

  const activeAuctionCount = rfqs.filter((r) => r.status === "ACTIVE_AUCTION").length;
  const pendingInvoiceCount = invoices.filter((i) => i.status === "PENDING_PAYMENT").length;

  const navLinks = [
    { name: "RFQ Reverse Auction", href: "/", icon: Gavel, badge: activeAuctionCount > 0 ? activeAuctionCount : undefined },
    { name: "Volume Pricing", href: "/pricing/", icon: BarChart3 },
    { name: "Vendor KYC & Scoring", href: "/vendors/", icon: ShieldCheck, badge: vendors.length },
    { name: "Proforma & Tax A4", href: "/invoices/", icon: FileText, badge: pendingInvoiceCount > 0 ? pendingInvoiceCount : undefined },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#070c1a]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <PackageOpen className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-wider">FORGECOMMERCE</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  TITAN 12
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Enterprise Wholesale Procurement &amp; Reverse Auction</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{link.name}</span>
                {link.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? "bg-slate-950 text-amber-400" : "bg-amber-500 text-slate-950"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <a
            href="https://olyxmintabansos-byte.github.io/olyx-portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <span>Apex Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </nav>
      </div>
    </header>
  );
}
