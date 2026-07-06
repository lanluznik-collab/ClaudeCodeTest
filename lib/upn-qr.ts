// UPN QR payload builder, per the Bank Association of Slovenia (ZBS-GIZ)
// "Technical standard of the QR Universal Payment Order" (v1.1, Oct 2016),
// section 5.2 "QR code record structure".
//
// The payload is 20 fields joined by "\n" (LF), in a fixed order, followed
// by a checksum: the summed character length of fields 1-19, each *including*
// its own trailing "\n", zero-padded to 3 digits. This is stated verbatim in
// the spec ("Value = strlen(N1+'\n') + strlen(N2+'\n') + ... + strlen(N19+'\n')")
// and matches the production DataLinx/php-upn-qr-generator library's
// `serializeContents()` (mb_strlen of the fields-1-to-19 string, itself
// already newline-terminated).
//
// The spec also requires the QR payload to be encoded as ISO-8859-2 with an
// explicit ECI(4) marker — a printed-form conformance requirement that no
// maintained JS QR library exposes cleanly via raw segment injection. Since
// ASCII bytes are identical across ISO-8859-2/UTF-8/Latin-1, we sidestep the
// encoding question entirely by transliterating diacritics in QR-payload
// fields only (never in human-readable PDF/email text) — this guarantees
// correct decoding on every banking app regardless of ECI support.

const DIACRITIC_MAP: Record<string, string> = {
  š: "s", Š: "S",
  č: "c", Č: "C",
  ž: "z", Ž: "Z",
  ć: "c", Ć: "C",
  đ: "d", Đ: "D",
  á: "a", à: "a", â: "a", ä: "a", ā: "a", Á: "A", À: "A", Â: "A", Ä: "A", Ā: "A",
  é: "e", è: "e", ê: "e", ë: "e", ē: "e", É: "E", È: "E", Ê: "E", Ë: "E", Ē: "E",
  í: "i", ì: "i", î: "i", ï: "i", ī: "i", Í: "I", Ì: "I", Î: "I", Ï: "I", Ī: "I",
  ó: "o", ò: "o", ô: "o", ö: "o", ō: "o", Ó: "O", Ò: "O", Ô: "O", Ö: "O", Ō: "O",
  ú: "u", ù: "u", û: "u", ü: "u", ū: "u", Ú: "U", Ù: "U", Û: "U", Ü: "U", Ū: "U",
  ñ: "n", Ñ: "N", ç: "c", Ç: "C",
};

// Maps known diacritics to ASCII; any other non-ASCII code point (outside
// the map) is dropped rather than passed through, since the QR payload must
// stay single-byte ASCII for the length/checksum math to hold.
export function transliterate(input: string): string {
  return Array.from(input)
    .map((ch) => DIACRITIC_MAP[ch] ?? (ch.charCodeAt(0) > 127 ? "" : ch))
    .join("");
}

// QR-payload fields: transliterated to ASCII, trimmed, truncated to the
// conventional 33-char field length used by name/street/city fields on the
// printed form.
function sanitizeField(value: string | null | undefined, maxLength = 33): string {
  if (!value) return "";
  return transliterate(value.trim()).slice(0, maxLength);
}

function formatAmountCents(amountEur: number): string {
  const cents = Math.round(amountEur * 100);
  return String(Math.max(0, cents)).padStart(11, "0");
}

function formatDateDDMMYYYY(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

export interface UpnQrParams {
  recipientIban: string;
  recipientName: string;
  recipientStreet: string;
  recipientCity: string;
  /** Defaults to "SI99" — the general/"no specific reference" model. */
  recipientReference?: string;
  payerName?: string;
  payerStreet?: string;
  payerCity?: string;
  /** Amount in EUR (e.g. 14.71). */
  amount: number;
  paymentDate?: Date | null;
  paymentDeadline?: Date | null;
  /** Exactly 4 uppercase letters, e.g. "GDDS" (purchase/sale of goods). */
  purposeCode: string;
  /** Free text, truncated to 42 characters per the printed form's field width. */
  purposeText: string;
  urgent?: boolean;
}

export function buildUpnQrPayload(params: UpnQrParams): string {
  const fields = [
    "UPNQR",
    "", // payer IBAN — not collected from customers
    "", // deposit
    "", // withdrawal
    "", // payer reference
    sanitizeField(params.payerName),
    sanitizeField(params.payerStreet),
    sanitizeField(params.payerCity),
    formatAmountCents(params.amount),
    params.paymentDate ? formatDateDDMMYYYY(params.paymentDate) : "",
    params.urgent ? "X" : "",
    params.purposeCode.toUpperCase().slice(0, 4),
    sanitizeField(params.purposeText, 42),
    params.paymentDeadline ? formatDateDDMMYYYY(params.paymentDeadline) : "",
    params.recipientIban.replace(/\s/g, ""),
    sanitizeField(params.recipientReference || "SI99", 26),
    sanitizeField(params.recipientName),
    sanitizeField(params.recipientStreet),
    sanitizeField(params.recipientCity),
  ];

  const body = fields.map((f) => f + "\n").join("");
  const checksum = String(body.length).padStart(3, "0");

  return body + checksum;
}
