// Single source of truth for payment-method behavior. Update the surcharge
// here — every place that shows or charges it reads from this file.
export const PAYMENT_METHODS = {
  bankTransfer: { id: "bank_transfer", surcharge: 0 },
  cod: { id: "cod", surcharge: 1.5 },
  whatsapp: { id: "whatsapp", surcharge: 0 },
} as const;

export type PaymentMethodId =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]["id"];

export function getSurcharge(method: PaymentMethodId): number {
  return Object.values(PAYMENT_METHODS).find((m) => m.id === method)?.surcharge ?? 0;
}
