"use client";

import React, { useState, useEffect } from "react";
import { RfqItem, SupplierBid } from "@/types/commerce";
import { formatCurrency, formatUSD, formatTimeRemaining } from "@/lib/utils";
import { Gavel, TrendingDown, Clock, ShieldCheck, CheckCircle2, AlertTriangle, ArrowDownRight } from "lucide-react";

interface RfqBiddingEngineProps {
  rfq: RfqItem;
  onAwardBid: (rfqId: string, bidId: string) => void;
  onSimulateSupplierBid: (rfqId: string) => void;
}

export function RfqBiddingEngine({ rfq, onAwardBid, onSimulateSupplierBid }: RfqBiddingEngineProps) {
  const [timeLeft, setTimeLeft] = useState<string>(formatTimeRemaining(rfq.deadlineIso));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(formatTimeRemaining(rfq.deadlineIso));
    }, 1000);
    return () => clearInterval(timer);
  }, [rfq.deadlineIso]);

  const sortedBids = [...rfq.bids].sort((a, b) => a.bidAmountPerUnit - b.bidAmountPerUnit);
  const lowestBid = sortedBids[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c1224] p-5 shadow-xl">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {rfq.rfqNumber}
            </span>
            <span className="text-xs text-slate-400 font-medium">{rfq.category}</span>
          </div>
          <h3 className="text-lg font-black text-white">{rfq.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{rfq.specsSummary}</p>
        </div>

        <div className="flex sm:flex-col items-end justify-between sm:justify-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono font-bold text-amber-300">{timeLeft}</span>
          </div>
          <span
            className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
              rfq.status === "ACTIVE_AUCTION"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse"
                : rfq.status === "AWARDED"
                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
          >
            {rfq.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Target Specs Summary Metric */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-800 text-xs">
        <div className="bg-[#080d1a] p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-slate-400 text-[10px]">Target Quantity</div>
          <div className="font-black text-white text-sm">
            {rfq.targetQuantity.toLocaleString()} {rfq.unit}
          </div>
        </div>
        <div className="bg-[#080d1a] p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-slate-400 text-[10px]">Max Price / Unit</div>
          <div className="font-black text-amber-400 text-sm">
            {rfq.currency === "IDR" ? formatCurrency(rfq.targetMaxPricePerUnit) : formatUSD(rfq.targetMaxPricePerUnit)}
          </div>
        </div>
        <div className="bg-[#080d1a] p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-slate-400 text-[10px]">Terms & Incoterm</div>
          <div className="font-black text-white text-sm">
            {rfq.preferredIncoterm} • {rfq.paymentTerm}
          </div>
        </div>
        <div className="bg-[#080d1a] p-2.5 rounded-xl border border-slate-800/80">
          <div className="text-slate-400 text-[10px]">Port of Delivery</div>
          <div className="font-black text-slate-300 text-sm truncate">{rfq.deliveryDestination}</div>
        </div>
      </div>

      {/* Live Reverse Auction Bids */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Reverse-Auction Bids ({rfq.bids.length})
            </h4>
          </div>
          {rfq.status !== "AWARDED" && (
            <button
              onClick={() => onSimulateSupplierBid(rfq.id)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-all flex items-center gap-1 active:scale-95"
            >
              <TrendingDown className="w-3 h-3" />
              <span>Simulasi Vendor Bid Turun</span>
            </button>
          )}
        </div>

        {sortedBids.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs bg-[#080d1a] rounded-xl border border-slate-800/60">
            Belum ada penawaran masuk dari vendor rekanan. Klik &quot;Simulasi Vendor Bid Turun&quot; untuk menguji reverse-auction.
          </div>
        ) : (
          <div className="space-y-2">
            {sortedBids.map((bid, idx) => {
              const isBest = idx === 0;
              const isAwarded = rfq.awardedSupplierId === bid.supplierId;
              const diffPercent = ((rfq.targetMaxPricePerUnit - bid.bidAmountPerUnit) / rfq.targetMaxPricePerUnit) * 100;

              return (
                <div
                  key={bid.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAwarded
                      ? "bg-blue-500/10 border-blue-500/40 shadow-md shadow-blue-500/10"
                      : isBest
                      ? "bg-emerald-500/5 border-emerald-500/30"
                      : "bg-[#090f20] border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isBest ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{bid.supplierName}</span>
                        {isBest && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/40 font-bold flex items-center gap-0.5">
                            <ArrowDownRight className="w-2.5 h-2.5" /> Best Bid
                          </span>
                        )}
                        {isAwarded && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded border border-blue-500/40 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Pemenang Tender (PO Issued)
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Lead Time: {bid.deliveryLeadDays} Hari</span>
                        <span>•</span>
                        <span>Incoterm: {bid.incotermOffered}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-mono">KYC Score: {bid.complianceRating}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div className="text-xs font-black text-white">
                        {rfq.currency === "IDR" ? formatCurrency(bid.bidAmountPerUnit) : formatUSD(bid.bidAmountPerUnit)}
                        <span className="text-[10px] text-slate-400 font-normal"> /{rfq.unit}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        Hemat {diffPercent.toFixed(1)}% ({rfq.currency === "IDR" ? formatCurrency(bid.totalBidAmount) : formatUSD(bid.totalBidAmount)} total)
                      </div>
                    </div>

                    {rfq.status !== "AWARDED" && (
                      <button
                        onClick={() => onAwardBid(rfq.id, bid.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1 active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Award PO</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
