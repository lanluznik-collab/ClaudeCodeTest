import Link from "next/link";

export default function CancelPage() {
  return (
    <div style={{
      maxWidth: "500px", margin: "0 auto",
      padding: "96px 24px", textAlign: "center",
    }}>
      <p style={{ fontSize: "40px", marginBottom: "24px" }}>×</p>
      <h1 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "22px", fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "0.06em",
        color: "#fff", marginBottom: "12px",
      }}>
        Naročilo preklicano
      </h1>
      <p style={{
        fontFamily: "var(--font-opensans)",
        fontSize: "15px", color: "rgba(255,255,255,0.45)",
        lineHeight: 1.7, marginBottom: "36px",
      }}>
        Vaša košarica je še vedno shranjena.
      </p>
      <Link href="/cart" style={{
        display: "inline-block",
        padding: "14px 36px",
        backgroundColor: "#c9a84c",
        color: "#fff",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700, fontSize: "13px",
        textTransform: "uppercase", letterSpacing: "0.1em",
        textDecoration: "none",
        borderRadius: "2px",
      }}>
        Nazaj v košarico
      </Link>
    </div>
  );
}
