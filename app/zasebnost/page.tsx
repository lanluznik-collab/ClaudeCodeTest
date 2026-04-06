const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 2L58 18V50L30 66L2 50V18Z' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M30 68L58 84V104' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3Cpath d='M2 84L30 68' fill='none' stroke='rgba(201%2C168%2C76%2C0.07)' stroke-width='1'/%3E%3C/svg%3E")`;

export default function ZasebnostPage() {
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
            Politika zasebnosti
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

          <Section title="1. Upravljavec podatkov">
            <p>Upravljavec osebnih podatkov je podjetje SloPeps (v nadaljevanju &quot;mi&quot; ali &quot;SloPeps&quot;). Za vsa vprašanja v zvezi z zasebnostjo nas kontaktirajte na: <a href="mailto:SloPeps@gmail.com" style={{ color: "#c9a84c" }}>SloPeps@gmail.com</a>.</p>
          </Section>

          <Section title="2. Katere podatke zbiramo">
            <p>Ko obiščete našo spletno stran ali oddate naročilo, lahko zbiramo naslednje podatke:</p>
            <ul>
              <li>Ime in priimek</li>
              <li>E-poštni naslov</li>
              <li>Naslov za dostavo</li>
              <li>Podatki o plačilu (obdelani varno prek Stripe — mi ne shranjujemo podatkov o kartici)</li>
              <li>Podatki o naročilu (izdelki, količine, znesek)</li>
              <li>Tehnični podatki (IP naslov, vrsta brskalnika, čas obiska)</li>
            </ul>
          </Section>

          <Section title="3. Namen obdelave podatkov">
            <p>Vaše podatke obdelujemo za naslednje namene:</p>
            <ul>
              <li>Obdelava in dostava vaših naročil</li>
              <li>Komunikacija v zvezi z naročilom</li>
              <li>Odgovarjanje na vaša vprašanja in povpraševanja</li>
              <li>Izpolnjevanje zakonskih obveznosti</li>
              <li>Izboljšanje naše spletne strani in storitev</li>
            </ul>
          </Section>

          <Section title="4. Pravna podlaga za obdelavo">
            <p>Vaše podatke obdelujemo na osnovi:</p>
            <ul>
              <li><strong>Pogodbe</strong> — kadar je obdelava potrebna za izvedbo naročila</li>
              <li><strong>Zakonitega interesa</strong> — za izboljšanje naših storitev in preprečevanje goljufij</li>
              <li><strong>Zakonske obveznosti</strong> — kadar to zahteva zakon</li>
            </ul>
          </Section>

          <Section title="5. Deljenje podatkov s tretjimi stranmi">
            <p>Vaših podatkov ne prodajamo tretjim osebam. Podatke delimo le z naslednjimi ponudniki storitev, ki so nujni za delovanje naše spletne strani:</p>
            <ul>
              <li><strong>Stripe</strong> — za varno obdelavo plačil</li>
              <li><strong>Supabase</strong> — za shranjevanje podatkov</li>
              <li><strong>Dostavna podjetja</strong> — za dostavo naročil</li>
            </ul>
            <p>Vsi partnerji so zavezani k varstvu vaših podatkov v skladu z veljavno zakonodajo.</p>
          </Section>

          <Section title="6. Hramba podatkov">
            <p>Vaše podatke hranimo toliko časa, kolikor je potrebno za izpolnitev namena zbiranja, oziroma kolikor je zahtevano z veljavno zakonodajo. Podatki o naročilih se hranijo najmanj 5 let za davčne namene.</p>
          </Section>

          <Section title="7. Vaše pravice">
            <p>V skladu z GDPR imate naslednje pravice:</p>
            <ul>
              <li>Pravica do dostopa do vaših osebnih podatkov</li>
              <li>Pravica do popravka nepravilnih podatkov</li>
              <li>Pravica do izbrisa podatkov (&quot;pravica do pozabe&quot;)</li>
              <li>Pravica do omejitve obdelave</li>
              <li>Pravica do prenosljivosti podatkov</li>
              <li>Pravica do ugovora obdelavi</li>
            </ul>
            <p>Za uveljavljanje svojih pravic nas kontaktirajte na <a href="mailto:SloPeps@gmail.com" style={{ color: "#c9a84c" }}>SloPeps@gmail.com</a>.</p>
          </Section>

          <Section title="8. Piškotki">
            <p>Naša spletna stran uporablja tehnične piškotke, potrebne za delovanje (npr. košarica). Ne uporabljamo sledilnih piškotkov tretjih oseb v oglaševalske namene.</p>
          </Section>

          <Section title="9. Varnost podatkov">
            <p>Uporabljamo ustrezne tehnične in organizacijske ukrepe za zaščito vaših osebnih podatkov pred nepooblaščenim dostopom, izgubo ali uničenjem. Vsa plačilna komunikacija je šifrirana.</p>
          </Section>

          <Section title="10. Spremembe politike zasebnosti">
            <p>Politiko zasebnosti lahko občasno posodobimo. O morebitnih pomembnih spremembah vas bomo obvestili prek e-pošte ali z obvestilom na spletni strani. Zadnja posodobitev: april 2026.</p>
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
