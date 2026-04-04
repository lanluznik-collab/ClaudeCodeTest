export function Footer() {
  return (
    <footer style={{ backgroundColor: "#161616", borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: 0 }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 24px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "24px",
        flexWrap: "wrap",
      }}>
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 900,
          fontSize: "16px",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#ffffff",
          margin: 0,
        }}>
          STORE
        </p>
        <p style={{ fontFamily: "var(--font-opensans)", fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
          &copy; {new Date().getFullYear()} Store. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "28px" }}>
          {["Privacy", "Terms"].map((label) => (
            <a key={label} href="#" style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#ca8b2b")}
              onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
