"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

const VALUES = [
  { icon: "ri-test-tube-line",      tkTitle: "v1Title", tkDesc: "v1Desc" },
  { icon: "ri-shield-check-line",   tkTitle: "v2Title", tkDesc: "v2Desc" },
  { icon: "ri-customer-service-line", tkTitle: "v3Title", tkDesc: "v3Desc" },
] as const;

const STEPS = [
  { icon: "ri-flask-line",       tkTitle: "step1Title", tkDesc: "step1Desc" },
  { icon: "ri-microscope-line",  tkTitle: "step2Title", tkDesc: "step2Desc" },
  { icon: "ri-file-check-line",  tkTitle: "step3Title", tkDesc: "step3Desc" },
  { icon: "ri-truck-line",       tkTitle: "step4Title", tkDesc: "step4Desc" },
] as const;

const CERTS = [
  { icon: "ri-test-tube-line", h4: "HPLC Tested",    tkP: "cert1" },
  { icon: "ri-flask-line",     h4: "MS Verified",     tkP: "cert2" },
  { icon: "ri-shield-line",    h4: "Endotoxin Free",  tkP: "cert3" },
  { icon: "ri-truck-line",     h4: "EU Compliant",    tkP: "cert4" },
] as const;

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const lang = useLanguageStore((s) => s.lang);
  useEffect(() => setMounted(true), []);

  const tl = mounted ? translations[lang] : translations.sl;
  const isEn = mounted && lang === "en";

  const heroTitle = isEn
    ? "Trust is built on<br><em>transparency</em>"
    : "Zaupanje temelji na<br><em>transparentnosti</em>";

  type TlKey = keyof typeof translations.sl;

  return (
    <>
      {/* ── 1. HERO ────────────────────────────────────────────────────── */}
      <PageHero
        breadcrumbItems={[
          { label: tl.nav.home, href: "/" },
          { label: tl.nav.about },
        ]}
        title={heroTitle}
        subtitle={tl.storyHeroSub}
      />

      {/* ── 2. STATS BAR ───────────────────────────────────────────────── */}
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--gray-100)", padding: 0 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="about-stats-grid">
            {(
              [
                { num: "100<em>%</em>",   label: tl.statYears },
                { num: "500<em>+</em>",   label: tl.statCustomers },
                { num: "99<em>.9%</em>",  label: tl.statPurity },
                { num: "30<em>+</em>",    label: tl.statProducts },
              ] as const
            ).map(({ num, label }, i) => (
              <div
                key={i}
                className="about-stat"
                style={{ padding: "28px 24px", textAlign: "center" }}
              >
                <div
                  className="about-stat-num"
                  dangerouslySetInnerHTML={{ __html: num }}
                  style={{
                    fontSize: "36px", fontWeight: 800,
                    color: "#ffffff", letterSpacing: "-1px", lineHeight: 1,
                  }}
                />
                <p style={{ fontSize: "13px", color: "var(--gray-500)", marginTop: "4px", fontWeight: 500, margin: "4px 0 0 0" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. STORY SECTION ───────────────────────────────────────────── */}
      <section style={{ padding: "72px 0", background: "var(--gray-50)" }}>
        <div className="container">
          <div className="about-story-grid">
            {/* Left: text */}
            <div>
              <div className="about-label" style={{ marginBottom: "12px" }}>
                <i className="ri-history-line" />
                {tl.storyLabel}
              </div>
              <h2 style={{
                fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 800,
                color: "#ffffff", letterSpacing: "-0.5px",
                lineHeight: 1.25, marginBottom: "20px",
              }}>
                {tl.storyTitle}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {([tl.storyP1, tl.storyP2, tl.storyP3] as string[]).map((p, i) => (
                  <p key={i} style={{ fontSize: "15px", color: "var(--gray-600)", lineHeight: 1.75, margin: 0 }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: image card + floating badge */}
            <div style={{ position: "relative" }}>
              <div style={{
                background: "linear-gradient(135deg, var(--gray-900), #1a2640)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                aspectRatio: "4/3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about/lab.jpg"
                  alt=""
                  onError={(e) => { e.currentTarget.style.opacity = "0.1"; }}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", opacity: 0.7,
                    mixBlendMode: "luminosity",
                  }}
                />
              </div>
              {/* Floating badge */}
              <div style={{
                position: "absolute", bottom: "-16px", right: "-16px",
                background: "var(--white)",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "18px 22px",
                boxShadow: "var(--shadow-xl)",
                textAlign: "center",
              }}>
                <strong style={{
                  display: "block",
                  fontSize: "28px", fontWeight: 800,
                  color: "var(--primary)", lineHeight: 1,
                }}>
                  2026
                </strong>
                <span style={{ fontSize: "12px", color: "var(--gray-500)", fontWeight: 500 }}>
                  {tl.badgeFounded}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. VALUES SECTION ──────────────────────────────────────────── */}
      <section style={{ padding: "72px 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="about-label" style={{ marginBottom: "10px" }}>
              <i className="ri-star-line" />
              {tl.valuesLabel}
            </div>
            <h2 style={{
              fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800,
              color: "#ffffff", letterSpacing: "-0.5px", margin: 0,
            }}>
              {tl.valuesTitle}
            </h2>
            <p style={{
              fontSize: "15px", color: "var(--gray-400)",
              marginTop: "8px", maxWidth: "500px",
              marginLeft: "auto", marginRight: "auto",
            }}>
              {tl.valuesSub}
            </p>
          </div>

          <div className="about-values-grid">
            {VALUES.map(({ icon, tkTitle, tkDesc }) => (
              <div key={tkTitle} className="about-value-card">
                <div style={{
                  width: "56px", height: "56px",
                  background: "rgba(201,168,76,.1)",
                  borderRadius: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "20px",
                }}>
                  <i className={icon} style={{ fontSize: "26px", color: "var(--primary)" }} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}>
                  {tl[tkTitle as TlKey] as string}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--gray-500)", lineHeight: 1.7, margin: 0 }}>
                  {tl[tkDesc as TlKey] as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. PROCESS SECTION ─────────────────────────────────────────── */}
      <section style={{ padding: "72px 0", background: "var(--gray-50)" }}>
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <div className="about-label" style={{ marginBottom: "10px" }}>
              <i className="ri-route-line" />
              {tl.processLabel}
            </div>
            <h2 style={{
              fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800,
              color: "#ffffff", letterSpacing: "-0.5px", margin: 0,
            }}>
              {tl.processTitle}
            </h2>
          </div>

          <div className="about-process-grid" style={{ marginTop: "48px" }}>
            {STEPS.map(({ icon, tkTitle, tkDesc }) => (
              <div key={tkTitle} className="about-step" style={{ textAlign: "center", padding: "0 16px", position: "relative", zIndex: 1 }}>
                <div className="about-step-circle">
                  <i className={icon} />
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--gray-800)", marginBottom: "8px" }}>
                  {tl[tkTitle as TlKey] as string}
                </h4>
                <p style={{ fontSize: "13px", color: "var(--gray-500)", lineHeight: 1.6, margin: 0 }}>
                  {tl[tkDesc as TlKey] as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CERTIFICATIONS STRIP ────────────────────────────────────── */}
      <section style={{ padding: "56px 0", background: "var(--white)" }}>
        <div className="container">
          <div style={{ textAlign: "center" }}>
            <div className="about-label" style={{ marginBottom: "10px" }}>
              <i className="ri-award-line" />
              {tl.certsLabel}
            </div>
            <h2 style={{
              fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 800,
              color: "#ffffff", letterSpacing: "-0.5px", margin: 0,
            }}>
              {tl.certsTitle}
            </h2>
          </div>

          <div className="about-certs-grid" style={{ marginTop: "40px" }}>
            {CERTS.map(({ icon, h4, tkP }) => (
              <div key={h4} className="about-cert-card">
                <i className={icon} style={{ fontSize: "32px", color: "var(--primary)", display: "block", marginBottom: "12px" }} />
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--gray-800)", marginBottom: "4px" }}>
                  {h4}
                </h4>
                <p style={{ fontSize: "12px", color: "var(--gray-500)", margin: 0 }}>
                  {tl[tkP as TlKey] as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA STRIP ───────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, var(--gray-900), #1a2640)",
        padding: "56px 0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,168,76,.15), transparent)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="about-cta-inner">
            <div>
              <h2 style={{
                fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800,
                color: "white", letterSpacing: "-0.4px", margin: 0,
              }}>
                {tl.aboutCtaTitle}
              </h2>
              <p style={{ fontSize: "15px", color: "var(--gray-400)", margin: "6px 0 0 0" }}>
                {tl.aboutCtaSub}
              </p>
            </div>
            <Link href="/shop" className="about-cta-btn">
              <i className="ri-store-2-line" />
              {tl.aboutCtaBtn}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
