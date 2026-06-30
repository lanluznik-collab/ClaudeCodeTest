"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Grid3X3, List, Eye } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import { useUiStore } from "@/lib/ui-store";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";


interface Props {
  products: Product[];
  categories: string[];
}

interface CartT {
  addToCart: string;
  outOfStock: string;
  added: string;
  [key: string]: string;
}

interface QvT {
  addToCart: string;
  viewFull: string;
  outOfStock: string;
  close: string;
  added: string;
  [key: string]: string;
}

// ─── Quick-view modal ─────────────────────────────────────────────────────────

function QuickViewModal({ product, onClose, tCart, tQv }: {
  product: Product;
  onClose: () => void;
  tCart: CartT;
  tQv: QvT;
}) {
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);

  // Escape key
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity: qty,
      slug: product.slug,
    });
    setJustAdded(true);
    setTimeout(() => { setJustAdded(false); onClose(); openCart(); }, 900);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.65)",
          zIndex: 300, backdropFilter: "blur(3px)",
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 301,
          width: "min(860px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 48px)",
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          overflow: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
        }}
        className="quick-view-modal"
      >
        {/* Image side */}
        <div style={{ backgroundColor: "#f5f5f5", position: "relative", minHeight: "360px" }}>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "#1a1a1a",
            }}>
              <span style={{
                fontFamily: "var(--font-montserrat)", fontSize: "13px",
                fontWeight: 800, letterSpacing: "0.12em", color: "#c9a84c",
              }}>SLOPEPS</span>
            </div>
          )}
        </div>

        {/* Info side */}
        <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "0", position: "relative" }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "none", border: "none", cursor: "pointer",
              color: "#aaa", display: "flex", padding: "4px",
            }}
          >
            <X size={20} />
          </button>

          {product.category && (
            <p style={{
              fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.18em",
              color: "#c9a84c", margin: "0 0 10px 0",
            }}>
              {product.category}
            </p>
          )}

          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.1rem, 2vw, 1.6rem)",
            fontWeight: 900, color: "#111",
            margin: "0 0 10px 0", lineHeight: 1.2,
          }}>
            {product.name}
          </h2>

          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "22px", fontWeight: 800,
            color: "#c9a84c", margin: "0 0 16px 0",
          }}>
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p style={{
              fontFamily: "var(--font-opensans)", fontSize: "13px",
              lineHeight: 1.7, color: "#555", margin: "0 0 20px 0",
            }}>
              {product.description.slice(0, 220)}
              {product.description.length > 220 ? "…" : ""}
            </p>
          )}

          <div style={{
            display: "flex", alignItems: "center",
            gap: "10px", marginBottom: "16px",
            padding: "14px 0",
            borderTop: "1px solid #f0f0f0",
            borderBottom: "1px solid #f0f0f0",
          }}>
            <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#555" }}>
              Qty:
            </span>
            <div style={{
              display: "inline-flex", alignItems: "center",
              border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden",
            }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{
                  width: "34px", height: "34px", background: "none",
                  border: "none", cursor: "pointer", fontSize: "16px", color: "#555",
                }}
              >−</button>
              <span style={{
                padding: "0 14px",
                fontFamily: "var(--font-montserrat)",
                fontSize: "14px", fontWeight: 700, color: "#111",
                minWidth: "32px", textAlign: "center",
              }}>{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                disabled={qty >= product.stock}
                style={{
                  width: "34px", height: "34px", background: "none",
                  border: "none", cursor: qty < product.stock ? "pointer" : "not-allowed",
                  fontSize: "16px", color: "#555",
                }}
              >+</button>
            </div>
            <span style={{
              fontFamily: "var(--font-opensans)", fontSize: "12px",
              color: product.stock > 0 ? "#4a7c59" : "#e53935",
            }}>
              {product.stock > 0 ? `${product.stock} na zalogi` : tQv.outOfStock}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{
              padding: "14px",
              backgroundColor: justAdded ? "#4ade80" : product.stock === 0 ? "#f0f0f0" : "#c9a84c",
              color: product.stock === 0 ? "#bbb" : "#000",
              border: "none",
              borderRadius: "3px",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800, fontSize: "13px",
              textTransform: "uppercase", letterSpacing: "0.1em",
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
              marginBottom: "10px",
              transition: "background 0.2s",
            }}
          >
            {justAdded ? tQv.added : product.stock === 0 ? tQv.outOfStock : tQv.addToCart}
          </button>

          <Link
            href={`/shop/${product.slug}`}
            onClick={onClose}
            style={{
              display: "block", textAlign: "center",
              padding: "12px",
              backgroundColor: "transparent",
              border: "1px solid #ddd",
              borderRadius: "3px",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700, fontSize: "12px",
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "#555", textDecoration: "none",
            }}
          >
            {tQv.viewFull}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .quick-view-modal { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

// ─── List row ─────────────────────────────────────────────────────────────────

function ProductListRow({ product, onQuickView, tCart }: {
  product: Product;
  onQuickView: (p: Product) => void;
  tCart: CartT;
}) {
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity: 1,
      slug: product.slug,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    openCart();
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "90px 1fr auto",
      gap: "20px",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #f0f0f0",
    }}>
      <Link href={`/shop/${product.slug}`} style={{ display: "block", flexShrink: 0 }}>
        <div style={{
          width: "90px", height: "90px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px", overflow: "hidden",
        }}>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={90} height={90}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              backgroundColor: "#1a1a1a",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "9px", color: "#c9a84c", fontFamily: "var(--font-montserrat)", fontWeight: 800 }}>SLP</span>
            </div>
          )}
        </div>
      </Link>

      <div>
        {product.category && (
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.12em",
            color: "#c9a84c", margin: "0 0 4px 0",
          }}>{product.category}</p>
        )}
        <Link href={`/shop/${product.slug}`} style={{ textDecoration: "none" }}>
          <h3 style={{
            fontFamily: "var(--font-montserrat)", fontSize: "15px", fontWeight: 700,
            color: "#111", margin: "0 0 6px 0",
            textTransform: "uppercase", letterSpacing: "0.04em",
          }}>{product.name}</h3>
        </Link>
        {product.description && (
          <p style={{
            fontFamily: "var(--font-opensans)", fontSize: "13px",
            color: "#777", margin: 0, lineHeight: 1.5,
          }}>
            {product.description.slice(0, 100)}{product.description.length > 100 ? "…" : ""}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px" }}>
        <span style={{
          fontFamily: "var(--font-montserrat)", fontSize: "18px", fontWeight: 800,
          color: "#c9a84c",
        }}>{formatPrice(product.price)}</span>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => onQuickView(product)}
            title="Hitri ogled"
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              backgroundColor: "#f5f5f5", border: "1px solid #eee",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Eye size={15} color="#555" />
          </button>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            style={{
              padding: "8px 16px",
              backgroundColor: justAdded ? "#4ade80" : product.stock === 0 ? "#f0f0f0" : "#c9a84c",
              color: product.stock === 0 ? "#bbb" : "#000",
              border: "none", borderRadius: "3px", cursor: product.stock === 0 ? "not-allowed" : "pointer",
              fontFamily: "var(--font-montserrat)", fontSize: "11px",
              fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
              whiteSpace: "nowrap",
            }}
          >
            {justAdded ? tCart.added : product.stock === 0 ? tCart.outOfStock : tCart.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ShopClient ──────────────────────────────────────────────────────────

export function ShopClient({ products, categories }: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const t = mounted ? translations[lang].shop : translations.sl.shop;
  const tCart = mounted ? translations[lang].cart : translations.sl.cart;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((p) => p.category === category);
    if (price === "under50")   result = result.filter((p) => p.price < 50);
    if (price === "50to100")   result = result.filter((p) => p.price >= 50 && p.price <= 100);
    if (price === "over100")   result = result.filter((p) => p.price > 100);
    if (inStock)               result = result.filter((p) => p.stock > 0);

    if (sort === "price_asc")  result.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name_asc")   result.sort((a, b) => a.name.localeCompare(b.name));
    else result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [products, search, category, price, inStock, sort]);

  const clearSearch = useCallback(() => setSearch(""), []);

  const inputBase: React.CSSProperties = {
    fontFamily: "var(--font-opensans)",
    fontSize: "13px",
    color: "#eeeeee",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "4px",
    padding: "8px 12px",
    cursor: "pointer",
    outline: "none",
  };

  return (
    <>
      {/* ─── Page hero ─── */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "260px",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(160deg, #0a1628 0%, #0f2744 55%, #1a3a6b 100%)",
      }}>
        {/* Radial corner glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 55% 90% at 95% 10%, rgba(56,189,248,0.13) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", margin: "0 auto",
          padding: "48px 24px 56px",
          width: "100%",
        }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "22px" }}>
            <Link href="/" style={{
              fontFamily: "var(--font-opensans)",
              fontSize: "13px",
              color: "rgba(148,163,184,0.75)",
              textDecoration: "none",
            }}>
              Domov
            </Link>
            <span style={{ color: "rgba(148,163,184,0.35)", fontSize: "15px" }}>›</span>
            <span style={{
              fontFamily: "var(--font-opensans)",
              fontSize: "13px", fontWeight: 600,
              color: "#fff",
            }}>
              Vsi raziskovalni peptidi
            </span>
          </nav>

          {/* Heading */}
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#fff",
            margin: "0 0 14px 0",
            lineHeight: 1.1,
          }}>
            Vsi raziskovalni peptidi
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "15px",
            color: "rgba(148,163,184,0.85)",
            lineHeight: 1.65,
            margin: "0 0 28px 0",
            maxWidth: "560px",
          }}>
            Raziskujte našo celotno ponudbo neodvisno testiranih raziskovalnih peptidov z dokazano čistostjo.
          </p>

          {/* Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              { icon: "🧪", text: `${products.length} peptidov` },
              { icon: "✓", text: "99.9% čistost" },
              { icon: "🚚", text: "EU dostava" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                padding: "7px 14px",
                backgroundColor: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "100px",
              }}>
                <span style={{ fontSize: "14px", lineHeight: 1 }}>{icon}</span>
                <span style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "12px", fontWeight: 700,
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "0.03em",
                }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Sticky toolbar ─── */}
      <div style={{
        position: "sticky",
        top: "64px",
        zIndex: 40,
        backgroundColor: "#111111",
        borderBottom: "1px solid #2a2a2a",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "12px 24px",
          display: "flex", alignItems: "center",
          flexWrap: "wrap", gap: "10px",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 180px", minWidth: "140px" }}>
            <Search size={14} style={{
              position: "absolute", left: "10px", top: "50%",
              transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none",
            }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              style={{
                ...inputBase,
                paddingLeft: "32px",
                paddingRight: search ? "32px" : "12px",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            {search && (
              <button
                onClick={clearSearch}
                style={{
                  position: "absolute", right: "8px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "#aaa", display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputBase, minWidth: "130px" }}
          >
            <option value="">{t.allCategories}</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Price */}
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ ...inputBase, minWidth: "120px" }}
          >
            {t.priceOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* In-stock */}
          <label style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#eeeeee",
            cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
          }}>
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              style={{ accentColor: "#c9a84c", width: "14px", height: "14px" }}
            />
            {t.inStock}
          </label>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
            <span style={{ fontFamily: "var(--font-opensans)", fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>
              {t.sort}:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ ...inputBase, minWidth: "160px" }}
            >
              {t.sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", border: "1px solid #2a2a2a", borderRadius: "4px", overflow: "hidden" }}>
            <button
              onClick={() => setView("grid")}
              title={t.grid}
              style={{
                width: "36px", height: "36px",
                backgroundColor: view === "grid" ? "#c9a84c" : "#1a1a1a",
                border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
            >
              <Grid3X3 size={15} color={view === "grid" ? "#0a0a0a" : "#888"} />
            </button>
            <button
              onClick={() => setView("list")}
              title={t.list}
              style={{
                width: "36px", height: "36px",
                backgroundColor: view === "list" ? "#c9a84c" : "#1a1a1a",
                border: "none", borderLeft: "1px solid #2a2a2a", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.15s",
              }}
            >
              <List size={15} color={view === "list" ? "#0a0a0a" : "#888"} />
            </button>
          </div>
        </div>

        {/* Results count bar */}
        <div style={{
          borderTop: "1px solid #2a2a2a",
          padding: "6px 24px",
          maxWidth: "1200px", margin: "0 auto",
        }}>
          <p style={{
            fontFamily: "var(--font-opensans)", fontSize: "12px",
            color: "#999", margin: 0,
          }}>
            {filtered.length} {t.results}
            {(search || category || price || inStock) && (
              <button
                onClick={() => { setSearch(""); setCategory(""); setPrice(""); setInStock(false); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#c9a84c", fontSize: "12px",
                  fontFamily: "var(--font-montserrat)", fontWeight: 700,
                  marginLeft: "12px",
                }}
              >
                ✕ {mounted && lang === "en" ? "Clear filters" : "Počisti filtre"}
              </button>
            )}
          </p>
        </div>
      </div>

      {/* ─── Products ─── */}
      <section style={{ backgroundColor: "#0a0a0a", padding: "40px 0 96px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{
                fontFamily: "var(--font-opensans)", fontSize: "16px",
                color: "#aaa", margin: "0 0 20px 0",
              }}>
                {t.noResults}
              </p>
              {(search || category || price || inStock) && (
                <button
                  onClick={() => { setSearch(""); setCategory(""); setPrice(""); setInStock(false); }}
                  style={{
                    padding: "10px 24px",
                    backgroundColor: "#c9a84c",
                    color: "#000",
                    border: "none", borderRadius: "3px", cursor: "pointer",
                    fontFamily: "var(--font-montserrat)", fontSize: "12px",
                    fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                  }}
                >
                  {mounted && lang === "en" ? "Clear filters" : "Počisti filtre"}
                </button>
              )}
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          ) : (
            <div>
              {filtered.map((product) => (
                <ProductListRow
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  tCart={tCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Quick-view modal ─── */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          tCart={tCart}
          tQv={t.quickView}
        />
      )}
    </>
  );
}
