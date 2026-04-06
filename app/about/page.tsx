const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3C/svg%3E")`;

export default function AboutPage() {
  return (
    <>
      {/* Dark hero */}
      <section style={{
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
        minHeight: "260px",
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: HEX_PATTERN,
          backgroundSize: "60px 104px",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse 50% 80% at 15% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: "1200px", margin: "0 auto",
          padding: "60px 24px 120px",
          width: "100%",
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.25em",
            color: "#c9a84c", marginBottom: "12px",
          }}>
            Kdo smo
          </p>
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#c9a84c",
            margin: 0,
          }}>
            O podjetju SloPeps
          </h1>
        </div>
        {/* Diagonal cut to white */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
          backgroundColor: "#ffffff",
          clipPath: "polygon(0 100%, 100% 0%, 100% 100%)",
        }} />
      </section>

      {/* White content section */}
      <section style={{ backgroundColor: "#fff", color: "#111", padding: "64px 0 80px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>

          <h2 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "28px", fontWeight: 800,
            color: "#111", marginBottom: "20px",
          }}>
            O podjetju SloPeps
          </h2>

          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "16px", lineHeight: 1.8,
            color: "#444", marginBottom: "48px",
          }}>
            Smo vodilni ponudnik visokokakovostnih peptidov za raziskovalce in posameznike, ki niso pripravljeni kompromisirati kakovosti. Vsi naši izdelki so skrbno pridobljeni in testirani po najvišjih standardih, s stopnjo čistosti nad 99 %. Ponujamo širok izbor peptidov in strokovno ekipo, ki vam je vedno na voljo.
          </p>

          {/* Zakaj izbrati nas */}
          <h3 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "20px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.06em",
            color: "#c9a84c", marginBottom: "28px",
          }}>
            Zakaj izbrati nas?
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "48px" }}>
            {[
              {
                title: "Vrhunska kakovost",
                body: "Naši peptidi gredo skozi stroge postopke nadzora kakovosti, ki zagotavljajo njihovo čistost, stabilnost in doslednost.",
              },
              {
                title: "Široka ponudba",
                body: "Ponujamo obsežen katalog peptidov, vključno s standardnimi peptidi in mešanicami.",
              },
              {
                title: "Strokovna podpora",
                body: "Naredili bomo vse, kar je v naši moči, da bodo naše stranke zadovoljne — tudi po dostavi izdelkov.",
              },
              {
                title: "Hitra in brezplačna dostava",
                body: "Prizadevamo si za hitro in zanesljivo dostavo. Brezplačna poštnina za naročila nad določenim zneskom.",
              },
            ].map(({ title, body }) => (
              <div key={title} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{
                  flexShrink: 0,
                  width: "8px", height: "8px",
                  backgroundColor: "#c9a84c",
                  borderRadius: "50%",
                  marginTop: "7px",
                }} />
                <div>
                  <span style={{
                    fontFamily: "var(--font-montserrat)",
                    fontSize: "15px", fontWeight: 700,
                    color: "#111",
                  }}>
                    {title}:{" "}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-opensans)",
                    fontSize: "15px", lineHeight: 1.7,
                    color: "#555",
                  }}>
                    {body}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: "var(--font-opensans)",
            fontSize: "15px", color: "#555",
            borderTop: "1px solid #eee",
            paddingTop: "32px",
          }}>
            Za povpraševanja ali naročila nas kontaktirajte prek naše{" "}
            <a href="/contact" style={{ color: "#c9a84c", textDecoration: "underline" }}>kontaktne strani</a>.
          </p>
        </div>
      </section>
    </>
  );
}
