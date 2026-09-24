"use client";

import React, { useState } from "react";
import { useCommerce } from "@/context/CommerceContext";
import { VendorKycProfile, CreditRatingGrade } from "@/types/commerce";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  Building2,
  TrendingUp,
  Percent,
  CheckCircle2,
  Sliders,
  Sparkles,
} from "lucide-react";

export default function VendorKycPage() {
  const { vendors, adjustVendorCredit, toggleVendorStatus } = useCommerce();
  const [selectedVendor, setSelectedVendor] = useState<VendorKycProfile>(vendors[0]);
  const [newCreditLimit, setNewCreditLimit] = useState<number>(selectedVendor.creditLimitIDR);

  const getCreditGradeBadge = (grade: CreditRatingGrade) => {
    switch (grade) {
      case "AAA":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "AA":
      case "A":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "BBB":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    }
  };

  const handleUpdateLimit = (e: React.FormEvent) => {
    e.preventDefault();
    adjustVendorCredit(selectedVendor.id, Number(newCreditLimit));
    setSelectedVendor((prev) => ({ ...prev, creditLimitIDR: Number(newCreditLimit) }));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* KPI Top Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Audited Vendors</div>
          <div className="text-2xl font-black text-white flex items-center justify-between">
            <span>{vendors.length} Rekanan</span>
            <Building2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-bold">100% KYC Passed</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Plafon Kredit B2B</div>
          <div className="text-2xl font-black text-cyan-400 flex items-center justify-between">
            <span>
              Rp {(vendors.reduce((acc, v) => acc + v.creditLimitIDR, 0) / 1000000000).toFixed(0)} Miliar
            </span>
            <Award className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">D&amp;B Actuarial Scoring</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Avg Default Risk</div>
          <div className="text-2xl font-black text-emerald-400 flex items-center justify-between">
            <span>
              {(vendors.reduce((acc, v) => acc + v.paymentDefaultRiskPercent, 0) / vendors.length).toFixed(2)}%
            </span>
            <Percent className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Investment Grade Standard</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Avg On-Time SLA</div>
          <div className="text-2xl font-black text-amber-400 flex items-center justify-between">
            <span>
              {(vendors.reduce((acc, v) => acc + v.onTimeDeliveryRate, 0) / vendors.length).toFixed(1)}%
            </span>
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Logistics Reliability Rating</div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>Vendor KYC &amp; Credit Scoring Engine</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            D&amp;B COMPLIANCE
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Penilaian risiko kredit rekanan B2B, kelayakan pembayaran tempo (Net 30/60/LC), audit kepatuhan ESG, dan kuota plafon piutang.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vendor List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Direktori Rekanan Terakreditasi
          </h2>
          {vendors.map((vendor) => {
            const isSelected = vendor.id === selectedVendor.id;
            return (
              <div
                key={vendor.id}
                onClick={() => {
                  setSelectedVendor(vendor);
                  setNewCreditLimit(vendor.creditLimitIDR);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all text-xs ${
                  isSelected
                    ? "bg-[#0f1730] border-amber-500/60 shadow-lg shadow-amber-500/10"
                    : "bg-[#090f20] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-black text-white">{vendor.legalName}</h3>
                    <div className="text-[10px] text-slate-400 mt-0.5">{vendor.industryCategory}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-black text-xs border ${getCreditGradeBadge(vendor.creditGrade)}`}>
                    {vendor.creditGrade}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <div>
                    <span>Score: </span>
                    <span className="text-amber-400 font-mono font-bold">{vendor.creditScore} / 850</span>
                  </div>
                  <div>
                    <span>On-Time: </span>
                    <span className="text-emerald-400 font-mono font-bold">{vendor.onTimeDeliveryRate}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Vendor Detail & Credit Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0c1224] border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-slate-400">NPWP: {selectedVendor.taxIdNpwp}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      selectedVendor.status === "VERIFIED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {selectedVendor.status}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white">{selectedVendor.legalName}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedVendor.industryCategory} • {selectedVendor.country}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center p-3 rounded-xl bg-[#080d1a] border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Credit Rating</div>
                  <div className="text-2xl font-black text-amber-400">{selectedVendor.creditGrade}</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-[#080d1a] border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Actuarial Score</div>
                  <div className="text-2xl font-black text-emerald-400">{selectedVendor.creditScore}</div>
                </div>
              </div>
            </div>

            {/* Credit Utilization Gauge */}
            <div className="py-5 border-b border-slate-800">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-400">Plafon Kredit Terpakai:</span>
                <span className="text-white font-mono font-bold">
                  {formatCurrency(selectedVendor.utilizedCreditIDR)} / {formatCurrency(selectedVendor.creditLimitIDR)}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (selectedVendor.utilizedCreditIDR / selectedVendor.creditLimitIDR) * 100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>
                  Utilisasi:{" "}
                  {((selectedVendor.utilizedCreditIDR / selectedVendor.creditLimitIDR) * 100).toFixed(1)}%
                </span>
                <span>
                  Sisa Plafon:{" "}
                  {formatCurrency(selectedVendor.creditLimitIDR - selectedVendor.utilizedCreditIDR)}
                </span>
              </div>
            </div>

            {/* Operational Quality Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-b border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800">
                <div className="text-[10px] text-slate-400">On-Time Delivery SLA</div>
                <div className="text-base font-black text-emerald-400">{selectedVendor.onTimeDeliveryRate}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800">
                <div className="text-[10px] text-slate-400">Defect Rate (PPM)</div>
                <div className="text-base font-black text-white">{selectedVendor.defectRatePpm} ppm</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800">
                <div className="text-[10px] text-slate-400">Default Probability</div>
                <div className="text-base font-black text-amber-400">{selectedVendor.paymentDefaultRiskPercent}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#080d1a] border border-slate-800">
                <div className="text-[10px] text-slate-400">Audit Status</div>
                <div className="text-base font-black text-cyan-400">
                  {selectedVendor.isAuditedEsg ? "ESG A+" : "Standard"}
                </div>
              </div>
            </div>

            {/* Credit Limit Adjust Form */}
            <form onSubmit={handleUpdateLimit} className="pt-5 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Penyesuaian Plafon Kredit Rekanan (IDR)</span>
                </h3>
                <button
                  type="button"
                  onClick={() => toggleVendorStatus(selectedVendor.id)}
                  className={`px-3 py-1 rounded-lg border font-bold text-xs transition-all ${
                    selectedVendor.status === "VERIFIED"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                  }`}
                >
                  {selectedVendor.status === "VERIFIED" ? "Kaji Ulang (Review)" : "Verifikasi Ulang"}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="number"
                  step={1000000000}
                  value={newCreditLimit}
                  onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                  className="flex-1 bg-[#080d1a] border border-slate-800 rounded-xl px-4 py-2 text-white font-mono focus:border-amber-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20 transition-all active:scale-95"
                >
                  Kunci Plafon Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
