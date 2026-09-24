"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  RfqItem,
  WholesaleProduct,
  B2BQuoteRequest,
  SupplierBid,
  VendorKycProfile,
  B2BInvoice,
} from "@/types/commerce";

const INITIAL_RFQS: RfqItem[] = [
  {
    id: "rfq-101",
    rfqNumber: "RFQ-2026-ST-092",
    title: "Cold-Rolled Steel Coils ASTM A1008 Grade 50",
    category: "Industrial Steel",
    sku: "STL-CR-A1008",
    targetQuantity: 500,
    unit: "Ton",
    targetMaxPricePerUnit: 14500000,
    currency: "IDR",
    deliveryDestination: "Kawasan Industri MM2100 Cikarang",
    preferredIncoterm: "DDP",
    paymentTerm: "Net 60",
    status: "ACTIVE_AUCTION",
    deadlineIso: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    specsSummary: "Thickness 1.2mm, Width 1219mm, Tensile Strength >= 450 MPa, Mill Test Certificate required.",
    bids: [
      {
        id: "bid-1",
        supplierId: "sup-pt-krakatau",
        supplierName: "PT Krakatau Mega Baja Tbk",
        bidAmountPerUnit: 14100000,
        totalBidAmount: 7050000000,
        deliveryLeadDays: 14,
        incotermOffered: "DDP",
        complianceRating: 98,
        submittedAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      },
      {
        id: "bid-2",
        supplierId: "sup-posco-indo",
        supplierName: "PT Posco Steel Indonesia",
        bidAmountPerUnit: 13900000,
        totalBidAmount: 6950000000,
        deliveryLeadDays: 12,
        incotermOffered: "DDP",
        complianceRating: 95,
        submittedAt: new Date(Date.now() - 1800 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "rfq-102",
    rfqNumber: "RFQ-2026-IC-441",
    title: "Industrial Grade Microcontroller STM32H753BIT6",
    category: "Semiconductor ICs",
    sku: "SEMI-STM32H753",
    targetQuantity: 10000,
    unit: "Units",
    targetMaxPricePerUnit: 18.5,
    currency: "USD",
    deliveryDestination: "Batam Free Trade Zone Bonded Warehouse",
    preferredIncoterm: "CIF",
    paymentTerm: "Letter of Credit (LC)",
    status: "ACTIVE_AUCTION",
    deadlineIso: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    specsSummary: "LQFP-208 Package, 480MHz Arm Cortex-M7, Traceability Tape & Reel standard.",
    bids: [
      {
        id: "bid-3",
        supplierId: "sup-arrow-asia",
        supplierName: "Arrow Asia Chip Distribution Ltd",
        bidAmountPerUnit: 17.8,
        totalBidAmount: 178000,
        deliveryLeadDays: 7,
        incotermOffered: "CIF",
        complianceRating: 99,
        submittedAt: new Date(Date.now() - 7200 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "rfq-103",
    rfqNumber: "RFQ-2026-SOLAR-08",
    title: "Monocrystalline Solar PV Modules 580W Tier 1",
    category: "Solar Panels",
    sku: "SOLAR-MONO-580W",
    targetQuantity: 2500,
    unit: "Units",
    targetMaxPricePerUnit: 1650000,
    currency: "IDR",
    deliveryDestination: "PLTS Cirata Floating Project Site",
    preferredIncoterm: "CIF",
    paymentTerm: "Net 30",
    status: "OPEN",
    deadlineIso: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
    specsSummary: "Bifacial glass-glass, 22.8% module efficiency, IEC 61215/61730 certified, 25-yr warranty.",
    bids: [],
  },
];

const INITIAL_PRODUCTS: WholesaleProduct[] = [
  {
    id: "prod-1",
    sku: "CHEM-RESIN-EPOXY-828",
    name: "Liquid Epoxy Resin DGEBA Standard Grade",
    category: "Polymers & Resin",
    basePriceUSD: 2.85,
    basePriceIDR: 44500,
    moq: 80,
    stockAvailable: 2400,
    unit: "Barrels (200kg)",
    pricingTiers: [
      { id: "tier-1", minQty: 80, maxQty: 200, unitPriceUSD: 2.85, unitPriceIDR: 44500, discountPercentage: 0, leadTimeWeeks: 1 },
      { id: "tier-2", minQty: 201, maxQty: 500, unitPriceUSD: 2.65, unitPriceIDR: 41300, discountPercentage: 7.2, leadTimeWeeks: 2 },
      { id: "tier-3", minQty: 501, maxQty: 1000, unitPriceUSD: 2.45, unitPriceIDR: 38200, discountPercentage: 14.1, leadTimeWeeks: 3 },
      { id: "tier-4", minQty: 1001, maxQty: null, unitPriceUSD: 2.2, unitPriceIDR: 34300, discountPercentage: 22.8, leadTimeWeeks: 4 },
    ],
    technicalSpecs: {
      "Epoxide Equivalent Weight": "184 - 190 g/eq",
      "Viscosity @ 25°C": "11,000 - 15,000 mPa.s",
      "Color (Gardner)": "0.5 Max",
      "Hydrolyzable Chlorine": "<= 0.05 %",
    },
    certifications: ["ISO 9001:2015", "REACH Registered", "RoHS Compliant"],
  },
  {
    id: "prod-2",
    sku: "STEEL-BEAM-H400",
    name: "Hot Rolled Structural Steel H-Beam 400x200x8x13mm",
    category: "Industrial Steel",
    basePriceUSD: 850,
    basePriceIDR: 13200000,
    moq: 20,
    stockAvailable: 450,
    unit: "Ton",
    pricingTiers: [
      { id: "tier-1", minQty: 20, maxQty: 50, unitPriceUSD: 850, unitPriceIDR: 13200000, discountPercentage: 0, leadTimeWeeks: 1 },
      { id: "tier-2", minQty: 51, maxQty: 150, unitPriceUSD: 810, unitPriceIDR: 12600000, discountPercentage: 4.5, leadTimeWeeks: 2 },
      { id: "tier-3", minQty: 151, maxQty: 300, unitPriceUSD: 765, unitPriceIDR: 11900000, discountPercentage: 9.8, leadTimeWeeks: 3 },
      { id: "tier-4", minQty: 301, maxQty: null, unitPriceUSD: 720, unitPriceIDR: 11200000, discountPercentage: 15.1, leadTimeWeeks: 5 },
    ],
    technicalSpecs: {
      Standard: "JIS G3101 SS400 / ASTM A36",
      Length: "12,000 mm",
      "Tensile Strength": "400 - 510 N/mm²",
      "Yield Point": ">= 245 N/mm²",
    },
    certifications: ["SNI 07-0329-2005", "CE Mark EN10025"],
  },
];

const INITIAL_VENDORS: VendorKycProfile[] = [
  {
    id: "ven-01",
    legalName: "PT Krakatau Mega Baja Tbk",
    taxIdNpwp: "01.000.123.4-051.000",
    country: "Indonesia",
    industryCategory: "Steel & Metallurgy",
    creditGrade: "AAA",
    creditScore: 840,
    creditLimitIDR: 50000000000,
    utilizedCreditIDR: 21500000000,
    paymentDefaultRiskPercent: 0.12,
    onTimeDeliveryRate: 98.4,
    defectRatePpm: 120,
    isAuditedEsg: true,
    isIso9001Certified: true,
    status: "VERIFIED",
  },
  {
    id: "ven-02",
    legalName: "PT Posco Steel Indonesia",
    taxIdNpwp: "02.345.678.9-073.000",
    country: "Indonesia",
    industryCategory: "Structural Steel Fabrication",
    creditGrade: "AA",
    creditScore: 785,
    creditLimitIDR: 35000000000,
    utilizedCreditIDR: 14200000000,
    paymentDefaultRiskPercent: 0.45,
    onTimeDeliveryRate: 96.2,
    defectRatePpm: 210,
    isAuditedEsg: true,
    isIso9001Certified: true,
    status: "VERIFIED",
  },
  {
    id: "ven-03",
    legalName: "Arrow Asia Chip Distribution Ltd",
    taxIdNpwp: "99.888.777.6-092.000",
    country: "Singapore / Batam Free Trade Zone",
    industryCategory: "Semiconductor Distribution",
    creditGrade: "AAA",
    creditScore: 825,
    creditLimitIDR: 45000000000,
    utilizedCreditIDR: 8900000000,
    paymentDefaultRiskPercent: 0.18,
    onTimeDeliveryRate: 99.1,
    defectRatePpm: 45,
    isAuditedEsg: true,
    isIso9001Certified: true,
    status: "VERIFIED",
  },
  {
    id: "ven-04",
    legalName: "CV Prima Kimia Polymer Indo",
    taxIdNpwp: "03.111.222.3-412.000",
    country: "Indonesia",
    industryCategory: "Chemical & Resins",
    creditGrade: "BBB",
    creditScore: 680,
    creditLimitIDR: 12000000000,
    utilizedCreditIDR: 10500000000,
    paymentDefaultRiskPercent: 2.15,
    onTimeDeliveryRate: 91.5,
    defectRatePpm: 840,
    isAuditedEsg: false,
    isIso9001Certified: true,
    status: "UNDER_REVIEW",
  },
];

const INITIAL_INVOICES: B2BInvoice[] = [
  {
    id: "inv-2026-001",
    invoiceNumber: "INV/FC/2026/09/0084",
    poNumber: "PO-2026-ST-092-A1",
    buyerCompanyName: "PT Industri Manufaktur Nusantara Tbk",
    buyerNpwp: "01.234.567.8-012.000",
    buyerAddress: "Kawasan Industri KIIC Kav. 45, Karawang Barat, Jawa Barat",
    sellerCompanyName: "PT ForgeCommerce B2B Nusantara",
    sellerNpwp: "31.456.789.0-034.000",
    sellerAddress: "Forge Tower Fl. 28, SCBD Kav. 52-53, Jakarta Selatan",
    itemDescription: "Cold-Rolled Steel Coils ASTM A1008 Grade 50 (Thickness 1.2mm x 1219mm)",
    quantity: 500,
    unit: "Ton",
    unitPriceIDR: 13900000,
    subtotalIDR: 6950000000,
    vat11IDR: 764500000,
    totalAmountIDR: 7714500000,
    paymentTerms: "Net 60",
    dueDate: "2026-11-23",
    issuedDate: "2026-09-24",
    status: "PENDING_PAYMENT",
    authorizedSignatory: "Hendra Wijaya, S.E., M.Ak. (Head of Corporate Tax)",
  },
  {
    id: "inv-2026-002",
    invoiceNumber: "INV/FC/2026/09/0085",
    poNumber: "PO-2026-CHEM-828",
    buyerCompanyName: "PT Delta Polychem Coating Indo",
    buyerNpwp: "02.876.543.2-045.000",
    buyerAddress: "Jl. Rungkut Industri Raya No. 12, Surabaya, Jawa Timur",
    sellerCompanyName: "PT ForgeCommerce B2B Nusantara",
    sellerNpwp: "31.456.789.0-034.000",
    sellerAddress: "Forge Tower Fl. 28, SCBD Kav. 52-53, Jakarta Selatan",
    itemDescription: "Liquid Epoxy Resin DGEBA Standard Grade (200kg Barrels)",
    quantity: 500,
    unit: "Barrels",
    unitPriceIDR: 41300,
    subtotalIDR: 20650000,
    vat11IDR: 2271500,
    totalAmountIDR: 22921500,
    paymentTerms: "Net 30",
    dueDate: "2026-10-24",
    issuedDate: "2026-09-24",
    status: "PAID",
    authorizedSignatory: "Hendra Wijaya, S.E., M.Ak. (Head of Corporate Tax)",
  },
];

interface CommerceContextType {
  rfqs: RfqItem[];
  products: WholesaleProduct[];
  quoteRequests: B2BQuoteRequest[];
  vendors: VendorKycProfile[];
  invoices: B2BInvoice[];
  createRfq: (rfqData: Omit<RfqItem, "id" | "rfqNumber" | "bids" | "status">) => void;
  awardBid: (rfqId: string, bidId: string) => void;
  simulateSupplierBid: (rfqId: string) => void;
  submitQuoteRequest: (quote: Omit<B2BQuoteRequest, "id" | "createdAt">) => void;
  adjustVendorCredit: (vendorId: string, newLimitIDR: number) => void;
  toggleVendorStatus: (vendorId: string) => void;
  markInvoicePaid: (invoiceId: string) => void;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [rfqs, setRfqs] = useState<RfqItem[]>(INITIAL_RFQS);
  const [products] = useState<WholesaleProduct[]>(INITIAL_PRODUCTS);
  const [quoteRequests, setQuoteRequests] = useState<B2BQuoteRequest[]>([]);
  const [vendors, setVendors] = useState<VendorKycProfile[]>(INITIAL_VENDORS);
  const [invoices, setInvoices] = useState<B2BInvoice[]>(INITIAL_INVOICES);

  // LocalStorage Sync
  useEffect(() => {
    const savedRfqs = localStorage.getItem("FORGECOMMERCE_RFQS");
    if (savedRfqs) {
      try {
        setRfqs(JSON.parse(savedRfqs));
      } catch (e) {
        console.error("Failed to parse saved RFQs", e);
      }
    }
    const savedInvoices = localStorage.getItem("FORGECOMMERCE_INVOICES");
    if (savedInvoices) {
      try {
        setInvoices(JSON.parse(savedInvoices));
      } catch (e) {
        console.error("Failed to parse saved Invoices", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("FORGECOMMERCE_RFQS", JSON.stringify(rfqs));
  }, [rfqs]);

  useEffect(() => {
    localStorage.setItem("FORGECOMMERCE_INVOICES", JSON.stringify(invoices));
  }, [invoices]);

  const createRfq = (rfqData: Omit<RfqItem, "id" | "rfqNumber" | "bids" | "status">) => {
    const newId = `rfq-${Date.now()}`;
    const newRfq: RfqItem = {
      ...rfqData,
      id: newId,
      rfqNumber: `RFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "OPEN",
      bids: [],
    };
    setRfqs((prev) => [newRfq, ...prev]);
  };

  const awardBid = (rfqId: string, bidId: string) => {
    setRfqs((prev) =>
      prev.map((rfq) => {
        if (rfq.id !== rfqId) return rfq;
        const targetBid = rfq.bids.find((b) => b.id === bidId);
        return {
          ...rfq,
          status: "AWARDED",
          awardedSupplierId: targetBid?.supplierId,
        };
      })
    );
  };

  const simulateSupplierBid = (rfqId: string) => {
    const supplierNames = [
      "PT Global Indoprima Perkasa",
      "Apex Metals International",
      "Sinarmas Heavy Industrial Corp",
      "Sumitomo Shoji Asia Pte Ltd",
      "Delta Logistics & Supply",
    ];

    setRfqs((prev) =>
      prev.map((rfq) => {
        if (rfq.id !== rfqId) return rfq;
        const currentLowest =
          rfq.bids.length > 0
            ? Math.min(...rfq.bids.map((b) => b.bidAmountPerUnit))
            : rfq.targetMaxPricePerUnit;

        const discountFactor = 0.95 - Math.random() * 0.03;
        const newBidPrice = Math.round(currentLowest * discountFactor);
        const randomSupplier = supplierNames[Math.floor(Math.random() * supplierNames.length)];

        const newBid: SupplierBid = {
          id: `bid-${Date.now()}`,
          supplierId: `sup-${Date.now()}`,
          supplierName: randomSupplier,
          bidAmountPerUnit: newBidPrice,
          totalBidAmount: newBidPrice * rfq.targetQuantity,
          deliveryLeadDays: Math.floor(7 + Math.random() * 14),
          incotermOffered: rfq.preferredIncoterm,
          complianceRating: Math.floor(88 + Math.random() * 11),
          submittedAt: new Date().toISOString(),
        };

        return {
          ...rfq,
          status: "ACTIVE_AUCTION",
          bids: [newBid, ...rfq.bids],
        };
      })
    );
  };

  const submitQuoteRequest = (quoteData: Omit<B2BQuoteRequest, "id" | "createdAt">) => {
    const newQuote: B2BQuoteRequest = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setQuoteRequests((prev) => [newQuote, ...prev]);
  };

  const adjustVendorCredit = (vendorId: string, newLimitIDR: number) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, creditLimitIDR: newLimitIDR } : v))
    );
  };

  const toggleVendorStatus = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id !== vendorId) return v;
        const nextStatus = v.status === "VERIFIED" ? "UNDER_REVIEW" : "VERIFIED";
        return { ...v, status: nextStatus };
      })
    );
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: "PAID" } : inv))
    );
  };

  return (
    <CommerceContext.Provider
      value={{
        rfqs,
        products,
        quoteRequests,
        vendors,
        invoices,
        createRfq,
        awardBid,
        simulateSupplierBid,
        submitQuoteRequest,
        adjustVendorCredit,
        toggleVendorStatus,
        markInvoicePaid,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used within a CommerceProvider");
  return ctx;
}
