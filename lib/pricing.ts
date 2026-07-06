import { CartItem } from "@/types";

// Single source of truth for the quantity-discount schedule. Used by the
// product page's informational tier table and by the cart/checkout, where
// it's actually applied to line totals based on the quantity in the cart.
export const QUANTITY_TIERS = [
  { minQty: 1, maxQty: 4, discountPct: 0 },
  { minQty: 5, maxQty: 8, discountPct: 10 },
  { minQty: 9, maxQty: Infinity, discountPct: 15 },
] as const;

export function getDiscountPctForQty(qty: number): number {
  const tier = QUANTITY_TIERS.find((t) => qty >= t.minQty && qty <= t.maxQty);
  return tier?.discountPct ?? 0;
}

// `basePrice` is the list price captured on the cart item; the effective
// per-unit price is derived live from the current quantity so it updates
// as the customer adjusts quantity in the cart.
export function getTieredUnitPrice(basePrice: number, qty: number): number {
  const pct = getDiscountPctForQty(qty);
  return basePrice * (1 - pct / 100);
}

export function getLineTotal(item: CartItem): number {
  return getTieredUnitPrice(item.price, item.quantity) * item.quantity;
}

// Subtotal across the whole cart with quantity-tier discounts applied
// per line — this is the number free-shipping thresholds, VAT, and promo
// codes should all be computed from, not the flat price*qty sum.
export function calculateCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getLineTotal(item), 0);
}

// Mirrors the server-side math in lib/promo.ts so the cart/checkout UI can
// show a live discount amount as the subtotal changes (quantity edits,
// item removal) without round-tripping to the API on every keystroke. The
// server independently recomputes this at order submission — this is
// display-only, never the source of truth.
export function computeDiscountAmount(
  type: "percent" | "fixed",
  value: number,
  subtotal: number
): number {
  const raw = type === "percent" ? subtotal * (value / 100) : Math.min(value, subtotal);
  return Math.round(raw * 100) / 100;
}
