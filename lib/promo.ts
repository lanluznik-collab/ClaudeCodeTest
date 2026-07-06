import { createServiceClient } from "@/lib/supabase/server";

export type PromoValidationResult =
  | { valid: true; code: string; type: "percent" | "fixed"; value: number; discountAmount: number }
  | { valid: false; reason: "not_found" | "inactive" | "expired" | "min_order"; minOrder?: number };

// Server-only: used by both the cart page's live preview (via
// /api/promo/route.ts) and order creation, which re-validates rather than
// trusting a client-supplied discount amount.
export async function validatePromoCode(
  rawCode: string,
  subtotal: number
): Promise<PromoValidationResult> {
  const code = rawCode.trim();
  if (!code) return { valid: false, reason: "not_found" };

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("promo_codes")
    .select("*")
    .ilike("code", code)
    .maybeSingle();

  if (!data) return { valid: false, reason: "not_found" };
  if (!data.active) return { valid: false, reason: "inactive" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, reason: "expired" };
  }
  if (data.min_order && subtotal < data.min_order) {
    return { valid: false, reason: "min_order", minOrder: data.min_order };
  }

  const rawDiscount =
    data.type === "percent" ? subtotal * (data.value / 100) : Math.min(data.value, subtotal);
  const discountAmount = Math.round(rawDiscount * 100) / 100;

  return { valid: true, code: data.code, type: data.type, value: data.value, discountAmount };
}
