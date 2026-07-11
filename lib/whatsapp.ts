import { CartItem, Order, Product } from "@/types";
import { SHIPPING, calculateShipping } from "@/lib/config/shipping";
import { Lang } from "@/lib/language-store";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export function buildGeneralInquiryURL(lang: Lang = "sl"): string {
  const greeting =
    lang === "en"
      ? "Hello! I have a question about your products."
      : "Pozdravljeni! Imam vprašanje glede vaših izdelkov.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(greeting)}`;
}

export function buildProductInquiryURL(
  product: Product,
  quantity: number = 1
): string {
  const message = encodeURIComponent(
    `Pozdravljeni! Zanima me naslednji izdelek:\n\n` +
      `Izdelek: ${product.name}\n` +
      `Količina: ${quantity}\n` +
      `Cena: ${(product.price * quantity).toFixed(2)} €\n\n` +
      `Prosim potrdite razpoložljivost in podrobnosti plačila.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export function buildCartOrderURL(
  items: CartItem[],
  subtotal: number
): string {
  const shipping = calculateShipping(subtotal);
  const freeShipping = shipping === 0;
  const total = subtotal + shipping;

  const lines = items
    .map((i) => `• ${i.name} x${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €`)
    .join("\n");

  const shippingLine = freeShipping
    ? `Dostava: Brezplačno`
    : `Dostava: ${SHIPPING.price.toFixed(2).replace(".", ",")} €`;

  const message = encodeURIComponent(
    `Pozdravljeni! Rad/a bi oddal/a naslednje naročilo:\n\n` +
      `${lines}\n\n` +
      `${shippingLine}\n` +
      `Skupaj: ${total.toFixed(2)} €\n\n` +
      `Prosim potrdite in pošljite podatke za plačilo.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// Used on the confirmation page for orders placed with the WhatsApp payment
// method — the order is already priced and persisted server-side, so this
// builds the handoff message from the final stored totals rather than
// recomputing from a (by then cleared) cart.
export function buildOrderWhatsAppURL(
  order: Pick<Order, "items" | "order_ref" | "total">
): string {
  const lines = order.items
    .map((i) => `• ${i.name} x${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €`)
    .join("\n");

  const parts = [
    `Pozdravljeni! Rad/a bi potrdil/a naročilo ${order.order_ref ?? ""}:`,
    "",
    lines,
    "",
    `Skupaj: ${order.total.toFixed(2)} €`,
    "",
    "Prosim potrdite in pošljite podatke za plačilo.",
  ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join("\n"))}`;
}
