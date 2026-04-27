export interface FaqItem {
  id: string;
  q: { slo: string; eng: string };
  a: { slo: string; eng: string };
}

export interface FaqCategory {
  id: string;
  icon: string;
  labelKey: string;
  items: FaqItem[];
}

export const faqData: FaqCategory[] = [
  {
    id: "orders",
    icon: "ri-shopping-cart-line",
    labelKey: "faqCatOrders",
    items: [
      {
        id: "orders-1",
        q: {
          slo: "Kako oddam naročilo?",
          eng: "How do I place an order?",
        },
        a: {
          slo: "Naročilo oddate preko spletne trgovine – dodajte izdelke v košarico, kliknite Zaključi nakup in sledite navodilom. Po uspešnem plačilu prejmete potrditveni e-mail.",
          eng: "Place your order through the online shop – add items to the cart, click Checkout and follow the instructions. After successful payment you will receive a confirmation email.",
        },
      },
      {
        id: "orders-2",
        q: {
          slo: "Katere plačilne metode sprejemate?",
          eng: "What payment methods do you accept?",
        },
        a: {
          slo: "Sprejemamo plačila z bančno kartico (Visa, Mastercard) prek varnega Stripe prehoda ter bančno nakazilo (SEPA). Plačilo z gotovino ni mogoče.",
          eng: "We accept card payments (Visa, Mastercard) via the secure Stripe gateway and bank transfer (SEPA). Cash payment is not available.",
        },
      },
      {
        id: "orders-3",
        q: {
          slo: "Ali lahko naročilo po oddaji spremenimo ali prekličemo?",
          eng: "Can I modify or cancel my order after placing it?",
        },
        a: {
          slo: "Naročilo je mogoče preklicati ali spremeniti, dokler ni odposlano. Pišite nam čim prej na e-mail ali WhatsApp. Po odpošiljanju vračilo uredimo v skladu z našo politiko vračil.",
          eng: "An order can be cancelled or modified before it is dispatched. Please contact us as soon as possible by email or WhatsApp. After dispatch, returns are handled according to our returns policy.",
        },
      },
      {
        id: "orders-4",
        q: {
          slo: "Kje je moje naročilo?",
          eng: "Where is my order?",
        },
        a: {
          slo: "Po odpošiljanju prejmete e-mail s sledilno številko. Sledenje je mogoče na spletni strani dostavne službe. Standardni rok dostave je 1–3 delovne dni znotraj Slovenije.",
          eng: "Once dispatched, you will receive an email with your tracking number. You can track your parcel on the courier's website. Standard delivery within Slovenia takes 1–3 business days.",
        },
      },
      {
        id: "orders-5",
        q: {
          slo: "Ali izdajate račune?",
          eng: "Do you issue invoices?",
        },
        a: {
          slo: "Da. Račun je priložen vsakemu naročilu. Če potrebujete račun na podjetje, pri naročilu navedite davčno številko in ime podjetja v polju za opombo.",
          eng: "Yes. An invoice is included with every order. If you need a company invoice, include your VAT number and company name in the order notes field.",
        },
      },
      {
        id: "orders-6",
        q: {
          slo: "Kakšna je politika vračil?",
          eng: "What is your returns policy?",
        },
        a: {
          slo: "Neodprt izdelek vrnete v roku 14 dni od prejema. Stroški vračila so na strani kupca. Po prejemu vračila povrnemo kupnino v 5 delovnih dneh na izvirni plačilni instrument.",
          eng: "You may return an unopened product within 14 days of receipt. Return shipping costs are at the buyer's expense. Once we receive the return, we refund the purchase price within 5 business days to the original payment method.",
        },
      },
    ],
  },
  {
    id: "shipping",
    icon: "ri-truck-line",
    labelKey: "faqCatShipping",
    items: [
      {
        id: "shipping-1",
        q: {
          slo: "Katera področja pokrivate?",
          eng: "Which areas do you ship to?",
        },
        a: {
          slo: "Dostavljamo po celotni Sloveniji. Za dostavo v EU in druge države nas kontaktirajte pred naročilom – pogoji se dogovorijo individualno.",
          eng: "We deliver throughout Slovenia. For EU and international deliveries, please contact us before ordering – terms are arranged individually.",
        },
      },
      {
        id: "shipping-2",
        q: {
          slo: "Koliko stane dostava?",
          eng: "How much does shipping cost?",
        },
        a: {
          slo: "Dostava znotraj Slovenije stane 3,90 €. Pri naročilih nad 80 € je dostava brezplačna.",
          eng: "Delivery within Slovenia costs €3.90. Orders over €80 qualify for free shipping.",
        },
      },
      {
        id: "shipping-3",
        q: {
          slo: "Kdaj bo naročilo odposlano?",
          eng: "When will my order be dispatched?",
        },
        a: {
          slo: "Naročila oddana pred 12:00 so praviloma odposlana isti delovni dan. Naročila po 12:00 odpošljemo naslednji delovni dan.",
          eng: "Orders placed before 12:00 noon are typically dispatched the same business day. Orders placed after 12:00 are dispatched the next business day.",
        },
      },
      {
        id: "shipping-4",
        q: {
          slo: "Kako so peptidi zapakirani?",
          eng: "How are peptides packaged?",
        },
        a: {
          slo: "Vsi peptidi se pošljejo v zaprtem hladilnem pakiranju z gelnim paketom za vzdrževanje temperature med 2–8 °C med prevozom. Embalaža je diskretna in ne razkriva vsebine.",
          eng: "All peptides are shipped in sealed cold packaging with a gel ice pack to maintain temperatures between 2–8 °C during transit. Packaging is discreet and does not reveal the contents.",
        },
      },
      {
        id: "shipping-5",
        q: {
          slo: "Kaj, če paket ni bil vročen?",
          eng: "What if my parcel was not delivered?",
        },
        a: {
          slo: "Dostavna služba pusti obvestilo v nabiralniku in paket hrani 5 delovnih dni na pošti. Če paketa niste prejeli in sledilna številka kaže neuspešno dostavo, nas kontaktirajte.",
          eng: "The courier will leave a notification and hold the parcel at the post office for 5 business days. If you haven't received your parcel and tracking shows a failed delivery, please contact us.",
        },
      },
      {
        id: "shipping-6",
        q: {
          slo: "Ali so peptidi shranjeni v ustreznih pogojih pred odpremo?",
          eng: "Are peptides stored under correct conditions before shipment?",
        },
        a: {
          slo: "Da. Vsi peptidi so shranjeni v nadzorovanih pogojih (2–8 °C) in zaščiteni pred svetlobo. Zaloge redno menjujemo, da zagotovimo svežino.",
          eng: "Yes. All peptides are stored under controlled conditions (2–8 °C) and protected from light. We rotate stock regularly to ensure freshness.",
        },
      },
      {
        id: "shipping-7",
        q: {
          slo: "Kako dolgo traja dostava v tujino?",
          eng: "How long does international delivery take?",
        },
        a: {
          slo: "Dostava v EU običajno traja 3–7 delovnih dni, odvisno od države. Za natančnejše informacije nas kontaktirajte pred naročilom.",
          eng: "Delivery to EU countries typically takes 3–7 business days, depending on the destination. For more precise information, please contact us before ordering.",
        },
      },
    ],
  },
  {
    id: "peptides",
    icon: "ri-flask-line",
    labelKey: "faqCatPeptides",
    items: [
      {
        id: "peptides-1",
        q: {
          slo: "Kaj so peptidi?",
          eng: "What are peptides?",
        },
        a: {
          slo: "Peptidi so kratke verige aminokislin – gradniki beljakovin. V telesu opravljajo signalne funkcije in vplivajo na procese kot so celjenje tkiv, hormonska regulacija in imunski odziv. Peptidi, ki jih prodajamo, so namenjeni izključno za raziskovalne namene.",
          eng: "Peptides are short chains of amino acids – the building blocks of proteins. In the body they perform signalling functions and influence processes such as tissue repair, hormonal regulation and immune response. The peptides we sell are intended exclusively for research purposes.",
        },
      },
      {
        id: "peptides-2",
        q: {
          slo: "Kakšna je čistost vaših peptidov?",
          eng: "What is the purity of your peptides?",
        },
        a: {
          slo: "Vsi naši peptidi imajo čistost ≥ 98 %, potrjeno z HPLC in masno spektrometrijo. Certifikati analize (COA) so dostopni za vsak lot na strani COA Vault.",
          eng: "All our peptides have ≥ 98% purity confirmed by HPLC and mass spectrometry. Certificates of Analysis (COA) are available for every lot on the COA Vault page.",
        },
      },
      {
        id: "peptides-3",
        q: {
          slo: "Kako shranjujem peptide?",
          eng: "How should I store peptides?",
        },
        a: {
          slo: "Liofiliziran (suh) peptid hranite v zamrzovalniku pri −20 °C, zaščiten pred svetlobo. Po rekonstituciji z bakteriostatično vodo ga hranite v hladilniku (2–8 °C) in porabite v 4 tednih.",
          eng: "Store lyophilised (dry) peptide in a freezer at −20 °C, protected from light. Once reconstituted with bacteriostatic water, keep refrigerated (2–8 °C) and use within 4 weeks.",
        },
      },
      {
        id: "peptides-4",
        q: {
          slo: "Za kakšne namene so vaši peptidi?",
          eng: "What are your peptides intended for?",
        },
        a: {
          slo: "Naši peptidi so namenjeni izključno za znanstvenoraziskovalne namene in in vitro eksperimente. Niso namenjeni za humano ali veterinarsko uporabo.",
          eng: "Our peptides are intended exclusively for scientific research purposes and in vitro experiments. They are not intended for human or veterinary use.",
        },
      },
      {
        id: "peptides-5",
        q: {
          slo: "Ali so peptidi regulirani?",
          eng: "Are peptides regulated?",
        },
        a: {
          slo: "Regulatorna ureditev peptidov se razlikuje med državami. V večini EU držav niso registrirani kot zdravila. Za podrobnosti svetujemo posvet z lokalnimi pravnimi predpisi.",
          eng: "Regulation of peptides varies by country. In most EU countries they are not registered as medicinal products. For details we recommend consulting local legislation.",
        },
      },
      {
        id: "peptides-6",
        q: {
          slo: "Kaj pomeni 'liofiliziran' peptid?",
          eng: "What does 'lyophilised' peptide mean?",
        },
        a: {
          slo: "Liofilizacija (freeze-drying) je postopek sušenja pri nizki temperaturi in podtlaku, ki odstranjuje vlago iz peptida brez toplotne degradacije. Rezultat je stabilen prah z dolgo rok uporabnosti.",
          eng: "Lyophilisation (freeze-drying) is a low-temperature, low-pressure drying process that removes moisture from the peptide without thermal degradation. The result is a stable powder with a long shelf life.",
        },
      },
      {
        id: "peptides-7",
        q: {
          slo: "Kaj je COA in kje ga najdem?",
          eng: "What is a COA and where can I find it?",
        },
        a: {
          slo: "COA (Certificate of Analysis – certifikat analize) je dokument neodvisnega laboratorija, ki potrjuje identiteto, čistost in sestavo peptida. COA za vsak lot najdete na strani COA Vault.",
          eng: "A COA (Certificate of Analysis) is an independent laboratory document confirming the identity, purity and composition of a peptide. COAs for every lot are available on the COA Vault page.",
        },
      },
    ],
  },
];
