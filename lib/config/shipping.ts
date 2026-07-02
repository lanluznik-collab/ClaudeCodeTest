// Single source of truth for shipping terms. Update here — every price,
// threshold, region and delivery-time string sitewide reads from this file
// instead of being hardcoded per-component.
export const SHIPPING = {
  price: 3.9,
  freeThreshold: 80,
  region: {
    sl: "Slovenija",
    en: "Slovenia",
  },
  deliveryTime: {
    sl: "1–3 delovni dnevi",
    en: "1–3 business days",
  },
  euNote: {
    sl: "Za dostavo v EU in druge države nas kontaktirajte pred naročilom – pogoji se dogovorijo individualno.",
    en: "For delivery to the EU and other countries, please contact us before ordering – terms are arranged individually.",
  },
} as const;

export function calculateShipping(subtotal: number): number {
  return subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING.price;
}
