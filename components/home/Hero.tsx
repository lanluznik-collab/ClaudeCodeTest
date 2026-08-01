import Link from "next/link";

const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(45%2C212%2C191%2C0.08)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(45%2C212%2C191%2C0.08)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(45%2C212%2C191%2C0.08)' stroke-width='1'/%3E%3C/svg%3E")`;

export function Hero() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-brand-deep)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background patterns */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: HEX_PATTERN,
        backgroundSize: "60px 104px",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(ellipse 80% 70% at 30% 50%, rgba(45,212,191,0.14) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content — full width, text centred */}
      <div
        className="relative mx-auto px-6 py-16 md:py-28 pb-28 md:pb-36 w-full"
        style={{ maxWidth: "900px", zIndex: 10, textAlign: "center" }}
      >
        <p style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "11px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.25em",
          color: "var(--color-accent)", marginBottom: "20px", opacity: 0.85,
        }}>
          Premium Research Peptidi
        </p>

        <h1
          className="hero-headline"
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
            lineHeight: 1.1,
            marginBottom: "28px",
          }}
        >
          Najvišja kakovost<br />peptidov za prodajo
        </h1>

        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "16px", color: "rgba(255,255,255,0.7)",
          lineHeight: 1.8, marginBottom: "44px",
          maxWidth: "560px", margin: "0 auto 44px",
        }}>
          Ponosni smo, da ponujamo najvišjo kakovost peptidov in peptidnih mešanic v industriji.
        </p>

        <Link href="/shop" className="hero-cta">
          KUPI PEPTIDE
        </Link>
      </div>

    </section>
  );
}
