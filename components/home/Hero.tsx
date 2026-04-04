import Link from "next/link";

export function Hero() {
  return (
    <section
      style={{
        backgroundColor: "#0a0a0a",
        minHeight: "80vh",
        position: "relative",
        overflow: "hidden",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {/* Gold radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(201,168,76,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{ position: "relative", zIndex: 10 }}
        className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center py-24 gap-16"
      >
        {/* LEFT — text */}
        <div className="flex-1 flex flex-col items-start">

          {/* Label badge */}
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color: "#C9A84C",
              border: "1px solid rgba(201,168,76,0.35)",
              padding: "4px 12px",
              marginBottom: "28px",
            }}
          >
            Premium Quality
          </span>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(3rem, 6vw, 5rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              marginBottom: "24px",
              color: "#C9A84C",
            }}
          >
            Quality<br />
            <span style={{ color: "#ffffff" }}>You Can</span><br />
            Feel.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: "400px",
              marginBottom: "40px",
              opacity: 0.75,
            }}
          >
            Carefully sourced, rigorously tested. Built for people who care about what they put in their body.
          </p>

          {/* CTA button */}
          <Link
            href="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "transparent",
              border: "2px solid #4caf50",
              color: "#4caf50",
              padding: "14px 36px",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              borderRadius: "4px",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#4caf50";
              (e.currentTarget as HTMLAnchorElement).style.color = "#000";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#4caf50";
            }}
          >
            Shop Now →
          </Link>
        </div>

        {/* RIGHT — product image placeholder */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div
            style={{
              width: "380px",
              height: "380px",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "absolute", inset: "16px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.15)" }} />
            <div style={{ position: "absolute", inset: "32px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.08)" }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>
                Product Image
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal white cut at the bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100px",
          backgroundColor: "#ffffff",
          clipPath: "polygon(0 100%, 100% 20%, 100% 100%)",
        }}
      />
    </section>
  );
}
