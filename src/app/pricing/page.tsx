"use client";

import React, { useState } from "react";
import { useCommerce } from "@/context/CommerceContext";
import { WholesaleProduct, VolumePricingTier } from "@/types/commerce";
import { formatCurrency, formatUSD, formatNumber } from "@/lib/utils";
import { BarChart3, Layers, ShoppingBag, ShieldCheck, Check, Sparkles, Send } from "lucide-react";

export default function VolumePricingPage() {
  const { products, submitQuoteRequest } = useCommerce();
  const [selectedProduct, setSelectedProduct] = useState<WholesaleProduct>(products[0]);
  const [orderQty, setOrderQty] = useState<number>(selectedProduct.moq);
  const [buyerCompany, setBuyerCompany] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Find matching tier
  const activeTier =
    selectedProduct.pricingTiers.find((tier) => {
      if (tier.maxQty === null) return orderQty >= tier.minQty;
      return orderQty >= tier.minQty && orderQty <= tier.maxQty;
    }) || selectedProduct.pricingTiers[0];

  const calculatedUnitPriceIDR = activeTier.unitPriceIDR;
  const totalSubtotal = calculatedUnitPriceIDR * orderQty;
  const estimatedVat11 = Math.round(totalSubtotal * 0.11);
  const grandTotal = totalSubtotal + estimatedVat11;
  const savingsVsBase = (selectedProduct.basePriceIDR - calculatedUnitPriceIDR) * orderQty;

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerCompany || !buyerEmail) return;

    submitQuoteRequest({
      productSku: selectedProduct.sku,
      productName: selectedProduct.name,
      requestedQty: orderQty,
      calculatedUnitPrice: calculatedUnitPriceIDR,
      totalSubtotal,
      estimatedVat11,
      grandTotal,
      buyerCompany,
      buyerEmail,
      notes: `Tier ${activeTier.discountPercentage}% off, Lead time ${activeTier.leadTimeWeeks} weeks.`,
    });

    setQuoteSuccess(true);
    setTimeout(() => setQuoteSuccess(false), 4000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>Wholesale Volume Pricing Matrix</span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            TIERED MOQ ENGINE
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kalkulator diskon kuantitas grosir B2B: harga per unit menurun drastis seiring peningkatan volume pesanan (MOQ Tiers).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selector & Specs */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Pilih Komoditas Grosir
            </label>
            <div className="space-y-2">
              {products.map((p) => {
                const isSelected = p.id === selectedProduct.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setOrderQty(p.moq);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/50 text-white"
                        : "bg-[#080d1a] border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="font-bold">{p.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                      <span>SKU: {p.sku}</span>
                      <span>MOQ: {p.moq} {p.unit}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Spesifikasi &amp; QA Compliance</span>
            </h3>
            <div className="space-y-2 text-xs">
              {Object.entries(selectedProduct.technicalSpecs).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-white font-mono font-medium">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">Sertifikasi Resmi</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProduct.certifications.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Matrix & Tier Calculator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tiers Visual Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedProduct.pricingTiers.map((tier) => {
              const isCurrent = tier.id === activeTier.id;
              return (
                <div
                  key={tier.id}
                  className={`p-4 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                    isCurrent
                      ? "bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10 scale-102"
                      : "bg-[#090f20] border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-400">
                        {tier.maxQty ? `${tier.minQty} - ${tier.maxQty}` : `>= ${tier.minQty}`}
                      </span>
                      {tier.discountPercentage > 0 && (
                        <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          -{tier.discountPercentage}%
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black text-white mt-1">
                      {formatCurrency(tier.unitPriceIDR)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {formatUSD(tier.unitPriceUSD)} / {selectedProduct.unit}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-3 border-t border-slate-800 mt-3 flex items-center justify-between">
                    <span>Lead Time:</span>
                    <span className="text-slate-200 font-bold">{tier.leadTimeWeeks} Minggu</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Calculator Slider */}
          <div className="p-6 rounded-2xl bg-[#0c1224] border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-white">Simulasi Volume Order B2B</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Geser slider atau masukkan kuantitas untuk melihat perhitungan subtotal dan PPN 11% otomatis.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-400">
                  {formatNumber(orderQty)} {selectedProduct.unit}
                </span>
              </div>
            </div>

            <input
              type="range"
              min={selectedProduct.moq}
              max={selectedProduct.stockAvailable}
              step={10}
              value={orderQty}
              onChange={(e) => setOrderQty(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-6"
            />

            {/* Calculations Breakdown */}
            <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800/80 space-y-2 text-xs mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Harga Satuan Terkunci (Tier {activeTier.discountPercentage}% OFF):</span>
                <span className="text-white font-mono font-bold">{formatCurrency(calculatedUnitPriceIDR)} / {selectedProduct.unit}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({formatNumber(orderQty)} {selectedProduct.unit}):</span>
                <span className="text-white font-mono">{formatCurrency(totalSubtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>PPN 11% (Faktur Pajak Standar):</span>
                <span className="text-white font-mono">{formatCurrency(estimatedVat11)}</span>
              </div>
              {savingsVsBase > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800/80">
                  <span>Total Penghematan Skala Grosir:</span>
                  <span className="font-mono">Hemat {formatCurrency(savingsVsBase)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-amber-400 pt-2 border-t border-slate-800">
                <span>Grand Total (Termasuk Pajak):</span>
                <span className="font-mono">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* RFQ / PO Quote Form */}
            <form onSubmit={handleQuoteSubmit} className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Kirim Permintaan Faktur Proforma / Purchase Order</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Nama Perusahaan Pembeli</label>
                  <input
                    type="text"
                    required
                    placeholder="PT Industri Manufaktur Nusantara"
                    value={buyerCompany}
                    onChange={(e) => setBuyerCompany(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Email Procurement Resmi</label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@industri.co.id"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {quoteSuccess ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Faktur Proforma &amp; PO Berhasil Diterbitkan ke Antrean!
                  </span>
                ) : (
                  <span className="text-slate-500">Estimasi penerbitan PO: 5 menit kerja.</span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ajukan Pembelian Grosir</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
