export type Incoterm = "FOB" | "CIF" | "EXW" | "DDP" | "CFR";
export type RfqStatus = "OPEN" | "ACTIVE_AUCTION" | "AWARDED" | "EXPIRED";
export type PaymentTerms = "Net 30" | "Net 60" | "Letter of Credit (LC)" | "Cash Against Documents (CAD)";

export interface SupplierBid {
  id: string;
  supplierId: string;
  supplierName: string;
  bidAmountPerUnit: number;
  totalBidAmount: number;
  deliveryLeadDays: number;
  incotermOffered: Incoterm;
  complianceRating: number; // 1 - 100
  submittedAt: string;
  isLowest?: boolean;
}

export interface RfqItem {
  id: string;
  rfqNumber: string;
  title: string;
  category: "Industrial Steel" | "Semiconductor ICs" | "Polymers & Resin" | "Heavy Machinery Parts" | "Solar Panels";
  sku: string;
  targetQuantity: number;
  unit: "Ton" | "Units" | "Barrels" | "Pcs" | "Rolls";
  targetMaxPricePerUnit: number;
  currency: "IDR" | "USD";
  deliveryDestination: string;
  preferredIncoterm: Incoterm;
  paymentTerm: PaymentTerms;
  status: RfqStatus;
  deadlineIso: string;
  specsSummary: string;
  bids: SupplierBid[];
  awardedSupplierId?: string;
}

export interface VolumePricingTier {
  id: string;
  minQty: number;
  maxQty: number | null; // null = infinity
  unitPriceUSD: number;
  unitPriceIDR: number;
  discountPercentage: number;
  leadTimeWeeks: number;
}

export interface WholesaleProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  basePriceUSD: number;
  basePriceIDR: number;
  moq: number;
  stockAvailable: number;
  unit: string;
  pricingTiers: VolumePricingTier[];
  technicalSpecs: Record<string, string>;
  certifications: string[];
}

export interface B2BQuoteRequest {
  id: string;
  productSku: string;
  productName: string;
  requestedQty: number;
  calculatedUnitPrice: number;
  totalSubtotal: number;
  estimatedVat11: number;
  grandTotal: number;
  buyerCompany: string;
  buyerEmail: string;
  notes: string;
  createdAt: string;
}

export type CreditRatingGrade = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC";

export interface VendorKycProfile {
  id: string;
  legalName: string;
  taxIdNpwp: string;
  country: string;
  industryCategory: string;
  creditGrade: CreditRatingGrade;
  creditScore: number; // 300 - 850
  creditLimitIDR: number;
  utilizedCreditIDR: number;
  paymentDefaultRiskPercent: number;
  onTimeDeliveryRate: number; // percentage
  defectRatePpm: number; // parts per million
  isAuditedEsg: boolean;
  isIso9001Certified: boolean;
  status: "VERIFIED" | "UNDER_REVIEW" | "SUSPENDED";
}

export interface B2BInvoice {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  buyerCompanyName: string;
  buyerNpwp: string;
  buyerAddress: string;
  sellerCompanyName: string;
  sellerNpwp: string;
  sellerAddress: string;
  itemDescription: string;
  quantity: number;
  unit: string;
  unitPriceIDR: number;
  subtotalIDR: number;
  vat11IDR: number;
  totalAmountIDR: number;
  paymentTerms: PaymentTerms;
  dueDate: string;
  issuedDate: string;
  status: "PAID" | "PENDING_PAYMENT" | "OVERDUE";
  authorizedSignatory: string;
}
