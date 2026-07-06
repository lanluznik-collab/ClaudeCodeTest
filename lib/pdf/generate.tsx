import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { Order } from "@/types";
import { COMPANY } from "@/lib/config/company";
import { buildUpnQrPayload } from "@/lib/upn-qr";
import { PredracunDocument } from "./PredracunDocument";
import { DeclarationDocument } from "./DeclarationDocument";

export async function generatePredracunPdf(order: Order, predracunNumber: string): Promise<Buffer> {
  const issueDate = new Date(order.created_at);
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + COMPANY.paymentDueDays);

  const qrPayload = buildUpnQrPayload({
    recipientIban: COMPANY.iban,
    recipientName: COMPANY.tradingName,
    recipientStreet: COMPANY.address,
    recipientCity: COMPANY.postalCity,
    amount: order.total,
    purposeCode: "GDDS",
    purposeText: `Predracun ${predracunNumber}, narocilo ${order.order_ref ?? ""}`,
    paymentDeadline: dueDate,
  });

  const qrPngBuffer = await QRCode.toBuffer(qrPayload, {
    errorCorrectionLevel: "M",
    type: "png",
    margin: 4,
  });

  return renderToBuffer(
    <PredracunDocument
      order={order}
      predracunNumber={predracunNumber}
      issueDate={issueDate}
      dueDate={dueDate}
      qrPngBuffer={qrPngBuffer}
    />
  );
}

export async function generateDeclarationPdf(order: Order): Promise<Buffer> {
  return renderToBuffer(<DeclarationDocument order={order} />);
}
