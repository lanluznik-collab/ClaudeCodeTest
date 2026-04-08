import Link from "next/link";

const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3C/svg%3E")`;

export function Hero({ heroImage }: { heroImage?: string }) {
  return (
    <section
      style={{
        backgroundColor: "#0a0a0a",
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
        backgroundImage: "radial-gradient(ellipse 60% 70% at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content: single column on mobile, two columns on desktop */}
      {/* NOTE: no display in inline style — Tailwind flex controls layout */}
      <div
        className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 mx-auto px-6 py-16 md:py-24 pb-28 md:pb-36 w-full"
        style={{ maxWidth: "1200px", zIndex: 10 }}
      >
        {/* Text block — full width on mobile */}
        <div className="w-full md:flex-1 text-center md:text-left">
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.25em",
            color: "#c9a84c", marginBottom: "20px", opacity: 0.85,
          }}>
            Premium Research Peptidi
          </p>

          <h1
            className="hero-headline"
            style={{
              fontSize: "clamp(1.8rem, 6vw, 4rem)",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            Najvišja kakovost<br />peptidov za prodajo
          </h1>

          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "15px", color: "rgba(255,255,255,0.75)",
            lineHeight: 1.75, marginBottom: "40px",
          }}>
            Ponosni smo, da ponujamo najvišjo kakovost peptidov in peptidnih mešanic v industriji.
          </p>

          <Link href="/shop" className="hero-cta">
            KUPI PEPTIDE
          </Link>
        </div>

        {/* Image / placeholder — hidden on mobile, visible on desktop */}
        {/* NOTE: no display in inline style — Tailwind hidden/md:flex controls it */}
        <div className="hidden md:flex flex-1 justify-center items-center">
          {heroImage ? (
            <img
              src={heroImage}
              alt="Hero product"
              style={{ width: "420px", maxWidth: "100%", objectFit: "contain" }}
            />
          ) : (
            <div style={{
              width: "360px", height: "360px", borderRadius: "50%",
              background: "radial-gradient(circle at 40% 40%, rgba(201,168,76,0.12), rgba(0,0,0,0.5))",
              border: "1px solid rgba(201,168,76,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute", inset: "20px", borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.1)",
              }} />
              <p style={{
                fontSize: "11px", textTransform: "uppercase",
                letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)",
                fontFamily: "var(--font-montserrat)",
              }}>
                Slika izdelka
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Diagonal white cut — smaller height on mobile to avoid large white area */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "60px",
          backgroundColor: "#ffffff",
          clipPath: "polygon(0 100%, 100% 20%, 100% 100%)",
        }}
      />
    </section>
  );
}
