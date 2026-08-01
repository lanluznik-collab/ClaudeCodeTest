import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Hr,
} from "@react-email/components";
import { Order } from "@/types";
import { COMPANY } from "@/lib/config/company";
import { getTieredUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

interface Props {
  order: Order;
  lang: "sl" | "en";
}

const copy = {
  sl: {
    preview: (name: string) => `Naročilo ${name} je potrjeno — SloPeps`,
    banner: (name: string) => `Naročilo uspešno potrjeno, ${name}!`,
    bannerBody: "Hvala za vaše naročilo. Spodaj je povzetek in vsi podatki o plačilu.",
    orderNumber: "Št. naročila",
    orderDate: "Datum naročila",
    paymentMethod: "Način plačila",
    paymentMethods: { bank_transfer: "Bančno nakazilo", cod: "Plačilo po povzetju", whatsapp: "WhatsApp" },
    product: "Izdelek",
    qty: "Kol.",
    unitPrice: "Cena/kos",
    lineTotal: "Skupaj",
    subtotal: "Vmesni seštevek",
    discount: "Popust",
    shipping: "Dostava",
    free: "Brezplačno",
    codSurcharge: "Doplačilo po povzetju",
    total: "Skupaj za plačilo",
    bankTransferTitle: "Predračun je priložen temu e-mailu",
    bankTransferBody: (due: string) =>
      `Prosimo, nakažite znesek na spodnje bančne podatke do ${due}. Naročilo bo odposlano po prejemu plačila.`,
    codTitle: "Plačate ob prevzemu",
    codBody: (total: string) => `Ob prevzemu paketa plačate ${total} dostavljavcu.`,
    iban: "IBAN",
    bic: "BIC/SWIFT",
    recipient: "Prejemnik",
    deliveryAddress: "Naslov za dostavo",
    declarationNotice: "Izjavi kupca (SL/EN) je priložena temu e-mailu — prosimo, podpisano vrnite ob prevzemu, če je to zahtevano.",
    footerLegal: `${COMPANY.legalName} · ${COMPANY.address}, ${COMPANY.postalCity} · Matična št.: ${COMPANY.maticnaSt} · Davčna št.: ${COMPANY.davcnaSt}`,
    ruo: "Izdelki so namenjeni izključno za raziskovalne namene (Research Use Only) — niso zdravilo, prehransko dopolnilo ali kozmetični izdelek in niso namenjeni za uživanje ali uporabo na ljudeh ali živalih.",
    contact: `Vprašanja? Pišite nam na ${COMPANY.contactEmail}`,
  },
  en: {
    preview: (name: string) => `Order ${name} confirmed — SloPeps`,
    banner: (name: string) => `Order successfully confirmed, ${name}!`,
    bannerBody: "Thank you for your order. Below is a summary and all payment details.",
    orderNumber: "Order no.",
    orderDate: "Order date",
    paymentMethod: "Payment method",
    paymentMethods: { bank_transfer: "Bank transfer", cod: "Cash on delivery", whatsapp: "WhatsApp" },
    product: "Product",
    qty: "Qty",
    unitPrice: "Unit price",
    lineTotal: "Total",
    subtotal: "Subtotal",
    discount: "Discount",
    shipping: "Shipping",
    free: "Free",
    codSurcharge: "COD surcharge",
    total: "Total due",
    bankTransferTitle: "The pro forma invoice is attached to this email",
    bankTransferBody: (due: string) =>
      `Please transfer the amount to the bank details below by ${due}. Your order will ship once payment is received.`,
    codTitle: "Pay on delivery",
    codBody: (total: string) => `You will pay ${total} to the courier on delivery.`,
    iban: "IBAN",
    bic: "BIC/SWIFT",
    recipient: "Recipient",
    deliveryAddress: "Delivery address",
    declarationNotice: "The buyer's declaration (SL/EN) is attached to this email — please return it signed on delivery if required.",
    footerLegal: `${COMPANY.legalName} · ${COMPANY.address}, ${COMPANY.postalCity} · Reg. no.: ${COMPANY.maticnaSt} · Tax no.: ${COMPANY.davcnaSt}`,
    ruo: "Products are intended for research use only (RUO) — they are not a medicine, dietary supplement or cosmetic product, and are not intended for consumption or use on humans or animals.",
    contact: `Questions? Email us at ${COMPANY.contactEmail}`,
  },
} as const;

const colors = {
  bg: "#F4F8F7",
  card: "#FFFFFF",
  dark: "#14201F",
  footerBg: "#062A2B",
  accent: "#0F766E",
  accentOnDark: "#2DD4BF",
  accentTint: "#E6F7F5",
  textMuted: "#5B6B6A",
  border: "#E2ECEA",
};

export function OrderConfirmationEmail({ order, lang }: Props) {
  const t = copy[lang];
  const locale = lang === "en" ? "en-GB" : "sl-SI";
  const orderDate = new Date(order.created_at).toLocaleDateString(locale);
  const dueDate = new Date(order.created_at);
  dueDate.setDate(dueDate.getDate() + COMPANY.paymentDueDays);

  return (
    <Html>
      <Head />
      <Preview>{t.preview(order.customer_name ?? "")}</Preview>
      <Body style={{ backgroundColor: colors.bg, fontFamily: "Helvetica, Arial, sans-serif", padding: "24px 0" }}>
        <Container style={{ backgroundColor: colors.card, maxWidth: 560, borderRadius: 6, overflow: "hidden" }}>
          <Section style={{ padding: "28px 32px 8px" }}>
            <Heading style={{ fontSize: 20, color: colors.dark, margin: "0 0 8px" }}>
              {t.banner(order.customer_name ?? "")}
            </Heading>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>{t.bannerBody}</Text>
          </Section>

          <Section style={{ padding: "0 32px" }}>
            <Row>
              <Column>
                <Text style={{ fontSize: 11, color: colors.textMuted, margin: 0 }}>{t.orderNumber}</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, margin: "2px 0 0" }}>{order.order_ref}</Text>
              </Column>
              <Column>
                <Text style={{ fontSize: 11, color: colors.textMuted, margin: 0 }}>{t.orderDate}</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, margin: "2px 0 0" }}>{orderDate}</Text>
              </Column>
              <Column>
                <Text style={{ fontSize: 11, color: colors.textMuted, margin: 0 }}>{t.paymentMethod}</Text>
                <Text style={{ fontSize: 14, fontWeight: 700, margin: "2px 0 0" }}>
                  {t.paymentMethods[order.payment_method]}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "20px 0" }} />

          <Section style={{ padding: "0 32px" }}>
            <Row style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: 6 }}>
              <Column style={{ width: "46%" }}>
                <Text style={{ fontSize: 10, textTransform: "uppercase", color: colors.textMuted, margin: 0 }}>
                  {t.product}
                </Text>
              </Column>
              <Column style={{ width: "18%", textAlign: "right" }}>
                <Text style={{ fontSize: 10, textTransform: "uppercase", color: colors.textMuted, margin: 0 }}>
                  {t.qty}
                </Text>
              </Column>
              <Column style={{ width: "18%", textAlign: "right" }}>
                <Text style={{ fontSize: 10, textTransform: "uppercase", color: colors.textMuted, margin: 0 }}>
                  {t.unitPrice}
                </Text>
              </Column>
              <Column style={{ width: "18%", textAlign: "right" }}>
                <Text style={{ fontSize: 10, textTransform: "uppercase", color: colors.textMuted, margin: 0 }}>
                  {t.lineTotal}
                </Text>
              </Column>
            </Row>

            {order.items.map((item, i) => {
              const unitPrice = getTieredUnitPrice(item.price, item.quantity);
              const lineTotal = unitPrice * item.quantity;
              return (
                <Row key={i} style={{ borderBottom: `1px solid ${colors.border}`, padding: "8px 0" }}>
                  <Column style={{ width: "46%" }}>
                    <Text style={{ fontSize: 13, margin: "8px 0" }}>{item.name}</Text>
                  </Column>
                  <Column style={{ width: "18%", textAlign: "right" }}>
                    <Text style={{ fontSize: 13, margin: "8px 0" }}>{item.quantity}</Text>
                  </Column>
                  <Column style={{ width: "18%", textAlign: "right" }}>
                    <Text style={{ fontSize: 13, margin: "8px 0" }}>{formatPrice(unitPrice)}</Text>
                  </Column>
                  <Column style={{ width: "18%", textAlign: "right" }}>
                    <Text style={{ fontSize: 13, margin: "8px 0" }}>{formatPrice(lineTotal)}</Text>
                  </Column>
                </Row>
              );
            })}

            <Row style={{ marginTop: 12 }}>
              <Column style={{ width: "70%" }}>
                <Text style={{ fontSize: 13, color: colors.textMuted, margin: "4px 0" }}>{t.subtotal}</Text>
              </Column>
              <Column style={{ width: "30%", textAlign: "right" }}>
                <Text style={{ fontSize: 13, margin: "4px 0" }}>{formatPrice(order.subtotal ?? 0)}</Text>
              </Column>
            </Row>
            {order.discount_amount > 0 && (
              <Row>
                <Column style={{ width: "70%" }}>
                  <Text style={{ fontSize: 13, color: "#16A34A", margin: "4px 0" }}>
                    {t.discount} {order.discount_code ? `(${order.discount_code})` : ""}
                  </Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text style={{ fontSize: 13, color: "#16A34A", margin: "4px 0" }}>
                    −{formatPrice(order.discount_amount)}
                  </Text>
                </Column>
              </Row>
            )}
            <Row>
              <Column style={{ width: "70%" }}>
                <Text style={{ fontSize: 13, color: colors.textMuted, margin: "4px 0" }}>{t.shipping}</Text>
              </Column>
              <Column style={{ width: "30%", textAlign: "right" }}>
                <Text style={{ fontSize: 13, margin: "4px 0" }}>
                  {(order.shipping_cost ?? 0) === 0 ? t.free : formatPrice(order.shipping_cost ?? 0)}
                </Text>
              </Column>
            </Row>
            {order.cod_surcharge > 0 && (
              <Row>
                <Column style={{ width: "70%" }}>
                  <Text style={{ fontSize: 13, color: colors.textMuted, margin: "4px 0" }}>{t.codSurcharge}</Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text style={{ fontSize: 13, margin: "4px 0" }}>{formatPrice(order.cod_surcharge)}</Text>
                </Column>
              </Row>
            )}
            <Row style={{ borderTop: `1px solid ${colors.dark}`, marginTop: 6 }}>
              <Column style={{ width: "70%" }}>
                <Text style={{ fontSize: 15, fontWeight: 700, margin: "8px 0" }}>{t.total}</Text>
              </Column>
              <Column style={{ width: "30%", textAlign: "right" }}>
                <Text style={{ fontSize: 15, fontWeight: 700, color: colors.accent, margin: "8px 0" }}>
                  {formatPrice(order.total)}
                </Text>
              </Column>
            </Row>
          </Section>

          {order.payment_method === "bank_transfer" && (
            <Section style={{ padding: "0 32px", margin: "20px 0" }}>
              <Section
                style={{
                  padding: "16px 18px",
                  backgroundColor: colors.accentTint,
                  border: `1px solid ${colors.accent}`,
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: colors.dark }}>
                  {t.bankTransferTitle}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted, margin: "0 0 10px" }}>
                  {t.bankTransferBody(dueDate.toLocaleDateString(locale))}
                </Text>
                <Text style={{ fontSize: 12, margin: "2px 0" }}>
                  {t.recipient}: {COMPANY.tradingName}
                </Text>
                <Text style={{ fontSize: 12, margin: "2px 0" }}>
                  {t.iban}: {COMPANY.iban}
                </Text>
                <Text style={{ fontSize: 12, margin: "2px 0" }}>
                  {t.bic}: {COMPANY.bic}
                </Text>
              </Section>
            </Section>
          )}

          {order.payment_method === "cod" && (
            <Section style={{ padding: "0 32px", margin: "20px 0" }}>
              <Section
                style={{
                  padding: "16px 18px",
                  backgroundColor: "#f0f4f0",
                  border: "1px solid #16A34A",
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: colors.dark }}>
                  {t.codTitle}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted, margin: 0 }}>
                  {t.codBody(formatPrice(order.total))}
                </Text>
              </Section>
            </Section>
          )}

          <Section style={{ padding: "0 32px 8px" }}>
            <Text style={{ fontSize: 11, textTransform: "uppercase", color: colors.textMuted, margin: "0 0 4px" }}>
              {t.deliveryAddress}
            </Text>
            <Text style={{ fontSize: 13, margin: 0, whiteSpace: "pre-line" }}>{order.customer_address}</Text>
          </Section>

          {order.payment_method !== "whatsapp" && (
            <Section style={{ padding: "12px 32px 0" }}>
              <Text style={{ fontSize: 12, color: colors.textMuted, fontStyle: "italic", margin: 0 }}>
                {t.declarationNotice}
              </Text>
            </Section>
          )}

          <Hr style={{ borderColor: colors.border, margin: "24px 0 0" }} />

          <Section style={{ backgroundColor: colors.footerBg, padding: "18px 32px" }}>
            <Text style={{ fontSize: 10, color: "#bbb", margin: "0 0 6px" }}>{t.footerLegal}</Text>
            <Text style={{ fontSize: 10, color: "#bbb", margin: "0 0 6px" }}>{t.ruo}</Text>
            <Text style={{ fontSize: 10, color: colors.accentOnDark, margin: 0 }}>{t.contact}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmationEmail;
