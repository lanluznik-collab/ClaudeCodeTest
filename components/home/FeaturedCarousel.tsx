"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export function FeaturedCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [mounted, setMounted] = useState(false);
  const lang = useLanguageStore((s) => s.lang);

  useEffect(() => setMounted(true), []);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  function scroll(dir: -1 | 1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  const t = mounted ? translations[lang].home.featured : translations.sl.home.featured;

  return (
    <section style={{ backgroundColor: "#fff", padding: "64px 0 80px", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header row */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", marginBottom: "40px",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "11px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.25em",
              color: "#c9a84c", marginBottom: "8px",
            }}>
              {t.eyebrow}
            </p>
            <h2 style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
              fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.04em", color: "#111", margin: 0,
            }}>
              {t.title}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Arrow buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => scroll(-1)}
                disabled={!canScrollLeft}
                style={{
                  width: "38px", height: "38px",
                  borderRadius: "50%",
                  backgroundColor: canScrollLeft ? "#111" : "#f0f0f0",
                  border: "none", cursor: canScrollLeft ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}
              >
                <ChevronLeft size={18} color={canScrollLeft ? "#fff" : "#ccc"} />
              </button>
              <button
                onClick={() => scroll(1)}
                disabled={!canScrollRight}
                style={{
                  width: "38px", height: "38px",
                  borderRadius: "50%",
                  backgroundColor: canScrollRight ? "#111" : "#f0f0f0",
                  border: "none", cursor: canScrollRight ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                }}
              >
                <ChevronRight size={18} color={canScrollRight ? "#fff" : "#ccc"} />
              </button>
            </div>

            <Link href="/shop" style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "12px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: "#c9a84c", textDecoration: "none",
              borderBottom: "2px solid #c9a84c", paddingBottom: "2px",
            }}>
              {t.viewAll}
            </Link>
          </div>
        </div>

        {/* Carousel track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          style={{
            display: "flex",
            gap: "20px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: "4px",
          }}
          className="hide-scrollbar"
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                flexShrink: 0,
                scrollSnapAlign: "start",
                width: "clamp(200px, 22vw, 260px)",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
