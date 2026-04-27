"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/lib/stores/toast";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type TL = (typeof translations)["sl"] | (typeof translations)["en"];

interface WishlistItem {
  id: string;
  created_at: string;
  product_id: string;
  products: Product;
}

type SortKey = "newest" | "name" | "price-low" | "price-high";
type ViewMode = "grid" | "list";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOrCreateSessionId(): string {
  const key = "slopeps-session-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function getCountLabel(count: number, lang: string, tl: TL): string {
  if (lang === "en") {
    return `${count} ${count === 1 ? "saved item" : "saved items"}`;
  }
  let suffix: string;
  if (count === 1) suffix = tl.wishSuffix1;
  else if (count === 2) suffix = tl.wishSuffix2;
  else if (count === 3 || count === 4) suffix = tl.wishSuffix34;
  else suffix = tl.wishSuffix5;
  return `${count}${suffix}`;
}

function sortItems(items: WishlistItem[], sort: SortKey): WishlistItem[] {
  const arr = [...items];
  if (sort === "name") return arr.sort((a, b) => a.products.name.localeCompare(b.products.name));
  if (sort === "price-low") return arr.sort((a, b) => a.products.price - b.products.price);
  if (sort === "price-high") return arr.sort((a, b) => b.products.price - a.products.price);
  return arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ─── WishlistCard ─────────────────────────────────────────────────────────────

interface CardProps {
  item: WishlistItem;
  viewMode: ViewMode;
  tl: TL;
  onRemove: (id: string) => void;
}

function WishlistCard({ item, viewMode, tl, onRemove }: CardProps) {
  const [hovering, setHovering] = useState(false);
  const [heartHover, setHeartHover] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toast = useToast();
  const product = item.products;
  const image = product.images?.[0] ?? "";
  const isList = viewMode === "list";

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image,
      quantity: 1,
      slug: product.slug,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    toast.show(tl.toastAdded, "success");
  }

  return (
    <div
      className="wishlist-card"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        transform: hovering ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovering ? "var(--shadow-xl)" : "none",
        borderColor: hovering ? "transparent" : "var(--gray-100)",
      }}
    >
      {/* Heart remove button */}
      <div style={{
        position: "absolute",
        top: isList ? 12 : 16,
        right: isList ? 12 : 16,
        zIndex: 5,
        display: "flex",
        flexDirection: isList ? "row" : "column",
        gap: 6,
      }}>
        <button
          onClick={() => onRemove(item.id)}
          onMouseEnter={() => setHeartHover(true)}
          onMouseLeave={() => setHeartHover(false)}
          style={{
            width: 40, height: 40,
            borderRadius: 10,
            border: `1px solid ${heartHover ? "var(--heart)" : "#fecdd3"}`,
            background: heartHover ? "var(--heart)" : "var(--heart-light)",
            color: heartHover ? "white" : "var(--heart)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            transition: "all 0.18s ease",
            fontSize: 18,
          }}
        >
          <i className="ri-heart-3-fill" />
        </button>
      </div>

      {/* Image area */}
      <Link href={`/shop/${product.slug}`} className="wishlist-card-img">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            width={300}
            height={300}
            style={{
              width: "85%", height: "85%",
              objectFit: "contain",
              transition: "transform 0.5s cubic-bezier(.4,0,.2,1)",
              transform: hovering ? "scale(1.06)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            width: "85%", height: "85%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--gray-100)", borderRadius: "var(--radius-md)",
          }}>
            <i className="ri-image-line" style={{ fontSize: 32, color: "var(--gray-300)" }} />
          </div>
        )}
      </Link>

      {/* Info panel */}
      <div className="wishlist-card-info">
        <p style={{
          fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "1.2px",
          color: "var(--primary)", margin: "0 0 6px",
        }}>
          {tl.wishProdCat}
        </p>

        <Link
          href={`/shop/${product.slug}`}
          style={{
            fontSize: 18, fontWeight: 700,
            color: "var(--gray-800)", lineHeight: 1.3,
            margin: "0 0 6px", textDecoration: "none", display: "block",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gray-800)")}
        >
          {product.name}
        </Link>

        {product.description && (
          <p style={{
            fontSize: 13, color: "var(--gray-400)", lineHeight: 1.5,
            margin: "0 0 16px", flex: 1,
          }}>
            {product.description.length > 100
              ? product.description.slice(0, 100) + "…"
              : product.description}
          </p>
        )}

        {/* Stock + date */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--success)", flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success)" }}>
            {tl.shop.inStock}
          </span>
          <span style={{
            marginLeft: "auto", fontSize: 12, color: "var(--gray-400)",
            display: "flex", gap: 4, alignItems: "center",
          }}>
            <i className="ri-calendar-line" style={{ fontSize: 13 }} />
            {formatDate(item.created_at)}
          </span>
        </div>

        {/* Footer: price + add to cart */}
        <div style={{
          display: "flex", justifyContent: "space-between", gap: 12,
          alignItems: "center", paddingTop: 16,
          borderTop: "1px solid var(--gray-100)",
        }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: "var(--gray-900)" }}>
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "12px 22px", borderRadius: 12, border: "none",
              background: justAdded
                ? "linear-gradient(135deg, var(--success), #16a34a)"
                : "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "white", fontSize: 14, fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
              transform: hovering ? "translateY(-2px)" : "translateY(0)",
              boxShadow: hovering ? "0 8px 24px rgba(14,165,233,.35)" : "none",
            }}
          >
            <i className={justAdded ? "ri-check-line" : "ri-shopping-cart-line"} style={{ fontSize: 18 }} />
            {tl.wishAddCart}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const lang = useLanguageStore((s) => s.lang);
  const tl = translations[lang];
  const toast = useToast();
  const addItem = useCartStore((s) => s.addItem);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
    const saved = localStorage.getItem("slopeps-wishlist-view") as ViewMode | null;
    if (saved === "grid" || saved === "list") setView(saved);
  }, []);

  const fetchItems = useCallback(async (sid: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wishlist?session_id=${sid}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionId) fetchItems(sessionId);
  }, [sessionId, fetchItems]);

  function setViewMode(v: ViewMode) {
    setView(v);
    localStorage.setItem("slopeps-wishlist-view", v);
  }

  async function handleRemove(wishlistItemId: string) {
    if (!sessionId) return;
    await fetch(`/api/wishlist/${wishlistItemId}?session_id=${sessionId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== wishlistItemId));
    toast.show(tl.toastRemoved, "danger");
  }

  async function handleClearAll() {
    if (!sessionId) return;
    const msg = lang === "sl" ? "Izprazniti seznam želja?" : "Clear your entire wishlist?";
    if (!window.confirm(msg)) return;
    await fetch(`/api/wishlist?session_id=${sessionId}`, { method: "DELETE" });
    setItems([]);
    toast.show(tl.toastCleared, "danger");
  }

  function handleAddAll() {
    items.forEach((item) => {
      const p = item.products;
      addItem({ productId: p.id, name: p.name, price: p.price, image: p.images?.[0] ?? "", quantity: 1, slug: p.slug });
    });
    toast.show(tl.toastAllAdded, "success");
  }

  const sorted = sortItems(items, sort);
  const count = items.length;
  const isEmpty = !loading && count === 0;

  const breadcrumbLabel = lang === "sl" ? "Seznam želja" : "Wishlist";

  return (
    <div style={{ background: "var(--gray-50)", minHeight: "100vh" }}>

      {/* Breadcrumb strip */}
      <div style={{
        padding: "20px 0",
        borderBottom: "1px solid var(--gray-100)",
        background: "var(--white)",
      }}>
        <div className="container">
          <nav style={{
            display: "flex", alignItems: "center", flexWrap: "wrap",
            gap: 2, fontSize: 13, color: "var(--gray-400)",
          }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              {tl.nav.home}
            </Link>
            <i className="ri-arrow-right-s-line" style={{ fontSize: 12, color: "var(--gray-600)" }} />
            <span style={{ color: "var(--gray-900)", fontWeight: 600 }}>
              {breadcrumbLabel}
            </span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>

        {/* Page header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: 24, flexWrap: "wrap",
          paddingBottom: 8,
        }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              fontSize: 32, fontWeight: 800, color: "var(--gray-900)",
              letterSpacing: "-0.5px", marginBottom: 8,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "var(--heart-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--heart)", fontSize: 22, flexShrink: 0,
              }}>
                <i className="ri-heart-3-fill" />
              </div>
              <h1 style={{ margin: 0, fontSize: "inherit", fontWeight: "inherit" }}>
                {tl.wishHeading}
              </h1>
            </div>
            {!isEmpty && !loading && (
              <p style={{ fontSize: 16, color: "var(--gray-400)", margin: 0 }}>
                {getCountLabel(count, lang, tl)}
              </p>
            )}
          </div>

          {/* Action buttons — only when items exist */}
          {!isEmpty && !loading && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button
                onClick={handleAddAll}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "10px 20px", borderRadius: 10,
                  fontSize: 13, fontWeight: 600,
                  border: "1.5px solid transparent",
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(14,165,233,.25)",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(14,165,233,.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(14,165,233,.25)";
                }}
              >
                <i className="ri-shopping-cart-line" />
                {tl.wishAddAll}
              </button>

              <button
                onClick={handleClearAll}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "10px 20px", borderRadius: 10,
                  fontSize: 13, fontWeight: 600,
                  border: "1.5px solid var(--gray-200)",
                  background: "var(--white)", color: "var(--gray-600)",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#fecaca";
                  e.currentTarget.style.color = "var(--danger)";
                  e.currentTarget.style.background = "var(--danger-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--gray-200)";
                  e.currentTarget.style.color = "var(--gray-600)";
                  e.currentTarget.style.background = "var(--white)";
                }}
              >
                <i className="ri-delete-bin-line" />
                {tl.wishClearAll}
              </button>
            </div>
          )}
        </div>

        {/* Toolbar */}
        {!isEmpty && !loading && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            gap: 12, flexWrap: "wrap", marginTop: 32, marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Count pill */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 100,
                background: "var(--heart-light)", color: "var(--heart)",
                fontSize: 13, fontWeight: 700,
              }}>
                <i className="ri-heart-fill" style={{ fontSize: 15 }} />
                {count}
              </span>

              {/* Sort select */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                style={{
                  padding: "8px 36px 8px 14px", borderRadius: 10,
                  border: "1.5px solid var(--gray-200)",
                  fontSize: 13, fontWeight: 600,
                  color: "var(--gray-600)", background: "var(--white)",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  cursor: "pointer", outline: "none",
                }}
              >
                <option value="newest">{tl.wishSortNewest}</option>
                <option value="name">{tl.wishSortName}</option>
                <option value="price-low">{tl.wishSortPriceLow}</option>
                <option value="price-high">{tl.wishSortPriceHigh}</option>
              </select>
            </div>

            {/* View toggle */}
            <div style={{
              display: "inline-flex", padding: 4,
              background: "var(--gray-100)", borderRadius: 10, gap: 2,
            }}>
              {(["grid", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  style={{
                    width: 38, height: 38, borderRadius: 8, border: "none",
                    background: view === v ? "var(--white)" : "transparent",
                    color: view === v ? "var(--gray-800)" : "var(--gray-400)",
                    boxShadow: view === v ? "var(--shadow-sm)" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: 16, transition: "all 0.15s ease",
                  }}
                >
                  <i className={v === "grid" ? "ri-grid-fill" : "ri-list-check"} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            textAlign: "center", padding: "80px 0",
            color: "var(--gray-400)", fontSize: 14,
          }}>
            <i className="ri-loader-4-line" style={{ fontSize: 32, marginBottom: 12, display: "block" }} />
            {lang === "sl" ? "Nalagam…" : "Loading…"}
          </div>
        )}

        {/* Empty state */}
        {isEmpty && (
          <div style={{
            background: "var(--white)", borderRadius: "var(--radius-lg)",
            border: "1px solid var(--gray-100)", padding: "80px 40px",
            textAlign: "center", marginTop: 32,
          }}>
            <div style={{
              width: 110, height: 110, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--heart-light), #fce7f3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 48, color: "var(--heart)",
              margin: "0 auto 28px",
              animation: "pulse-heart 2s ease-in-out infinite",
            }}>
              <i className="ri-heart-line" />
            </div>
            <h2 style={{
              fontSize: 26, fontWeight: 800, color: "var(--gray-800)", marginBottom: 10,
            }}>
              {tl.wishEmptyTitle}
            </h2>
            <p style={{
              fontSize: 15, color: "var(--gray-400)", lineHeight: 1.6,
              maxWidth: 400, margin: "0 auto 32px",
            }}>
              {tl.wishEmptyDesc}
            </p>
            <Link
              href="/shop"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 12,
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                color: "white", fontSize: 15, fontWeight: 600,
                textDecoration: "none", transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 24px rgba(14,165,233,.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              <i className="ri-flask-line" />
              {tl.wishEmptyBtn}
            </Link>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !isEmpty && (
          <div className={`wishlist-grid${view === "list" ? " list-view" : ""}`}>
            {sorted.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                viewMode={view}
                tl={tl}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
