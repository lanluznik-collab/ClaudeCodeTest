import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { calculateShipping } from "@/lib/config/shipping";
import { getSurcharge, PaymentMethodId } from "@/lib/config/payment";
import { getTieredUnitPrice } from "@/lib/pricing";
import { validatePromoCode } from "@/lib/promo";
import { finalizeOrderConfirmation } from "@/lib/orders/finalize-order-confirmation";
import { CartItem, Order } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER_REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateOrderRef(): string {
  let ref = "SLP-";
  for (let i = 0; i < 6; i++) {
    ref += ORDER_REF_CHARS[Math.floor(Math.random() * ORDER_REF_CHARS.length)];
  }
  return ref;
}

interface OrderRequestBody {
  items: CartItem[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  company_name?: string | null;
  vat_id?: string | null;
  payment_method: PaymentMethodId;
  discount_code?: string | null;
  consent_terms: boolean;
  consent_ruo: boolean;
  language?: "sl" | "en";
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderRequestBody = await req.json();
    const {
      items,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      company_name,
      vat_id,
      payment_method,
      discount_code,
      consent_terms,
      consent_ruo,
      language,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Košarica je prazna" }, { status: 400 });
    }
    if (!customer_name?.trim() || !customer_email?.trim() || !customer_phone?.trim() || !customer_address?.trim()) {
      return NextResponse.json({ error: "Manjkajo obvezni podatki" }, { status: 400 });
    }
    if (!EMAIL_RE.test(customer_email.trim())) {
      return NextResponse.json({ error: "Neveljaven e-poštni naslov" }, { status: 400 });
    }
    if (!["bank_transfer", "cod", "whatsapp"].includes(payment_method)) {
      return NextResponse.json({ error: "Neveljaven način plačila" }, { status: 400 });
    }
    if (!consent_terms || !consent_ruo) {
      return NextResponse.json({ error: "Potrebna sta oba obvezna soglasja" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Re-price every line server-side against the real product record —
    // never trust the client-supplied price. Falls back to the cart's
    // price only if the product has since been removed, so an order can
    // still be recorded rather than silently dropping the line.
    const productIds = items.map((i) => i.productId);
    const { data: products } = await supabase
      .from("products")
      .select("id, price")
      .in("id", productIds);

    const priceById = new Map((products ?? []).map((p) => [p.id, p.price as number]));

    let subtotal = 0;
    const pricedItems = items.map((item) => {
      const realPrice = priceById.get(item.productId) ?? item.price;
      const unitPrice = getTieredUnitPrice(realPrice, item.quantity);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      return { ...item, price: realPrice };
    });
    subtotal = Math.round(subtotal * 100) / 100;

    // Re-validate the discount code server-side rather than trusting a
    // client-supplied discount amount.
    let discountAmount = 0;
    let appliedCode: string | null = null;
    if (discount_code) {
      const result = await validatePromoCode(discount_code, subtotal);
      if (result.valid) {
        discountAmount = result.discountAmount;
        appliedCode = result.code;
      }
      // An invalid/expired code at this point is silently ignored rather
      // than blocking the order — the cart page already surfaces the error
      // before the customer ever reaches checkout.
    }

    const subtotalAfterDiscount = Math.round((subtotal - discountAmount) * 100) / 100;
    const shippingCost = calculateShipping(subtotalAfterDiscount);
    const codSurcharge = getSurcharge(payment_method);
    const total = Math.round((subtotalAfterDiscount + shippingCost + codSurcharge) * 100) / 100;

    const now = new Date().toISOString();
    const status = payment_method === "cod" ? "pending" : "pending_payment";

    // order_ref has a unique index; retry a couple of times on collision
    // rather than trusting a single random draw.
    let lastError: { message: string } | null = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const order_ref = generateOrderRef();
      const { data, error } = await supabase
        .from("orders")
        .insert({
          items: pricedItems,
          total,
          subtotal,
          shipping_cost: shippingCost,
          discount_code: appliedCode,
          discount_amount: discountAmount,
          cod_surcharge: codSurcharge,
          order_ref,
          customer_name: customer_name.trim(),
          customer_email: customer_email.trim(),
          customer_phone: customer_phone.trim(),
          customer_address: customer_address.trim(),
          company_name: company_name?.trim() || null,
          vat_id: vat_id?.trim() || null,
          payment_method,
          status,
          consent_terms_at: now,
          consent_ruo_at: now,
          language: language === "en" ? "en" : "sl",
        })
        .select()
        .single();

      if (!error) {
        console.log("[orders] created:", order_ref, payment_method, total);
        await finalizeOrderConfirmation(supabase, data as Order);
        return NextResponse.json({ order_ref });
      }

      // 23505 = unique_violation — order_ref collision, try again.
      if (error.code !== "23505") {
        lastError = error;
        break;
      }
      lastError = error;
    }

    console.error("[orders] insert failed:", lastError?.message);
    return NextResponse.json({ error: lastError?.message ?? "Napaka pri oddaji naročila" }, { status: 500 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[orders] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
