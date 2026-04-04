import Link from "next/link";

export function Hero() {
  return (
    <section style={{
      backgroundColor: "#2a1406",
      backgroundImage: [
        "radial-gradient(ellipse 70% 80% at 20% 50%, rgba(157,107,42,0.45) 0%, transparent 65%)",
        "radial-gradient(circle at 80% 50%, rgba(100,60,15,0.3) 0%, transparent 55%)",
      ].join(", "),
      minHeight: "80vh",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    }}>

      {/* Subtle diagonal line texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px)",
        pointerEvents: "none",
      }} />

      {/* Content — two columns */}
      <div style={{
        position: "relative",
        zIndex: 10,
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 24px 120px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "48px",
        width: "100%",
      }}>

        {/* LEFT — text */}
        <div style={{ flex: 1 }}>
          {/* Label */}
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "rgb(231,210,147)",
            marginBottom: "20px",
            opacity: 0.85,
          }}>
            Premium Research Peptides
          </p>

          {/* Headline — exact gradient from corepeptides.com */}
          <h1
            className="hero-headline"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
              lineHeight: 1.1,
              marginBottom: "24px",
              maxWidth: "520px",
            }}
          >
            Highest Quality<br />
            Products For Sale
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "15px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.82)",
            lineHeight: 1.75,
            maxWidth: "420px",
            marginBottom: "40px",
          }}>
            We are proud to carry the highest quality products and blends in the industry.
          </p>

          {/* CTA — exact corepeptides.com style */}
          <Link href="/shop" className="hero-cta">
            BUY NOW
          </Link>
        </div>

        {/* RIGHT — product image */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, rgba(157,107,42,0.25), rgba(0,0,0,0.4))",
            border: "1px solid rgba(183,135,66,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              inset: "20px",
              borderRadius: "50%",
              border: "1px solid rgba(231,210,147,0.12)",
            }} />
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-montserrat)" }}>
              Product Image
            </p>
          </div>
        </div>

      </div>

      {/* Diagonal white cut at bottom — exact corepeptides.com diagonal split */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100px",
        backgroundColor: "#ffffff",
        clipPath: "polygon(0 100%, 100% 25%, 100% 100%)",
      }} />

    </section>
  );
}
