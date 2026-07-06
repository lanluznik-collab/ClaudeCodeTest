// Single source of truth for SloPeps' legal/business identity. The business
// is not yet formally registered, so the identity fields below are
// placeholders — swap them here (nowhere else) once registration completes.
// The IBAN/BIC are real: they're the same account already quoted to
// customers at checkout (app/checkout/success/page.tsx).
export const COMPANY = {
  legalName: "SloPeps [PRAVNA OBLIKA PENDING]",
  tradingName: "SloPeps",
  address: "[NASLOV PENDING]",
  postalCity: "[POŠTA PENDING]",
  country: "Slovenija",
  maticnaSt: "[MATIČNA ŠT. PENDING]",
  davcnaSt: "[DAVČNA ŠT. PENDING]",
  // Small business, not VAT-registered — documents must show the ZDDV-1
  // exemption clause instead of a DDV breakdown/line.
  vatExempt: true,
  iban: "SI56 0440 3026 6483 426",
  bic: "KBMASI2X",
  paymentDueDays: 3,
  adminEmail: "lanluznik@gmail.com",
  senderEmail: "SloPeps <noreply@slopeps.com>",
  contactEmail: "info@slopeps.com",
} as const;
