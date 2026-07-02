import { translations } from "@/lib/i18n";

type TlKey = keyof typeof translations.sl;

export interface ProductInfoSection {
  id: string;
  titleKey: TlKey;
  bodyKey: TlKey;
}

// Shared, non-per-product info shown as numbered collapsible accordions on
// every product page. Content lives once in lib/i18n.ts (both languages) —
// this file only defines which sections exist and their order, so nothing
// is duplicated per page.
export const PRODUCT_INFO_SECTIONS: ProductInfoSection[] = [
  { id: "quality",     titleKey: "prodQualityTitle",        bodyKey: "prodQualityBody" },
  { id: "usage",       titleKey: "prodAccUsageTitle",       bodyKey: "prodAccUsageBody" },
  { id: "transport",   titleKey: "prodAccTransportTitle",   bodyKey: "prodAccTransportBody" },
  { id: "storage-lyo", titleKey: "prodAccStorageLyoTitle",  bodyKey: "prodAccStorageLyoBody" },
  { id: "storage-sol", titleKey: "prodAccStorageSolTitle",  bodyKey: "prodAccStorageSolBody" },
];
