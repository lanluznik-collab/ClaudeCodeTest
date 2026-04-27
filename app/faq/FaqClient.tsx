"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";
import { faqData, FaqItem } from "@/lib/faq-data";

type TlKey = keyof typeof translations.sl;

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    new RegExp(`^${escaped}$`, "i").test(part) ? <mark key={i}>{part}</mark> : part
  );
}

interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  isSlo: boolean;
  query: string;
  onToggle: () => void;
}

function AccordionItem({ item, isOpen, isSlo, query, onToggle }: AccordionItemProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.style.maxHeight = isOpen ? `${el.scrollHeight}px` : "0";
  }, [isOpen]);

  const q = isSlo ? item.q.slo : item.q.eng;
  const a = isSlo ? item.a.slo : item.a.eng;

  return (
    <div className={`faq-item${isOpen ? " open" : ""}`}>
      <button className="faq-question" onClick={onToggle}>
        <span className="faq-question-text">{highlight(q, query)}</span>
        <i className="ri-arrow-down-s-line faq-chevron" />
      </button>
      <div className="faq-answer-wrap" ref={bodyRef}>
        <div className="faq-answer">{highlight(a, query)}</div>
      </div>
    </div>
  );
}

export default function FaqClient() {
  const [mounted, setMounted] = useState(false);
  const lang = useLanguageStore((s) => s.lang);
  useEffect(() => setMounted(true), []);

  const tl = mounted ? translations[lang] : translations.sl;
  const isSlo = !mounted || lang === "sl";

  const [query, setQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const allIds = faqData.flatMap((cat) => cat.items.map((i) => i.id));

  const filtered = faqData.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      if (!query.trim()) return true;
      const q = `${item.q.slo} ${item.q.eng} ${item.a.slo} ${item.a.eng}`;
      return q.toLowerCase().includes(query.toLowerCase());
    }),
  })).filter((cat) => cat.items.length > 0);

  const visibleIds = filtered.flatMap((cat) => cat.items.map((i) => i.id));
  const totalVisible = visibleIds.length;

  useEffect(() => {
    if (query.trim()) {
      setOpenItems(new Set(visibleIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function toggle(id: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function expandAll() { setOpenItems(new Set(allIds)); }
  function collapseAll() { setOpenItems(new Set()); }

  function scrollToCategory(id: string) {
    document.getElementById(`faq-cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <PageHero
        breadcrumbItems={[
          { label: tl.nav.home, href: "/" },
          { label: tl.nav.faq },
        ]}
        title={tl.faqHero}
        subtitle={tl.faqHeroSub}
      />

      <section style={{ background: "var(--gray-50)", padding: "64px 0 80px" }}>
        <div className="container">
          <div className="faq-layout">

            {/* ── LEFT: accordion ─────────────────────────────────────── */}
            <div>
              {/* Search */}
              <div className="faq-search-wrap">
                <i className="ri-search-line faq-search-icon" />
                <input
                  type="text"
                  className="faq-search-input"
                  placeholder={tl.faqSearchPh}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                  <button className="faq-search-clear" onClick={() => setQuery("")} aria-label="Clear">
                    <i className="ri-close-line" />
                  </button>
                )}
              </div>

              {/* Controls */}
              <div className="faq-controls">
                <span className="faq-count">
                  {totalVisible} {isSlo ? "vprašanj" : "questions"}
                  {query.trim() && ` — "${query}"`}
                </span>
                <div className="faq-controls-btns">
                  <button className="faq-toggle-btn" onClick={expandAll}>
                    <i className="ri-add-line" />
                    {tl.faqExpandAll}
                  </button>
                  <button className="faq-toggle-btn" onClick={collapseAll}>
                    <i className="ri-subtract-line" />
                    {tl.faqCollapseAll}
                  </button>
                </div>
              </div>

              {/* Categories */}
              {filtered.length === 0 ? (
                <div className="faq-no-results">{tl.faqNoResults}</div>
              ) : (
                filtered.map((cat) => (
                  <div key={cat.id} id={`faq-cat-${cat.id}`} className="faq-category">
                    <div className="faq-category-head">
                      <i className={cat.icon} />
                      {tl[cat.labelKey as TlKey] as string}
                    </div>
                    {cat.items.map((item) => (
                      <AccordionItem
                        key={item.id}
                        item={item}
                        isOpen={openItems.has(item.id)}
                        isSlo={isSlo}
                        query={query}
                        onToggle={() => toggle(item.id)}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* ── RIGHT: sidebar ──────────────────────────────────────── */}
            <aside className="faq-sidebar">

              {/* Categories nav */}
              <div className="faq-sidebar-card">
                <p className="faq-sidebar-title">{tl.faqSidebarCats}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {faqData.map((cat) => (
                    <button
                      key={cat.id}
                      className="faq-cat-link"
                      onClick={() => scrollToCategory(cat.id)}
                    >
                      <i className={cat.icon} />
                      {tl[cat.labelKey as TlKey] as string}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact box */}
              <div className="faq-contact-card">
                <p style={{ fontSize: "14px", fontWeight: 700, color: "white", marginBottom: "6px" }}>
                  {tl.faqContactTitle}
                </p>
                <p style={{ fontSize: "13px", color: "var(--gray-400)", lineHeight: 1.6, margin: 0 }}>
                  {tl.faqContactText}
                </p>
                <a href="mailto:info@slopeps.com" className="faq-contact-email">
                  <i className="ri-mail-line" />
                  {tl.faqEmailLabel}
                </a>
              </div>

            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
