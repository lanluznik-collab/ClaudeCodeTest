"use client";

import { useToast } from "@/lib/stores/toast";

const iconMap = {
  success: { cls: "ri-check-double-line", color: "var(--success)" },
  danger: { cls: "ri-heart-line", color: "var(--danger)" },
  info: { cls: "ri-file-copy-line", color: "var(--primary)" },
};

export default function Toast() {
  const { visible, message, type } = useToast();
  const icon = iconMap[type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        left: "50%",
        zIndex: 99999,
        pointerEvents: "none",
        background: "var(--gray-900)",
        color: "white",
        padding: "14px 28px",
        borderRadius: "14px",
        fontSize: "14px",
        fontWeight: 600,
        boxShadow: "0 10px 40px rgba(0,0,0,.25)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        transition: "all 0.4s cubic-bezier(.4,0,.2,1)",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(80px)",
      }}
    >
      <i
        className={icon.cls}
        style={{ fontSize: "20px", color: icon.color }}
      />
      <span>{message}</span>
    </div>
  );
}
