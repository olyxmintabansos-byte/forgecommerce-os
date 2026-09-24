"use client";

import React, { useState } from "react";
import { useCommerce } from "@/context/CommerceContext";
import { RfqBiddingEngine } from "@/components/RfqBiddingEngine";
import { Incoterm, PaymentTerms } from "@/types/commerce";
import { Gavel, Plus, Sparkles, Building2, Layers, DollarSign, Filter, CheckCircle2 } from "lucide-react";

export default function RfqMarketplacePage() {
  const { rfqs, createRfq, awardBid, simulateSupplierBid } = useCommerce();
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New RFQ Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<any>("Industrial Steel");
  const [newSku, setNewSku] = useState("");
  const [newQty, setNewQty] = useState<number>(100);
  const [newUnit, setNewUnit] = useState<any>("Ton");
  const [newTargetPrice, setNewTargetPrice] = useState<number>(10000000);
  const [newCurrency, setNewCurrency] = useState<"IDR" | "USD">("IDR");
  const [newDest, setNewDest] = useState("Kawasan Berikat Tanjung Priok, Jakarta");
  const [newIncoterm, setNewIncoterm] = useState<Incoterm>("DDP");
  const [newPaymentTerm, setNewPaymentTerm] = useState<PaymentTerms>("Net 60");
  const [newSpecs, setNewSpecs] = useState("");

  const filteredRfqs = rfqs.filter((r) => {
    if (filterCategory === "ALL") return true;
    return r.category === filterCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createRfq({
      title: newTitle,
      category: newCategory,
      sku: newSku || `SKU-${Date.now().toString().slice(-4)}`,
      targetQuantity: Number(newQty),
      unit: newUnit,
      targetMaxPricePerUnit: Number(newTargetPrice),
      currency: newCurrency,
      deliveryDestination: newDest,
      preferredIncoterm: newIncoterm,
      paymentTerm: newPaymentTerm,
      deadlineIso: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      specsSummary: newSpecs || "Standard industrial manufacturing specifications and QA compliance.",
    });

    setIsModalOpen(false);
    setNewTitle("");
    setNewSpecs("");
  };

  const totalProcurementValue = rfqs.reduce((acc, r) => {
    const val = r.currency === "IDR" ? r.targetMaxPricePerUnit * r.targetQuantity : r.targetMaxPricePerUnit * r.targetQuantity * 15800;
    return acc + val;
  }, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Active RFQ Tenders</div>
          <div className="text-2xl font-black text-amber-400 flex items-center justify-between">
            <span>{rfqs.length} Kontrak</span>
            <Gavel className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Multi-Supplier Reverse Auction</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Pipeline Value</div>
          <div className="text-2xl font-black text-white flex items-center justify-between">
            <span>Rp {(totalProcurementValue / 1000000000).toFixed(1)} Miliar</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-bold">Estimated Cost Ceiling</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Awarded POs</div>
          <div className="text-2xl font-black text-blue-400 flex items-center justify-between">
            <span>{rfqs.filter((r) => r.status === "AWARDED").length} PO Terbit</span>
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">SLA Lead Time Locked</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1226] border border-slate-800">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Incoterms Supported</div>
          <div className="text-2xl font-black text-cyan-400 flex items-center justify-between">
            <span>DDP / CIF / FOB</span>
            <Layers className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Global Trade Compliance</div>
        </div>
      </div>

      {/* Action Strip & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>B2B Reverse Auction &amp; RFQ Command</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              LIVE BIDDING
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mekanisme lelang terbalik: vendor rekanan bersaing menurunkan harga per unit hingga deadline lelang berakhir.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 bg-[#0a1022] p-1 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-slate-200 text-xs px-2 py-1 outline-none cursor-pointer"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Industrial Steel">Industrial Steel</option>
              <option value="Semiconductor ICs">Semiconductor ICs</option>
              <option value="Polymers & Resin">Polymers &amp; Resin</option>
              <option value="Solar Panels">Solar Panels</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Buat Tender RFQ</span>
          </button>
        </div>
      </div>

      {/* RFQ List */}
      <div className="space-y-6">
        {filteredRfqs.map((rfq) => (
          <RfqBiddingEngine
            key={rfq.id}
            rfq={rfq}
            onAwardBid={awardBid}
            onSimulateSupplierBid={simulateSupplierBid}
          />
        ))}
      </div>

      {/* Create RFQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e162d] border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">Buat Tender RFQ Baru</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Judul Tender / Komoditas Pengadaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hot Rolled Steel Coil Grade 304"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Industrial Steel">Industrial Steel</option>
                    <option value="Semiconductor ICs">Semiconductor ICs</option>
                    <option value="Polymers & Resin">Polymers &amp; Resin</option>
                    <option value="Solar Panels">Solar Panels</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">SKU / Kode Komoditas</label>
                  <input
                    type="text"
                    placeholder="Contoh: STL-304-COIL"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Quantity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Satuan</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Ton">Ton</option>
                    <option value="Units">Units</option>
                    <option value="Barrels">Barrels</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Mata Uang</label>
                  <select
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value as any)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="IDR">IDR (Rupiah)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Max Price / Unit</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newTargetPrice}
                  onChange={(e) => setNewTargetPrice(Number(e.target.value))}
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Incoterm Pilihan</label>
                  <select
                    value={newIncoterm}
                    onChange={(e) => setNewIncoterm(e.target.value as any)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="DDP">DDP (Delivered Duty Paid)</option>
                    <option value="CIF">CIF (Cost, Insurance &amp; Freight)</option>
                    <option value="FOB">FOB (Free On Board)</option>
                    <option value="EXW">EXW (Ex Works)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Syarat Pembayaran</label>
                  <select
                    value={newPaymentTerm}
                    onChange={(e) => setNewPaymentTerm(e.target.value as any)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Letter of Credit (LC)">Letter of Credit (LC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Alamat / Pelabuhan Tujuan Pengiriman</label>
                <input
                  type="text"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Spesifikasi Teknis &amp; Standar QA</label>
                <textarea
                  rows={3}
                  value={newSpecs}
                  onChange={(e) => setNewSpecs(e.target.value)}
                  placeholder="Standar ISO, toleransi ketebalan, sertifikat pabrik uji tarik..."
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                >
                  Rilis Tender RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
