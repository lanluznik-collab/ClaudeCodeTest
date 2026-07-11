import { Resend } from "resend";
import { Order } from "@/types";
import { COMPANY } from "@/lib/config/company";
import { OrderConfirmationEmail } from "./OrderConfirmationEmail";

interface Attachment {
  filename: string;
  content: Buffer;
}

interface SendOrderConfirmationParams {
  order: Order;
  predracunPdf?: Buffer;
  declarationPdf: Buffer;
}

const copySubject = {
  sl: (ref: string) => `Naročilo ${ref} je potrjeno — SloPeps`,
  en: (ref: string) => `Order ${ref} confirmed — SloPeps`,
};

// Server-only: uses RESEND_API_KEY. Never import this from client components.
export async function sendOrderConfirmation({
  order,
  predracunPdf,
  declarationPdf,
}: SendOrderConfirmationParams): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const lang = order.language === "en" ? "en" : "sl";

  const attachments: Attachment[] = [{ filename: "izjava-kupca.pdf", content: declarationPdf }];
  if (predracunPdf) {
    attachments.unshift({ filename: "predracun.pdf", content: predracunPdf });
  }

  const { error } = await resend.emails.send({
    from: COMPANY.senderEmail,
    to: order.customer_email ?? "",
    bcc: COMPANY.adminEmail,
    subject: copySubject[lang](order.order_ref ?? ""),
    react: OrderConfirmationEmail({ order, lang }),
    attachments,
  });

  if (error) {
    throw new Error(typeof error === "string" ? error : error.message);
  }
}
