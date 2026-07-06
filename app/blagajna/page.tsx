"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Banknote, CreditCard, MessageCircle } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import { SHIPPING, calculateShipping } from "@/lib/config/shipping";
import { PAYMENT_METHODS, PaymentMethodId, getSurcharge } from "@/lib/config/payment";
import { calculateCartSubtotal, computeDiscountAmount } from "@/lib/pricing";
import { usePromoStore } from "@/lib/promo-store";
import { StepIndicator } from "@/components/cart/StepIndicator";
import { CheckoutOrderSummary } from "@/components/cart/CheckoutOrderSummary";

interface FormState {
  email: string;
  phone: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  wantInvoice: boolean;
  companyName: string;
  vatId: string;
  paymentMethod: PaymentMethodId;
  consentTerms: boolean;
  consentRuo: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const router = useRouter();
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const t = mounted ? translations[lang] : translations.sl;
  const tc = t.checkout;

  const { promo, clearPromo } = usePromoStore();

  const [form, setForm] = useState<FormState>({
    email: "",
    phone: "",
    name: "",
    street: "",
    postalCode: "",
    city: "",
    country: mounted && lang === "en" ? "Slovenia" : "Slovenija",
    wantInvoice: false,
    companyName: "",
    vatId: "",
    paymentMethod: PAYMENT_METHODS.bankTransfer.id,
    consentTerms: false,
    consentRuo: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // Redirect back to cart if it's empty (e.g. direct link, page refresh
  // after an order was already placed and the cart cleared).
  useEffect(() => {
    if (mounted && items.length === 0) router.replace("/kosarica");
  }, [mounted, items.length, router]);

  const subtotal = calculateCartSubtotal(items);
  const discountAmount = promo ? computeDiscountAmount(promo.type, promo.value, subtotal) : 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingCost = calculateShipping(subtotalAfterDiscount);
  const codSurcharge = getSurcharge(form.paymentMethod);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.email.trim()) next.email = tc.errRequired;
    else if (!EMAIL_RE.test(form.email.trim())) next.email = tc.errEmailInvalid;
    if (!form.phone.trim()) next.phone = tc.errRequired;
    if (!form.name.trim()) next.name = tc.errRequired;
    if (!form.street.trim()) next.street = tc.errRequired;
    if (!form.postalCode.trim()) next.postalCode = tc.errRequired;
    if (!form.city.trim()) next.city = tc.errRequired;
    if (!form.country.trim()) next.country = tc.errRequired;
    if (form.wantInvoice) {
      if (!form.companyName.trim()) next.companyName = tc.errRequired;
      if (!form.vatId.trim()) next.vatId = tc.errRequired;
    }
    if (!form.consentTerms) next.consentTerms = tc.consentRequired;
    if (!form.consentRuo) next.consentRuo = tc.consentRequired;

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const address = `${form.street}\n${form.postalCode} ${form.city}\n${form.country}`;
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: address,
          company_name: form.wantInvoice ? form.companyName : null,
          vat_id: form.wantInvoice ? form.vatId : null,
          payment_method: form.paymentMethod,
          discount_code: promo?.code ?? null,
          consent_terms: form.consentTerms,
          consent_ruo: form.consentRuo,
          language: lang,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? tc.orderError);
        return;
      }

      clearCart();
      clearPromo();
      router.push(`/potrditev/${data.order_ref}`);
    } catch {
      setSubmitError(tc.connectionError);
    } finally {
      setSubmitting(false);
    }
  }

  const fieldWrapStyle: React.CSSProperties = { marginBottom: "14px" };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-opensans)",
    fontSize: "12px",
    color: "rgba(255,255,255,0.55)",
    display: "block",
    marginBottom: "6px",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "#1e1e1e",
    borderRadius: "2px",
    color: "#fff",
    fontFamily: "var(--font-opensans)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };
  const errorTextStyle: React.CSSProperties = {
    fontFamily: "var(--font-opensans)",
    fontSize: "12px",
    color: "#f87171",
    margin: "6px 0 0 0",
  };
  const sectionStyle: React.CSSProperties = {
    backgroundColor: "#161616",
    border: "1px solid rgba(201,168,76,0.15)",
    borderRadius: "6px",
    padding: "24px",
    marginBottom: "20px",
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: "var(--font-montserrat)",
    fontSize: "14px", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.08em",
    color: "#fff", margin: "0 0 18px 0",
    display: "flex", alignItems: "center", gap: "8px",
  };

  function borderFor(field: keyof FormState): string {
    return errors[field] ? "1px solid #f87171" : "1px solid rgba(255,255,255,0.15)";
  }

  if (!mounted || items.length === 0) return null;

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "60vh" }}>
      <StepIndicator current={2} />

      <div className="mx-auto px-4 md:px-6 pb-16" style={{ maxWidth: "1100px" }}>
        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "28px", fontWeight: 900,
          textTransform: "uppercase", letterSpacing: "0.06em",
          color: "#c9a84c", marginBottom: "32px",
        }}>
          {tc.checkoutTitle}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 md:gap-12 items-start">
          {/* LEFT: form */}
          <div>
            {/* Contact */}
            <div style={sectionStyle}>
              <p style={sectionTitleStyle}>{tc.contactSectionTitle}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div style={fieldWrapStyle}>
                  <label style={labelStyle}>{tc.email}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder={tc.emailPlaceholder}
                    style={{ ...inputStyle, border: borderFor("email") }}
                  />
                  {errors.email && <p style={errorTextStyle}>{errors.email}</p>}
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle}>{tc.phoneLabel}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder={tc.phonePlaceholder}
                    style={{ ...inputStyle, border: borderFor("phone") }}
                  />
                  {errors.phone && <p style={errorTextStyle}>{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Address */}
            <div style={sectionStyle}>
              <p style={sectionTitleStyle}>{tc.addressSectionTitle}</p>
              <div style={fieldWrapStyle}>
                <label style={labelStyle}>{tc.fullName}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={tc.namePlaceholder}
                  style={{ ...inputStyle, border: borderFor("name") }}
                />
                {errors.name && <p style={errorTextStyle}>{errors.name}</p>}
              </div>
              <div style={fieldWrapStyle}>
                <label style={labelStyle}>{tc.streetLabel}</label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => set("street", e.target.value)}
                  placeholder={tc.streetPlaceholder}
                  style={{ ...inputStyle, border: borderFor("street") }}
                />
                {errors.street && <p style={errorTextStyle}>{errors.street}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div style={fieldWrapStyle}>
                  <label style={labelStyle}>{tc.postalCodeLabel}</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                    placeholder={tc.postalCodePlaceholder}
                    style={{ ...inputStyle, border: borderFor("postalCode") }}
                  />
                  {errors.postalCode && <p style={errorTextStyle}>{errors.postalCode}</p>}
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle}>{tc.cityLabel}</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder={tc.cityPlaceholder}
                    style={{ ...inputStyle, border: borderFor("city") }}
                  />
                  {errors.city && <p style={errorTextStyle}>{errors.city}</p>}
                </div>
                <div style={fieldWrapStyle}>
                  <label style={labelStyle}>{tc.countryLabel}</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    style={{ ...inputStyle, border: borderFor("country") }}
                  />
                  {errors.country && <p style={errorTextStyle}>{errors.country}</p>}
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.wantInvoice}
                  onChange={(e) => set("wantInvoice", e.target.checked)}
                  style={{ accentColor: "#c9a84c", width: "16px", height: "16px" }}
                />
                <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.75)" }}>
                  {tc.wantCompanyInvoice}
                </span>
              </label>

              {form.wantInvoice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: "14px" }}>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle}>{tc.companyNameLabel}</label>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => set("companyName", e.target.value)}
                      placeholder={tc.companyNamePlaceholder}
                      style={{ ...inputStyle, border: borderFor("companyName") }}
                    />
                    {errors.companyName && <p style={errorTextStyle}>{errors.companyName}</p>}
                  </div>
                  <div style={fieldWrapStyle}>
                    <label style={labelStyle}>{tc.vatIdLabel}</label>
                    <input
                      type="text"
                      value={form.vatId}
                      onChange={(e) => set("vatId", e.target.value)}
                      placeholder={tc.vatIdPlaceholder}
                      style={{ ...inputStyle, border: borderFor("vatId") }}
                    />
                    {errors.vatId && <p style={errorTextStyle}>{errors.vatId}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping method */}
            <div style={sectionStyle}>
              <p style={sectionTitleStyle}><Truck size={16} color="#c9a84c" /> {tc.shippingMethodTitle}</p>
              <label style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "12px", padding: "14px", borderRadius: "4px",
                border: "1px solid #c9a84c", backgroundColor: "rgba(201,168,76,0.08)",
                cursor: "default",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input type="radio" checked readOnly style={{ accentColor: "#c9a84c", width: "16px", height: "16px" }} />
                  <span>
                    <span style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                      {tc.shippingCarrier}
                    </span>
                    <span style={{ display: "block", fontFamily: "var(--font-opensans)", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                      {SHIPPING.deliveryTime[lang]} · {SHIPPING.region[lang]}
                    </span>
                  </span>
                </span>
                <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700, color: shippingCost === 0 ? "#4ade80" : "#fff" }}>
                  {shippingCost === 0 ? t.cart.freeShipping : formatPrice(SHIPPING.price)}
                </span>
              </label>
            </div>

            {/* Payment method */}
            <div style={sectionStyle}>
              <p style={sectionTitleStyle}><CreditCard size={16} color="#c9a84c" /> {tc.paymentMethodTitle}</p>
              {[
                { id: PAYMENT_METHODS.bankTransfer.id, icon: Banknote, title: tc.paymentBank, sub: tc.paymentBankSub, surcharge: 0 },
                { id: PAYMENT_METHODS.cod.id, icon: Truck, title: tc.paymentCod, sub: tc.paymentCodSub, surcharge: PAYMENT_METHODS.cod.surcharge },
                { id: PAYMENT_METHODS.whatsapp.id, icon: MessageCircle, title: tc.paymentWhatsapp, sub: tc.paymentWhatsappSub, surcharge: 0 },
              ].map((method) => {
                const active = form.paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: "12px", padding: "14px", borderRadius: "4px",
                      border: active ? "1px solid #c9a84c" : "1px solid rgba(255,255,255,0.12)",
                      backgroundColor: active ? "rgba(201,168,76,0.08)" : "transparent",
                      cursor: "pointer", marginBottom: "10px",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={active}
                        onChange={() => set("paymentMethod", method.id)}
                        style={{ accentColor: "#c9a84c", width: "16px", height: "16px" }}
                      />
                      <method.icon size={18} color={active ? "#c9a84c" : "rgba(255,255,255,0.5)"} />
                      <span>
                        <span style={{ display: "block", fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                          {method.title}
                        </span>
                        <span style={{ display: "block", fontFamily: "var(--font-opensans)", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                          {method.sub}
                        </span>
                      </span>
                    </span>
                    {method.surcharge > 0 && (
                      <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700, color: "#c9a84c", whiteSpace: "nowrap" }}>
                        + {formatPrice(method.surcharge)}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            {/* Consent */}
            <div style={sectionStyle}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "14px" }}>
                <input
                  type="checkbox"
                  checked={form.consentTerms}
                  onChange={(e) => set("consentTerms", e.target.checked)}
                  style={{ accentColor: "#c9a84c", width: "16px", height: "16px", marginTop: "2px", flexShrink: 0 }}
                />
                <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                  {tc.consentTermsPre}{" "}
                  <Link href="/pogoji" target="_blank" style={{ color: "#c9a84c" }}>{tc.consentTermsLink1}</Link>{" "}
                  {tc.consentTermsMid}{" "}
                  <Link href="/zasebnost" target="_blank" style={{ color: "#c9a84c" }}>{tc.consentTermsLink2}</Link>
                  {tc.consentTermsPost}
                </span>
              </label>
              {errors.consentTerms && <p style={{ ...errorTextStyle, marginBottom: "14px" }}>{errors.consentTerms}</p>}

              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.consentRuo}
                  onChange={(e) => set("consentRuo", e.target.checked)}
                  style={{ accentColor: "#c9a84c", width: "16px", height: "16px", marginTop: "2px", flexShrink: 0 }}
                />
                <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                  {tc.consentRuo}
                </span>
              </label>
              {errors.consentRuo && <p style={errorTextStyle}>{errors.consentRuo}</p>}
            </div>
          </div>

          {/* RIGHT: summary */}
          <CheckoutOrderSummary
            subtotal={subtotal}
            discountAmount={discountAmount}
            discountCode={promo?.code ?? null}
            shippingCost={shippingCost}
            codSurcharge={codSurcharge}
            paymentMethod={form.paymentMethod}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitError={submitError}
          />
        </div>
      </div>
    </div>
  );
}
