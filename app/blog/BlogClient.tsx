"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

interface JsonField { slo: string; eng: string; }
interface BodySection { head: JsonField; text: JsonField; }
export interface BlogPostNew {
  id: string;
  slug: string;
  tag: string | null;
  tag_icon: string | null;
  published_at: string;
  read_minutes: number | null;
  cover_image: string | null;
  title: JsonField;
  intro: JsonField;
  body: BodySection[];
  cta_product: string | null;
}

const MONTHS_SLO = [
  "januar","februar","marec","april","maj","junij",
  "julij","avgust","september","oktober","november","december",
];
const MONTHS_ENG = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatDate(dateStr: string, isSlo: boolean): string {
  const d = new Date(dateStr);
  const day = d.getUTCDate();
  const month = d.getUTCMonth();
  const year = d.getUTCFullYear();
  return isSlo
    ? `${day}. ${MONTHS_SLO[month]} ${year}`
    : `${MONTHS_ENG[month]} ${day}, ${year}`;
}

const SIDEBAR_TAGS = [
  { icon: "ri-first-aid-kit-line", tk: "blogTagRegen" },
  { icon: "ri-leaf-line",          tk: "blogTagLong"  },
  { icon: "ri-brain-line",         tk: "blogTagCog"   },
  { icon: "ri-run-line",           tk: "blogTagMuscle"},
  { icon: "ri-moon-line",          tk: "blogTagSleep" },
] as const;

type TlKey = keyof typeof translations.sl;

interface Props { posts: BlogPostNew[]; }

export default function BlogClient({ posts }: Props) {
  const [mounted, setMounted] = useState(false);
  const lang = useLanguageStore((s) => s.lang);
  useEffect(() => setMounted(true), []);

  const tl  = mounted ? translations[lang] : translations.sl;
  const isSlo = !mounted || lang === "sl";

  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumbItems={[
          { label: tl.nav.home, href: "/" },
          { label: tl.nav.blog },
        ]}
        title={tl.blogHero}
        subtitle={tl.blogHeroSub}
      />

      {/* Main layout */}
      <section style={{ background: "var(--gray-50)" }} className="pt-16 pb-8 md:pb-20">
        <div className="container">
          <div className="blog-grid">

            {/* ── LEFT: articles ───────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              {posts.length === 0 && (
                <p style={{ color: "var(--gray-400)", fontStyle: "italic" }}>
                  {isSlo ? "Ni objavljenih člankov." : "No articles published yet."}
                </p>
              )}
              {posts.map((post) => (
                <article key={post.id} className="blog-card">
                  {/* Image area */}
                  <div style={{
                    position: "relative", height: "260px", overflow: "hidden",
                    background: "linear-gradient(135deg, var(--gray-900), #1a2640)",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image ?? ""}
                      alt=""
                      className="blog-card-img"
                      onError={(e) => { e.currentTarget.style.opacity = "0.1"; }}
                    />

                    {/* Tag pill top-left */}
                    {post.tag && (
                      <div style={{
                        position: "absolute", top: 16, left: 16,
                        background: "rgba(201,168,76,.9)",
                        backdropFilter: "blur(6px)",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "100px",
                        fontSize: "12px",
                        fontWeight: 700,
                        display: "inline-flex",
                        gap: "6px",
                        alignItems: "center",
                      }}>
                        {post.tag_icon && <i className={post.tag_icon} />}
                        {post.tag}
                      </div>
                    )}

                    {/* Meta pills bottom-left */}
                    <div style={{
                      position: "absolute", bottom: 16, left: 16,
                      display: "flex", gap: "12px", flexWrap: "wrap",
                    }}>
                      {[
                        {
                          icon: "ri-calendar-line",
                          text: formatDate(post.published_at, isSlo),
                        },
                        post.read_minutes !== null && {
                          icon: "ri-time-line",
                          text: isSlo
                            ? `${post.read_minutes} min branja`
                            : `${post.read_minutes} min read`,
                        },
                      ].filter(Boolean).map((pill, i) => {
                        if (!pill || typeof pill === "boolean") return null;
                        return (
                          <span key={i} style={{
                            background: "rgba(0,0,0,.5)",
                            backdropFilter: "blur(6px)",
                            color: "rgba(255,255,255,.85)",
                            padding: "4px 10px",
                            borderRadius: "100px",
                            fontSize: "12px",
                            fontWeight: 500,
                            display: "inline-flex",
                            gap: "5px",
                            alignItems: "center",
                          }}>
                            <i className={pill.icon} style={{ fontSize: "13px" }} />
                            {pill.text}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "28px 32px 32px" }}>
                    <h2 style={{
                      fontSize: "22px", fontWeight: 800,
                      color: "var(--gray-900)", lineHeight: 1.3,
                      letterSpacing: "-0.3px", marginBottom: "12px",
                    }}>
                      {isSlo ? post.title.slo : post.title.eng}
                    </h2>
                    <p style={{
                      fontSize: "15px", color: "var(--gray-500)",
                      lineHeight: 1.75, marginBottom: "24px",
                    }}>
                      {isSlo ? post.intro.slo : post.intro.eng}
                    </p>

                    {/* Body sections */}
                    {Array.isArray(post.body) && post.body.length > 0 && (
                      <div style={{
                        display: "flex", flexDirection: "column", gap: "20px",
                        paddingTop: "20px", borderTop: "1px solid var(--gray-100)",
                      }}>
                        {post.body.map((section, i) => (
                          <div key={i}>
                            <p className="blog-section-head">
                              {isSlo ? section.head.slo : section.head.eng}
                            </p>
                            <p style={{
                              fontSize: "14px", color: "var(--gray-600)", lineHeight: 1.75, margin: 0,
                            }}>
                              {isSlo ? section.text.slo : section.text.eng}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="blog-card-footer">
                    <Link
                      href="/shop"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "10px 20px",
                        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: 700,
                        textDecoration: "none",
                        flexShrink: 0,
                      }}
                    >
                      <i className="ri-flask-line" />
                      {tl.blogArticleCta} {post.cta_product}
                    </Link>
                    <p
                      className="blog-card-footer-disc"
                      style={{
                        fontSize: "11px", color: "var(--gray-400)",
                        maxWidth: "360px", lineHeight: 1.5, margin: 0,
                      }}
                    >
                      {tl.blogArticleDisc}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* ── RIGHT: sidebar ───────────────────────────────────────── */}
            <aside className="blog-sidebar">

              {/* Card 1: Categories */}
              <div style={{
                background: "var(--white)",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
              }}>
                <h3 style={{
                  fontSize: "13px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.8px",
                  color: "var(--gray-500)", marginBottom: "16px",
                }}>
                  {tl.blogSideCats}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0" }}>
                  {SIDEBAR_TAGS.map(({ icon, tk }) => (
                    <button
                      key={tk}
                      className="blog-tag-pill"
                      style={{ margin: "0 6px 8px 0" }}
                    >
                      <i className={icon} />
                      {tl[tk as TlKey] as string}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 2: Disclaimer */}
              <div style={{
                background: "#e5e7eb",
                border: "1px solid #c9cfe0",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
              }}>
                <h3 style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "12px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.8px",
                  color: "var(--accent)", marginBottom: "10px",
                }}>
                  <i className="ri-error-warning-line" />
                  {tl.blogDisclaimerTitle}
                </h3>
                <p style={{
                  fontSize: "13px", color: "#6b7280",
                  lineHeight: 1.65, margin: 0,
                }}>
                  {tl.blogDisclaimerText}
                </p>
              </div>

              {/* Card 3: CTA */}
              <div style={{
                background: "linear-gradient(135deg, var(--gray-900), #1a2640)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                textAlign: "center",
              }}>
                <h3 style={{
                  fontSize: "15px", fontWeight: 700, color: "white",
                  marginBottom: "8px",
                }}>
                  {tl.blogCtaTitle}
                </h3>
                <p style={{
                  fontSize: "13px", color: "var(--gray-400)",
                  lineHeight: 1.6, marginBottom: "16px",
                }}>
                  {tl.blogCtaText}
                </p>
                <Link href="/shop" className="blog-sidebar-cta-btn">
                  <i className="ri-store-2-line" />
                  {tl.blogCtaBtn}
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
