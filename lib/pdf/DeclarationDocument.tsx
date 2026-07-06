import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { Order } from "@/types";
import { registerFonts } from "./fonts";

registerFonts();

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSans",
    fontSize: 9,
    padding: 40,
    color: "#1a1a1a",
    lineHeight: 1.4,
  },
  title: { fontSize: 15, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  goldLine: { height: 2, backgroundColor: "#c9a84c", marginBottom: 16, width: 80, alignSelf: "center" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  pending: {
    fontSize: 7,
    color: "#b00",
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  paragraph: { marginBottom: 10 },
  itemBlock: { marginBottom: 8 },
  itemSl: { marginBottom: 1 },
  itemEn: { color: "#555" },
  sigRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 50 },
  sigLine: { borderTopWidth: 1, borderTopColor: "#333", width: 180, paddingTop: 4 },
  sigLabel: { fontSize: 7, color: "#555" },
});

interface DeclarationDocumentProps {
  order: Order;
}

const DECLARATIONS: { sl: string; en: string }[] = [
  {
    sl: "Izdelek(-ki) ni(-so) zdravilo in nima(-jo) namena za diagnosticiranje, zdravljenje, lajšanje ali preprečevanje bolezni.",
    en: "The product(s) is/are not a medicine and is/are not intended to diagnose, treat, cure or prevent any disease.",
  },
  {
    sl: "Izdelek(-ki) ni(-so) namenjen(-i) za uživanje, zaužitje ali kakršno koli uporabo na ljudeh ali živalih.",
    en: "The product(s) is/are not intended for consumption, ingestion, or any use on humans or animals.",
  },
  {
    sl: "Izdelek(-ki) ni(-so) kozmetični izdelek in ni(-so) namenjen(-i) za nanos na kožo ali sluznico.",
    en: "The product(s) is/are not a cosmetic product and is/are not intended for application to skin or mucous membranes.",
  },
  {
    sl: "Izdelek(-ki) ni(-so) namenjen(-i) za uporabo v športu in kupec razume, da lahko uporaba pomeni kršitev pravil o dopingu.",
    en: "The product(s) is/are not intended for use in sport, and the buyer understands that use may constitute a doping violation.",
  },
  {
    sl: "Kupec kupuje izdelek(-ke) izključno v raziskovalne namene (Research Use Only) s strani usposobljenega osebja v ustreznem okolju.",
    en: "The buyer purchases the product(s) exclusively for research use only (RUO), by qualified personnel in an appropriate setting.",
  },
  {
    sl: "Kupec razume, da so vse informacije o izdelku(-ih) namenjene izključno informativnim in raziskovalnim namenom.",
    en: "The buyer understands that all information about the product(s) is provided for informational and research purposes only.",
  },
];

export function DeclarationDocument({ order }: DeclarationDocumentProps) {
  const orderDate = new Date(order.created_at).toLocaleDateString("sl-SI");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>IZJAVA KUPCA / DECLARATION OF THE BUYER</Text>
        <View style={styles.goldLine} />

        <View style={styles.metaRow}>
          <Text>Naročilo št. / Order no.: {order.order_ref}</Text>
          <Text>Datum / Date: {orderDate}</Text>
        </View>

        <Text style={styles.pending}>[BESEDILO V PRIPRAVI / LEGAL TEXT PENDING]</Text>

        <View style={styles.paragraph}>
          <Text style={styles.itemSl}>
            Spodaj podpisani kupec ({order.customer_name}) s podpisom te izjave potrjuje in izjavlja
            naslednje glede izdelka(-ov), naročenega(-ih) v zgoraj navedenem naročilu: [UVODNO BESEDILO V
            PRIPRAVI]
          </Text>
          <Text style={styles.itemEn}>
            The undersigned buyer ({order.customer_name}), by signing this declaration, confirms and states
            the following regarding the product(s) ordered under the above order: [INTRODUCTORY TEXT
            PENDING]
          </Text>
        </View>

        {DECLARATIONS.map((d, i) => (
          <View style={styles.itemBlock} key={i}>
            <Text style={styles.itemSl}>
              {i + 1}. {d.sl}
            </Text>
            <Text style={styles.itemEn}>
              {i + 1}. {d.en}
            </Text>
          </View>
        ))}

        <View style={styles.paragraph}>
          <Text style={styles.itemSl}>
            Kupec izjavlja, da je seznanjen z veljavno slovensko in evropsko zakonodajo, ki ureja promet z
            zgoraj navedenimi izdelki, ter da prevzema polno odgovornost za zakonito uporabo izdelka(-ov).
            [BESEDILO O SEZNANJENOSTI Z ZAKONODAJO V PRIPRAVI]
          </Text>
          <Text style={styles.itemEn}>
            The buyer declares to be aware of the applicable Slovenian and European legislation governing
            the trade of the above-listed products, and accepts full responsibility for the lawful use of
            the product(s). [LEGISLATION-AWARENESS TEXT PENDING]
          </Text>
        </View>

        <View style={styles.sigRow}>
          <View style={styles.sigLine}>
            <Text style={styles.sigLabel}>Kraj in datum / Place and date</Text>
          </View>
          <View style={styles.sigLine}>
            <Text style={styles.sigLabel}>Podpis kupca / Buyer&apos;s signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
