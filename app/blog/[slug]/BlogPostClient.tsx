"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { BlogPost } from "@/types";

const MONTHS_SLO = [
  "januar", "februar", "marec", "april", "maj", "junij",
  "julij", "avgust", "september", "oktober", "november", "december",
];
const MONTHS_ENG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const lang = useLanguageStore((s) => s.lang);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const tl = mounted ? translations[lang] : translations.sl;
  const isSlo = !mounted || lang === "sl";

  const title = isSlo ? post.title.slo : post.title.eng;
  const intro = isSlo ? post.intro.slo : post.intro.eng;

  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#eeeeee", minHeight: "70vh" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#111111", borderBottom: "1px solid #2a2a2a" }}>
        <div className="mx-auto px-4 md:px-8 py-3" style={{ maxWidth: "1200px" }}>
          <p style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#999", margin: 0 }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>{tl.nav.home}</Link>
            <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
            <Link href="/blog" style={{ color: "#999", textDecoration: "none" }}>{tl.nav.blog}</Link>
            <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
            <span style={{ color: "#ddd" }}>{title}</span>
          </p>
        </div>
      </div>

      {/* Article */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px 96px" }}>
        {post.tag && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(201,168,76,.12)", color: "#c9a84c",
            padding: "5px 14px", borderRadius: "100px",
            fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em", marginBottom: "18px",
          }}>
            {post.tag_icon && <i className={post.tag_icon} />}
            {post.tag}
          </div>
        )}

        <p style={{
          fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
          letterSpacing: "0.18em", color: "#999", textTransform: "uppercase", marginBottom: "16px",
        }}>
          {formatDate(post.published_at, isSlo)}
          {post.author ? ` · ${post.author}` : ""}
          {post.read_minutes ? ` · ${post.read_minutes} ${isSlo ? "min branja" : "min read"}` : ""}
        </p>

        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900,
          color: "#fff", lineHeight: 1.2, margin: "0 0 32px 0",
        }}>
          {title}
        </h1>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={title}
            style={{ width: "100%", borderRadius: "8px", marginBottom: "40px", border: "1px solid rgba(255,255,255,0.15)" }}
          />
        )}

        {intro && (
          <p style={{
            fontFamily: "var(--font-opensans)", fontSize: "18px", lineHeight: 1.7,
            color: "rgba(255,255,255,0.7)", fontStyle: "italic",
            borderLeft: "3px solid #c9a84c", paddingLeft: "20px", marginBottom: "40px",
          }}>
            {intro}
          </p>
        )}

        {Array.isArray(post.body) && post.body.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {post.body.map((section, i) => (
              <div key={i}>
                <h2 style={{
                  fontFamily: "var(--font-montserrat)", fontSize: "20px", fontWeight: 800,
                  color: "#fff", margin: "0 0 12px 0",
                }}>
                  {isSlo ? section.head.slo : section.head.eng}
                </h2>
                <p style={{
                  fontFamily: "var(--font-opensans)", fontSize: "16px",
                  lineHeight: 1.9, color: "rgba(255,255,255,0.8)", margin: 0,
                }}>
                  {isSlo ? section.text.slo : section.text.eng}
                </p>
              </div>
            ))}
          </div>
        )}

        {post.cta_product && (
          <div style={{
            marginTop: "48px", padding: "24px",
            background: "linear-gradient(135deg, #1a1a1a, #1a2640)",
            borderRadius: "8px", textAlign: "center",
          }}>
            <Link
              href="/shop"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #c9a84c, #a8863a)",
                color: "#000", borderRadius: "6px",
                fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.06em", textDecoration: "none",
              }}
            >
              <i className="ri-flask-line" />
              {tl.blogArticleCta} {post.cta_product}
            </Link>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "12px", marginBottom: 0 }}>
              {tl.blogArticleDisc}
            </p>
          </div>
        )}

        <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <Link href="/blog" style={{
            fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.1em", color: "#c9a84c", textDecoration: "none", textTransform: "uppercase",
          }}>
            ← {tl.nav.blog}
          </Link>
        </div>
      </div>
    </div>
  );
}
