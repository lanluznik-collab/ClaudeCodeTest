const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3C/svg%3E")`;

export default function PogojiPage() {
  return (
    <>
      {/* Dark hero */}
      <section style={{
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
        minHeight: "220px",
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
          position: "relative", zIndex: 10,
          maxWidth: "1200px", margin: "0 auto",
          padding: "60px 24px 110px",
          width: "100%",
        }}>
          <p style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "11px", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.25em",
            color: "#c9a84c", marginBottom: "12px",
          }}>
            Pravne informacije
          </p>
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#c9a84c",
            margin: 0,
          }}>
            Pogoji poslovanja
          </h1>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "80px",
          backgroundColor: "#ffffff",
          clipPath: "polygon(0 100%, 100% 0%, 100% 100%)",
        }} />
      </section>

      {/* Content */}
      <section style={{ backgroundColor: "#fff", color: "#111", padding: "64px 0 80px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>

          <div style={{
            backgroundColor: "#fffbf0",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "6px",
            padding: "20px 24px",
            marginBottom: "40px",
            fontFamily: "var(--font-opensans)",
            fontSize: "14px",
            color: "#7a6020",
            lineHeight: 1.7,
          }}>
            <strong>Pomembno:</strong> Vsi izdelki SloPeps so namenjeni izključno za in-vitro raziskave in laboratorijsko uporabo. Niso namenjeni za človeško ali živalsko porabo. Z nakupom potrjujete, da ste to razumeli in da boste izdelke uporabili skladno s tem namenom.
          </div>

          <Section title="1. Splošne določbe">
            <p>Ti pogoji poslovanja urejajo razmerje med podjetjem SloPeps (v nadaljevanju &quot;prodajalec&quot;) in kupcem pri nakupu prek spletne strani slopeps.si oziroma naše spletne trgovine.</p>
            <p>Z oddajo naročila kupec potrjuje, da je prebral, razumel in sprejel te pogoje poslovanja.</p>
          </Section>

          <Section title="2. Namenska uporaba izdelkov">
            <p>Vsi peptidi in drugi izdelki v naši ponudbi so namenjeni izključno za:</p>
            <ul>
              <li>In-vitro laboratorijske raziskave</li>
              <li>Analitske namene</li>
              <li>Izobraževalne in znanstvene namene</li>
            </ul>
            <p><strong>Strogo je prepovedana</strong> uporaba naših izdelkov za človeško ali živalsko porabo, terapevtske namene ali katerikoli namen zunaj laboratorijskega okolja. Kupec prevzema polno odgovornost za pravilno in zakonito uporabo kupljenih izdelkov.</p>
          </Section>

          <Section title="3. Naročila in cene">
            <p>Vse cene so izražene v evrih (€) in vključujejo davek, kjer je to primerno. SloPeps si pridržuje pravico do spremembe cen brez predhodnega obvestila. Cena, veljavna ob oddaji naročila, je dokončna.</p>
            <p>Naročilo je potrjeno, ko prejmete e-poštno potrditev s strani SloPeps.</p>
          </Section>

          <Section title="4. Plačilo">
            <p>Sprejemamo plačila prek naslednjih metod:</p>
            <ul>
              <li>Kreditne in debetne kartice (Visa, Mastercard, Amex) prek Stripe</li>
              <li>WhatsApp naročila (po dogovoru)</li>
            </ul>
            <p>Vsa plačila so varno obdelana. Podatkov o kartici ne shranjujemo.</p>
          </Section>

          <Section title="5. Vračila in povračila">
            <p><strong>Naročila, ki niso bila odposlana:</strong> Odpoved naročila in polno povračilo sta možna v roku 30 dni od oddaje naročila, pod pogojem, da naročilo še ni bilo odposlano. Kontaktirajte nas na <a href="mailto:SloPeps@gmail.com" style={{ color: "#c9a84c" }}>SloPeps@gmail.com</a>.</p>
            <p><strong>Naročila, ki so bila odposlana:</strong> Ko je naročilo enkrat odposlano, povračila žal niso možna. To je posledica narave naših izdelkov (biološki materiali z zahtevami glede shranjevanja), ki ne dovoljuje ponovne prodaje.</p>
            <p><strong>Poškodovane ali napačne pošiljke:</strong> V primeru napake pri pošiljki ali poškodbe med dostavo nas prosimo kontaktirajte v roku 48 ur od prejema s fotografijami poškodb. V tem primeru bomo zagotovili zamenjavo ali povračilo.</p>
          </Section>

          <Section title="6. Dostava">
            <p>Informacije o dostavi so na voljo na naši <a href="/dostava" style={{ color: "#c9a84c" }}>strani o dostavi</a>. SloPeps ni odgovoren za zamude pri dostavi, ki so posledica dejanj prevoznika ali zunanjih okoliščin (carine, višja sila ipd.).</p>
          </Section>

          <Section title="7. Omejitev odgovornosti">
            <p>SloPeps ni odgovoren za kakršnokoli škodo, ki bi nastala z napačno ali nepooblaščeno uporabo naših izdelkov. Kupec je v celoti odgovoren za upoštevanje vseh veljavnih zakonov in predpisov v svoji jurisdikciji glede nakupa, posedovanja in uporabe naših izdelkov.</p>
          </Section>

          <Section title="8. Varstvo osebnih podatkov">
            <p>Obdelava osebnih podatkov poteka skladno z našo <a href="/zasebnost" style={{ color: "#c9a84c" }}>Politiko zasebnosti</a>.</p>
          </Section>

          <Section title="9. Reševanje sporov">
            <p>Morebitne spore bomo skušali rešiti sporazumno. V primeru spora je pristojno sodišče v Republiki Sloveniji. Za izvensodno reševanje potrošniških sporov se obrnite na pristojni organ v vaši državi.</p>
          </Section>

          <Section title="10. Spremembe pogojev">
            <p>SloPeps si pridržuje pravico do spremembe teh pogojev poslovanja. Veljavni pogoji so vedno objavljeni na tej strani. Zadnja posodobitev: april 2026.</p>
          </Section>

        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "17px", fontWeight: 800,
        color: "#111", marginBottom: "14px",
        paddingBottom: "10px",
        borderBottom: "1px solid #f0f0f0",
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: "var(--font-opensans)",
        fontSize: "15px", lineHeight: 1.8,
        color: "#444",
      }}>
        {children}
      </div>
    </div>
  );
}
