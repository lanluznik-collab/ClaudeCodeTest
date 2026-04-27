"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

interface CoaRow {
  id: string;
  product_id: string | null;
  batch_number: string | null;
  test_date: string | null;
  file_url: string | null;
  file_size: string | null;
  status: string;
  created_at: string;
  products: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  } | null;
}

interface UniqueProduct {
  id: string;
  name: string;
}

interface Props {
  docs: CoaRow[];
  uniqueProducts: UniqueProduct[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function CoaClient({ docs, uniqueProducts }: Props) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tl = mounted ? translations[lang] : translations.sl;

  const [selectedProduct, setSelectedProduct] = useState("");
  const [batchInput, setBatchInput] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBatchChange = useCallback((val: string) => {
    setBatchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setBatchFilter(val), 150);
  }, []);

  const handleSearch = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setBatchFilter(batchInput);
  };

  const handleReset = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSelectedProduct("");
    setBatchInput("");
    setBatchFilter("");
  };

  const visibleDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (selectedProduct && doc.product_id !== selectedProduct) return false;
      if (batchFilter && !(doc.batch_number ?? "").toLowerCase().includes(batchFilter.toLowerCase())) return false;
      return true;
    });
  }, [docs, selectedProduct, batchFilter]);

  const batchPlaceholder = tl === translations.sl ? "npr. 2026307..." : "e.g. 2026307...";

  // Shared input/select styles
  const fieldStyle: React.CSSProperties = {
    height: "44px",
    padding: "0 12px",
    border: "1.5px solid var(--gray-200)",
    borderRadius: "10px",
    background: "var(--gray-50)",
    fontSize: "14px",
    color: "var(--gray-800)",
    width: "100%",
    outline: "none",
    fontFamily: "var(--font-opensans)",
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <style>{`
        .coa-hero-glow {
          position: absolute;
          top: -40%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(14,165,233,.12), transparent 70%);
          pointer-events: none;
        }
        .coa-dl-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .coa-dl-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(14,165,233,.35);
        }
        .coa-row:hover td { background: var(--gray-50); }
        .coa-field:focus {
          border-color: var(--primary) !important;
          background: var(--white) !important;
          box-shadow: 0 0 0 3px rgba(14,165,233,.15);
        }
        @media (max-width: 1024px) { .coa-col-size { display: none !important; } }
        @media (max-width: 768px)  { .coa-col-date, .coa-col-status { display: none !important; } }
        @media (max-width: 480px)  { .coa-col-thumb { display: none !important; } }
      `}</style>

      <section
        style={{
          background: "linear-gradient(135deg, var(--gray-900), #1a2640)",
          padding: "56px 0 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="coa-hero-glow" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Label */}
          <div style={{
            display: "inline-flex", gap: "6px", alignItems: "center",
            fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "2px", color: "var(--primary)", marginBottom: "12px",
          }}>
            <i className="ri-file-text-line" />
            {tl.coaHeroLabel}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "44px", fontWeight: 800, color: "white",
            margin: "0 0 14px 0", lineHeight: 1.1,
          }}>
            COA Vault
          </h1>

          {/* Description */}
          <p style={{
            fontSize: "15px", color: "var(--gray-400)",
            maxWidth: "560px", lineHeight: 1.7, margin: "0 0 20px 0",
          }}>
            {tl.coaHeroDesc}
          </p>

          {/* Breadcrumb */}
          <nav style={{
            display: "flex", alignItems: "center", gap: "2px",
            fontSize: "13px", color: "var(--gray-400)",
          }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              {tl.nav.home}
            </Link>
            <i className="ri-arrow-right-s-line" style={{ fontSize: "12px", color: "var(--gray-600)" }} />
            <span style={{ color: "white", fontWeight: 600 }}>COA Vault</span>
          </nav>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <section style={{ background: "var(--gray-50)", padding: "36px 0 60px" }}>
        <div className="container">

          {/* Filter card */}
          <div style={{
            background: "var(--white)",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            padding: "28px",
            marginBottom: "28px",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "14px", fontWeight: 700, color: "var(--primary)",
              marginBottom: "18px",
            }}>
              <i className="ri-search-line" />
              {tl.coaFilterTitle}
            </div>

            <div style={{
              display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "flex-end",
            }}>
              {/* Product select */}
              <div style={{ flex: "1 1 200px" }}>
                <label style={{
                  display: "block", fontSize: "11px", fontWeight: 700,
                  textTransform: "uppercase", color: "var(--gray-500)",
                  marginBottom: "6px", letterSpacing: "0.5px",
                }}>
                  {tl.coaFilterProd}
                </label>
                <select
                  className="coa-field"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  style={fieldStyle}
                >
                  <option value="">
                    {tl.coaAllProducts} ({docs.length})
                  </option>
                  {uniqueProducts.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Batch input */}
              <div style={{ flex: "1 1 200px" }}>
                <label style={{
                  display: "block", fontSize: "11px", fontWeight: 700,
                  textTransform: "uppercase", color: "var(--gray-500)",
                  marginBottom: "6px", letterSpacing: "0.5px",
                }}>
                  {tl.coaFilterBatch}
                </label>
                <input
                  className="coa-field"
                  type="text"
                  placeholder={batchPlaceholder}
                  value={batchInput}
                  onChange={(e) => handleBatchChange(e.target.value)}
                  style={fieldStyle}
                />
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                style={{
                  height: "44px",
                  padding: "0 20px",
                  background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                  border: "none",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                <i className="ri-search-line" />
                {tl.coaFilterBtn}
              </button>

              {/* Reset button */}
              <button
                onClick={handleReset}
                style={{
                  height: "44px",
                  padding: "0 20px",
                  background: "var(--gray-100)",
                  border: "1.5px solid var(--gray-200)",
                  borderRadius: "10px",
                  color: "var(--gray-600)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {tl.coaFilterReset}
              </button>
            </div>
          </div>

          {/* Info bar */}
          <div style={{
            display: "flex", alignItems: "center",
            fontSize: "13px", color: "var(--gray-500)",
            marginBottom: "20px",
          }}>
            {tl.coaShowing}&nbsp;
            <strong style={{ color: "var(--gray-800)", fontWeight: 700 }}>{visibleDocs.length}</strong>
            &nbsp;{tl.coaOfTotal}&nbsp;{docs.length}&nbsp;{tl.coaDocuments}
          </div>

          {/* Table wrapper */}
          <div style={{
            background: "var(--white)",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{
                  background: "var(--gray-50)",
                  borderBottom: "2px solid var(--gray-200)",
                }}>
                  {[
                    { key: "product", label: tl.coaThProduct, cls: "" },
                    { key: "batch",   label: tl.coaThBatch,   cls: "" },
                    { key: "date",    label: tl.coaThDate,    cls: "coa-col-date" },
                    { key: "size",    label: tl.coaThSize,    cls: "coa-col-size" },
                    { key: "status",  label: tl.coaThStatus,  cls: "coa-col-status" },
                    { key: "action",  label: tl.coaThAction,  cls: "" },
                  ].map(({ key, label, cls }) => (
                    <th
                      key={key}
                      className={cls}
                      style={{
                        padding: "12px 16px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        color: "var(--gray-500)",
                        textAlign: key === "action" ? "right" : "left",
                      }}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleDocs.map((doc, i) => (
                  <tr
                    key={doc.id}
                    className="coa-row"
                    style={{
                      borderBottom: i < visibleDocs.length - 1 ? "1px solid var(--gray-100)" : "none",
                    }}
                  >
                    {/* Product */}
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div
                          className="coa-col-thumb"
                          style={{
                            width: "44px", height: "44px", flexShrink: 0,
                            background: "var(--gray-100)",
                            borderRadius: "10px",
                            padding: "4px",
                            overflow: "hidden",
                          }}
                        >
                          {doc.products?.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={doc.products.images[0]}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                (e.currentTarget.parentElement as HTMLElement).style.background = "var(--gray-200)";
                              }}
                              style={{
                                width: "100%", height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          )}
                        </div>
                        {doc.products ? (
                          <Link
                            href={`/shop/${doc.products.slug}`}
                            style={{
                              fontSize: "13px", fontWeight: 600,
                              color: "var(--primary)", textDecoration: "none",
                            }}
                            className="coa-product-link"
                          >
                            {doc.products.name}
                          </Link>
                        ) : (
                          <span style={{ fontSize: "13px", color: "var(--gray-500)" }}>—</span>
                        )}
                      </div>
                    </td>

                    {/* Batch */}
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 700,
                        color: "var(--gray-700)",
                        fontSize: "13px",
                      }}>
                        {doc.batch_number ?? "—"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="coa-col-date" style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "13px", color: "var(--gray-500)" }}>
                        {formatDate(doc.test_date)}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="coa-col-size" style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "12px", color: "var(--gray-400)" }}>
                        {doc.file_size ?? "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="coa-col-status" style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: "#dcfce7", color: "#15803d",
                        padding: "3px 10px", borderRadius: "999px",
                        fontSize: "11px", fontWeight: 700,
                        display: "inline-flex", gap: "4px", alignItems: "center",
                      }}>
                        <i className="ri-checkbox-circle-fill" style={{ fontSize: "12px" }} />
                        {tl.coaStatusCurrent}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      {doc.file_url ? (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="coa-dl-btn"
                        >
                          <i className="ri-download-2-line" />
                          PDF
                        </a>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--gray-400)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty state */}
            {visibleDocs.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "64px 20px",
              }}>
                <i className="ri-file-search-line" style={{ fontSize: "48px", color: "var(--gray-300)", display: "block", marginBottom: "12px" }} />
                <p style={{ fontSize: "13px", color: "var(--gray-500)", margin: 0 }}>
                  {tl.coaNoResults}
                </p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div style={{
            background: "var(--white)",
            border: "1px solid #fde68a",
            borderRadius: "var(--radius-lg)",
            padding: "20px 24px",
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
            marginTop: "28px",
          }}>
            <i
              className="ri-error-warning-line"
              style={{ fontSize: "22px", color: "var(--warning)", marginTop: "1px", flexShrink: 0 }}
            />
            <p style={{
              fontSize: "13px",
              color: "var(--gray-600)",
              lineHeight: 1.65,
              margin: 0,
            }}>
              {tl.coaDisclaimer}
            </p>
          </div>

        </div>
      </section>

      <style>{`
        .coa-product-link:hover {
          color: var(--primary-dark) !important;
          text-decoration: underline !important;
        }
      `}</style>
    </>
  );
}
