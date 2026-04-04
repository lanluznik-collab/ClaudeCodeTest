import { CartItem, Product } from "@/types";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export function buildProductInquiryURL(
  product: Product,
  quantity: number = 1
): string {
  const message = encodeURIComponent(
    `Hi! I'm interested in ordering:\n\n` +
      `Product: ${product.name}\n` +
      `Quantity: ${quantity}\n` +
      `Price: $${(product.price * quantity).toFixed(2)}\n\n` +
      `Please confirm availability and payment details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export function buildCartOrderURL(
  items: CartItem[],
  subtotal: number
): string {
  const lines = items
    .map((i) => `• ${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
    .join("\n");

  const message = encodeURIComponent(
    `Hi! I'd like to place the following order:\n\n` +
      `${lines}\n\n` +
      `Total: $${subtotal.toFixed(2)}\n\n` +
      `Please confirm and send payment details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
