"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(201%2C168%2C76%2C0.06)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(201%2C168%2C76%2C0.06)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(201%2C168%2C76%2C0.06)' stroke-width='1'/%3E%3C/svg%3E")`;

export function HeroCarousel() {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => setMounted(true), []);

  const slides = translations[lang].home.heroSlides;

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, paused]);

  // Use SL slides for SSR to avoid hydration mismatch
  const displaySlides = mounted ? slides : translations.sl.home.heroSlides;

  return (
    <section
      style={{ position: "relative", height: "clamp(380px, 55vw, 600px)", overflow: "hidden", backgroundColor: "#0a0a0a" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Hex texture */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        backgroundImage: HEX_PATTERN,
        backgroundSize: "60px 104px",
        pointerEvents: "none",
      }} />

      {/* Slides */}
      {displaySlides.map((slide, i) => (
        <div
          key={i}
          style={{
            position: "absolute", inset: 0, zIndex: 2,
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.75s ease",
            pointerEvents: i === current ? "auto" : "none",
          }}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt=""
            aria-hidden="true"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
            }}
          />

          {/* Dark gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(120deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 65%, transparent 100%)",
          }} />

          {/* Content */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 3,
            display: "flex", alignItems: "center",
            maxWidth: "1200px", margin: "0 auto", padding: "0 32px",
            width: "100%", left: "50%", transform: "translateX(-50%)",
          }}>
            <div style={{ maxWidth: "560px" }}>
              <p style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "11px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.25em",
                color: "#c9a84c", marginBottom: "16px",
                opacity: i === current ? 1 : 0,
                transform: i === current ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.6s 0.2s ease, transform 0.6s 0.2s ease",
              }}>
                {slide.eyebrow}
              </p>

              <h1 style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 900, lineHeight: 1.1,
                color: "#fff",
                margin: "0 0 20px 0",
                whiteSpace: "pre-line",
                opacity: i === current ? 1 : 0,
                transform: i === current ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s 0.3s ease, transform 0.6s 0.3s ease",
              }}>
                {slide.headline}
              </h1>

              <p style={{
                fontFamily: "var(--font-opensans)",
                fontSize: "15px", lineHeight: 1.7,
                color: "rgba(255,255,255,0.75)",
                margin: "0 0 36px 0",
                opacity: i === current ? 1 : 0,
                transform: i === current ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.6s 0.4s ease, transform 0.6s 0.4s ease",
              }}>
                {slide.sub}
              </p>

              <Link
                href={slide.href}
                style={{
                  display: "inline-block",
                  padding: "14px 36px",
                  backgroundColor: "#c9a84c",
                  color: "#000",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 800, fontSize: "13px",
                  textTransform: "uppercase", letterSpacing: "0.12em",
                  textDecoration: "none",
                  borderRadius: "2px",
                  opacity: i === current ? 1 : 0,
                  transform: i === current ? "translateY(0)" : "translateY(12px)",
                  transition: "opacity 0.6s 0.5s ease, transform 0.6s 0.5s ease, background 0.2s ease",
                }}
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Arrow buttons */}
      <button
        onClick={prev}
        aria-label="Prejšnji"
        style={{
          position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
          zIndex: 10, width: "44px", height: "44px",
          backgroundColor: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "50%", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(201,168,76,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.45)")}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        aria-label="Naslednji"
        style={{
          position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
          zIndex: 10, width: "44px", height: "44px",
          backgroundColor: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "50%", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(201,168,76,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.45)")}
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div style={{
        position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)",
        zIndex: 10, display: "flex", gap: "8px",
      }}>
        {displaySlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Diapozitiv ${i + 1}`}
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: i === current ? "#c9a84c" : "rgba(255,255,255,0.4)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Bottom diagonal cut */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "60px", zIndex: 5,
        backgroundColor: "#fff",
        clipPath: "polygon(0 100%, 100% 20%, 100% 100%)",
      }} />
    </section>
  );
}
