export const RISK_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Normal", value: "Normal" },
  { label: "Warning", value: "Warning" },
  { label: "High", value: "High" },
  { label: "Critical", value: "Critical" },
] as const;

export const INDUSTRY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Transportasi", value: "Transportasi" },
  { label: "Layanan & Software B2C", value: "Layanan & Software B2C" },
  { label: "Layanan & Software B2B", value: "Layanan & Software B2B" },
  { label: "Agen Perjalanan Online (OTA)", value: "Agen Perjalanan Online (OTA)" },
  { label: "Marketplace Komersial", value: "Marketplace Komersial" },
  { label: "Tiket & Reservasi", value: "Tiket & Reservasi" },
  { label: "E-Commerce Ritel", value: "E-Commerce Ritel" },
] as const;

export const SORT_OPTIONS = [
  { label: "Highest Chargeback Ratio", value: "cbr_desc" },
  { label: "Lowest Chargeback Ratio", value: "cbr_asc" },
  { label: "Highest Risk Score", value: "risk_desc" },
  { label: "Lowest Risk Score", value: "risk_asc" },
  { label: "Name (A-Z)", value: "name_asc" },
  { label: "Name (Z-A)", value: "name_desc" },
] as const;

export type RiskStatusValue = (typeof RISK_STATUS_OPTIONS)[number]["value"];
export type IndustryValue = (typeof INDUSTRY_OPTIONS)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface MerchantFilters {
  search: string;
  riskStatus: RiskStatusValue;
  industry: IndustryValue;
  sort: SortValue;
}

export const DEFAULT_MERCHANT_FILTERS: MerchantFilters = {
  search: "",
  riskStatus: "all",
  industry: "all",
  sort: "cbr_desc",
};
