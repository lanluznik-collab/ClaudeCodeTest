"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Accordion({
  number,
  title,
  children,
  defaultOpen = false,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid var(--color-border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "18px 0",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "12px",
            fontWeight: 800,
            color: "var(--color-accent-text)",
            flexShrink: 0,
            width: "20px",
          }}
        >
          {String(number).padStart(2, "0")}
        </span>
        <span
          style={{
            flex: 1,
            fontFamily: "var(--font-montserrat)",
            fontSize: "14px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--color-text)",
          }}
        >
          {title}
        </span>
        <ChevronDown
          size={18}
          style={{
            flexShrink: 0,
            color: "var(--color-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div style={{ padding: "0 0 22px 34px" }}>
          <p
            style={{
              fontFamily: "var(--font-opensans)",
              fontSize: "14px",
              lineHeight: 1.8,
              color: "var(--color-text-muted)",
              maxWidth: "760px",
              margin: 0,
            }}
          >
            {children}
          </p>
        </div>
      )}
    </div>
  );
}
