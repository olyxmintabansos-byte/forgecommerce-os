"use client";

import React, { useState } from "react";
import { useCommerce } from "@/context/CommerceContext";
import { B2BInvoice } from "@/types/commerce";
import { formatCurrency } from "@/lib/utils";
import {
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  Building2,
  ArrowRight,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

export default function B2bInvoicesPage() {
  const { invoices, markInvoicePaid } = useCommerce();
  const [selectedInvoice, setSelectedInvoice] = useState<B2BInvoice>(invoices[0]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>B2B Proforma &amp; Tax Invoice Engine</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
              FAKTUR PAJAK A4
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Penerbitan faktur proforma wholesale resmi, perhitungan tarif PPN 11%, dan cetak A4 berstempel korporasi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedInvoice.status !== "PAID" && (
            <button
              onClick={() => markInvoicePaid(selectedInvoice.id)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tandai LUNAS (Paid)</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Faktur A4 Resmi</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Invoice Selector Sidebar */}
        <div className="space-y-3 print:hidden">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Daftar Faktur B2B ({invoices.length})
          </h2>
          {invoices.map((inv) => {
            const isSelected = inv.id === selectedInvoice.id;
            return (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoice(inv)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all text-xs ${
                  isSelected
                    ? "bg-[#0f1730] border-amber-500/60 shadow-lg shadow-amber-500/10"
                    : "bg-[#090f20] border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-amber-400">{inv.invoiceNumber}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                      inv.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
                <div className="text-white font-bold truncate mt-1">{inv.buyerCompanyName}</div>
                <div className="text-[10px] text-slate-400 mt-2 flex justify-between">
                  <span>Due: {inv.dueDate}</span>
                  <span className="font-mono text-slate-200">{formatCurrency(inv.totalAmountIDR)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pixel-Perfect A4 Sheet Preview & Print Document */}
        <div className="lg:col-span-3 flex justify-center">
          <div className="w-full max-w-[800px] bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 font-sans">
            {/* Header Surat Kop Resmi */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
              <div>
                <div className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                  {selectedInvoice.sellerCompanyName}
                </div>
                <div className="text-xs text-slate-600 mt-1 max-w-sm">
                  {selectedInvoice.sellerAddress}
                </div>
                <div className="text-xs font-mono font-bold text-slate-700 mt-1">
                  NPWP: {selectedInvoice.sellerNpwp}
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded bg-slate-100 border border-slate-300 text-xs font-black tracking-widest text-slate-800 uppercase mb-2">
                  FAKTUR PAJAK &amp; PROFORMA
                </div>
                <div className="text-sm font-black text-slate-900 font-mono">
                  {selectedInvoice.invoiceNumber}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">PO Ref: {selectedInvoice.poNumber}</div>
              </div>
            </div>

            {/* B2B Buyer & Seller Info */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  TAGIHAN KEPADA (BUYER):
                </div>
                <div className="font-black text-slate-900 text-sm">{selectedInvoice.buyerCompanyName}</div>
                <div className="text-slate-600 mt-1">{selectedInvoice.buyerAddress}</div>
                <div className="font-mono text-slate-700 font-bold mt-1.5">
                  NPWP: {selectedInvoice.buyerNpwp}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  DETAIL PEMBAYARAN:
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Tanggal Terbit:</span>
                  <span className="font-bold text-slate-800">{selectedInvoice.issuedDate}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Jatuh Tempo:</span>
                  <span className="font-bold text-red-600">{selectedInvoice.dueDate}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Syarat Pembayaran:</span>
                  <span className="font-bold text-slate-800">{selectedInvoice.paymentTerms}</span>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-black">
                  <tr>
                    <th className="py-3 px-4">Deskripsi Komoditas / Barang</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Harga Satuan (IDR)</th>
                    <th className="py-3 px-4 text-right">Jumlah (IDR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{selectedInvoice.itemDescription}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Standard Industrial Quality &amp; Mill Certificate Attached
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold">
                      {selectedInvoice.quantity} {selectedInvoice.unit}
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {formatCurrency(selectedInvoice.unitPriceIDR)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold">
                      {formatCurrency(selectedInvoice.subtotalIDR)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end mb-8 text-xs">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Dasar Pengenaan Pajak:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(selectedInvoice.subtotalIDR)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>PPN 11% (UU Harmonisasi Pajak):</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(selectedInvoice.vat11IDR)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                  <span>TOTAL TAGIHAN RESMI:</span>
                  <span className="font-mono">{formatCurrency(selectedInvoice.totalAmountIDR)}</span>
                </div>
              </div>
            </div>

            {/* Bank Transfer & Authorized Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  REKENING RESMI SETELMEN:
                </div>
                <div className="font-bold text-slate-900">Bank Mandiri Cabang Sudirman</div>
                <div className="font-mono text-slate-800">No. Rek: 122-00-9876543-2</div>
                <div className="text-slate-600">a/n PT ForgeCommerce B2B Nusantara</div>
              </div>

              <div className="text-center flex flex-col items-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-8">
                  OTORISASI DEPARTEMEN PERPAJAKAN
                </div>
                <div className="w-24 h-12 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 mb-2">
                  [STEMPEL ELEKTRONIK]
                </div>
                <div className="font-black text-slate-900 text-xs">{selectedInvoice.authorizedSignatory}</div>
                <div className="text-[10px] text-slate-500">Authorized Corporate Tax Agent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
