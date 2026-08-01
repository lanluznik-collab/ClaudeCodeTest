import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { Order } from "@/types";
import { COMPANY } from "@/lib/config/company";
import { getTieredUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { registerFonts } from "./fonts";

registerFonts();

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSans",
    fontSize: 9,
    padding: 36,
    color: "#14201F",
  },
  row: { flexDirection: "row" },
  spaceBetween: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 20, fontWeight: "bold", color: "#062A2B", marginBottom: 2 },
  goldLine: { height: 2, backgroundColor: "#14B8A6", marginBottom: 16, width: 60 },
  sectionLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#0F766E",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  block: { marginBottom: 14 },
  bold: { fontWeight: "bold" },
  small: { fontSize: 8, color: "#5B6B6A" },
  table: { marginTop: 6, marginBottom: 10 },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#062A2B",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2ECEA",
  },
  colName: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right" },
  totalsBlock: { marginTop: 4, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", width: 220, justifyContent: "space-between", marginBottom: 3 },
  grandTotalRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#062A2B",
  },
  vatNote: { fontSize: 8, color: "#5B6B6A", marginTop: 10, marginBottom: 10 },
  qrSection: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  qrCaption: { fontSize: 8, marginLeft: 10, maxWidth: 200 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 7,
    color: "#5B6B6A",
    borderTopWidth: 0.5,
    borderTopColor: "#E2ECEA",
    paddingTop: 6,
  },
});

interface PredracunDocumentProps {
  order: Order;
  predracunNumber: string;
  issueDate: Date;
  dueDate: Date;
  qrPngBuffer: Buffer;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("sl-SI");
}

export function PredracunDocument({
  order,
  predracunNumber,
  issueDate,
  dueDate,
  qrPngBuffer,
}: PredracunDocumentProps) {
  const addressLines = (order.customer_address ?? "").split("\n").filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.spaceBetween}>
          <View>
            <Text style={styles.title}>PREDRAČUN</Text>
            <View style={styles.goldLine} />
            <Text>Št. {predracunNumber}</Text>
            <Text>Referenca: SI99</Text>
            <Text>Datum izdaje: {formatDate(issueDate)}</Text>
            <Text>Rok plačila: {formatDate(dueDate)}</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={styles.bold}>{COMPANY.legalName}</Text>
            <Text>{COMPANY.address}</Text>
            <Text>{COMPANY.postalCity}</Text>
            <Text>{COMPANY.country}</Text>
            <Text style={styles.small}>Matična št.: {COMPANY.maticnaSt}</Text>
            <Text style={styles.small}>Davčna št.: {COMPANY.davcnaSt}</Text>
            <Text style={styles.small}>TRR/IBAN: {COMPANY.iban}</Text>
            <Text style={styles.small}>BIC/SWIFT: {COMPANY.bic}</Text>
          </View>
        </View>

        <View style={[styles.block, { marginTop: 20 }]}>
          <Text style={styles.sectionLabel}>Kupec</Text>
          <Text style={styles.bold}>{order.customer_name}</Text>
          {order.company_name ? <Text>{order.company_name}</Text> : null}
          {addressLines.map((line, i) => (
            <Text key={i}>{line}</Text>
          ))}
          {order.vat_id ? <Text style={styles.small}>ID za DDV: {order.vat_id}</Text> : null}
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colName}>Izdelek</Text>
            <Text style={styles.colQty}>Kol.</Text>
            <Text style={styles.colPrice}>Cena/kos</Text>
            <Text style={styles.colTotal}>Skupaj</Text>
          </View>
          {order.items.map((item, i) => {
            const unitPrice = getTieredUnitPrice(item.price, item.quantity);
            const lineTotal = unitPrice * item.quantity;
            return (
              <View style={styles.tableRow} key={i}>
                <Text style={styles.colName}>{item.name}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colPrice}>{formatPrice(unitPrice)}</Text>
                <Text style={styles.colTotal}>{formatPrice(lineTotal)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text>Vmesni seštevek</Text>
            <Text>{formatPrice(order.subtotal ?? 0)}</Text>
          </View>
          {order.discount_amount > 0 && (
            <View style={styles.totalsRow}>
              <Text>Popust {order.discount_code ? `(${order.discount_code})` : ""}</Text>
              <Text>−{formatPrice(order.discount_amount)}</Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text>Dostava</Text>
            <Text>{(order.shipping_cost ?? 0) === 0 ? "Brezplačno" : formatPrice(order.shipping_cost ?? 0)}</Text>
          </View>
          {order.cod_surcharge > 0 && (
            <View style={styles.totalsRow}>
              <Text>Doplačilo po povzetju</Text>
              <Text>{formatPrice(order.cod_surcharge)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.bold}>Za plačilo EUR</Text>
            <Text style={styles.bold}>{formatPrice(order.total)}</Text>
          </View>
        </View>

        <Text style={styles.vatNote}>
          Ni davčni zavezanec za DDV (1. odstavek 94. člena ZDDV-1).
        </Text>

        <View style={styles.qrSection}>
          <Image src={{ data: qrPngBuffer, format: "png" }} style={{ width: 110, height: 110 }} />
          <View style={styles.qrCaption}>
            <Text style={styles.bold}>Slikaj in plačaj:</Text>
            <Text style={{ marginTop: 4 }}>
              Odprite bančno aplikacijo, izberite skeniranje UPN QR kode in poslikajte kodo za samodejno
              izpolnjen nalog za plačilo.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>
            {COMPANY.legalName} · {COMPANY.address}, {COMPANY.postalCity} · Matična št.: {COMPANY.maticnaSt} ·
            Davčna št.: {COMPANY.davcnaSt} · {COMPANY.contactEmail}
          </Text>
          <Text style={{ marginTop: 2 }}>
            Izdelki so namenjeni izključno za raziskovalne namene (RUO) — niso zdravilo, prehransko dopolnilo
            ali kozmetični izdelek in niso namenjeni za uživanje ali uporabo na ljudeh ali živalih.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
