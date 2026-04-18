"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header style={{
      borderBottom: "1px solid #e5e5e5",
      backgroundColor: "#fff",
      color: "#111",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 900,
            fontSize: "14px",
            letterSpacing: "0.12em",
            color: "#c9a84c",
            marginRight: "16px",
          }}>
            SLOPEPS
          </span>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: pathname === href ? 600 : 400,
                color: pathname === href ? "#111" : "#666",
                backgroundColor: pathname === href ? "#f0f0f0" : "transparent",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            fontSize: "13px",
            color: "#888",
            cursor: "pointer",
            padding: "6px 12px",
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
