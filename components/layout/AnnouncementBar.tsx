"use client";

import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/language-store";
import { translations } from "@/lib/i18n";

export function AnnouncementBar() {
  const lang = useLanguageStore((s) => s.lang);
  const [idx, setIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("announcement_dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    const msgs = translations[lang].announcements;
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % msgs.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [lang]);

  if (!mounted || dismissed) return null;

  const messages = translations[lang].announcements;

  return (
    <div
      role="banner"
      style={{
        backgroundColor: "#c9a84c",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        minHeight: "36px",
        padding: "6px 40px",
      }}
    >
      <p
        key={idx}
        style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          margin: 0,
          textAlign: "center",
          animation: "fadeIn 0.4s ease",
        }}
      >
        {messages[idx]}
      </p>

      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem("announcement_dismissed", "1");
        }}
        aria-label="Zapri"
        style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(0,0,0,0.5)",
          fontSize: "16px",
          lineHeight: 1,
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </button>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
