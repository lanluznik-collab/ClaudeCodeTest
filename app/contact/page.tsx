"use client";

import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export default function ContactPage() {
  const lang = useLanguageStore((s) => s.lang);
  const tl = translations[lang];

  const [hovered, setHovered] = useState<number | null>(null);

  const cardBase: React.CSSProperties = {
    background: "var(--white)",
    border: "1px solid var(--gray-200)",
    borderRadius: "var(--radius-lg)",
    padding: "22px",
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    transition: "var(--transition)",
  };

  const iconWrap: React.CSSProperties = {
    flexShrink: 0,
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(14,165,233,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    color: "var(--primary)",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    color: "var(--gray-400)",
    marginBottom: "4px",
    margin: 0,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--gray-800)",
    margin: 0,
  };

  const subStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "var(--gray-400)",
    marginTop: "2px",
    margin: 0,
  };

  const faqItems = [
    { q: tl.contactFaq1q, a: tl.contactFaq1a },
    { q: tl.contactFaq2q, a: tl.contactFaq2a },
    { q: tl.contactFaq3q, a: tl.contactFaq3a },
  ];

  return (
    <>
      <PageHero
        breadcrumbItems={[
          { label: tl.nav.home, href: "/" },
          { label: tl.nav.contact },
        ]}
        title={tl.contactHero}
        subtitle={tl.contactHeroSub}
        compact={true}
      />

      <section style={{ padding: "56px 0 80px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>
          <div className="contact-grid">

            {/* Card 1 — Address */}
            <div
              style={{
                ...cardBase,
                ...(hovered === 0 ? { boxShadow: "var(--shadow-md)", borderColor: "var(--gray-300)" } : {}),
              }}
              onMouseEnter={() => setHovered(0)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={iconWrap}>
                <i className="ri-map-pin-line" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <p style={labelStyle}>{tl.contactAddrLbl}</p>
                <p style={valueStyle}>SloPeps</p>
                <p style={subStyle}>Slovenija</p>
              </div>
            </div>

            {/* Card 2 — Email */}
            <div
              style={{
                ...cardBase,
                ...(hovered === 1 ? { boxShadow: "var(--shadow-md)", borderColor: "var(--gray-300)" } : {}),
              }}
              onMouseEnter={() => setHovered(1)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={iconWrap}>
                <i className="ri-mail-line" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <p style={labelStyle}>{tl.contactEmailLbl}</p>
                <a
                  href="mailto:info@slopeps.com"
                  style={{ ...valueStyle, color: "var(--primary)", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-dark)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--primary)")}
                >
                  info@slopeps.com
                </a>
                <p style={subStyle}>{tl.contactEmailSub}</p>
              </div>
            </div>

            {/* FAQ mini card — spans both columns */}
            <div
              style={{
                gridColumn: "1 / -1",
                background: "var(--white)",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "22px",
                marginTop: "4px",
              }}
            >
              <h4
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  color: "var(--gray-500)",
                  marginBottom: "14px",
                  margin: "0 0 14px",
                }}
              >
                {tl.contactFaqTitle}
              </h4>

              {faqItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: i === faqItems.length - 1 ? "10px 0 0" : "10px 0",
                    borderBottom: i === faqItems.length - 1 ? "none" : "1px solid var(--gray-100)",
                  }}
                >
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--gray-800)", margin: "0 0 4px" }}>
                    {item.q}
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--gray-500)", lineHeight: 1.55, margin: 0 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
