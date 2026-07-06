// Slovenian standard VAT rate. Displayed prices are VAT-inclusive, so the
// VAT portion is backed out of the total rather than added on top.
export const VAT_RATE = 0.22;

export function getVatPortion(amountInclVat: number): number {
  return amountInclVat - amountInclVat / (1 + VAT_RATE);
}
