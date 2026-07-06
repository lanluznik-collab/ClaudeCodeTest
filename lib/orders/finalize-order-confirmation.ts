import { SupabaseClient } from "@supabase/supabase-js";
import { Order } from "@/types";
import { generatePredracunPdf, generateDeclarationPdf } from "@/lib/pdf/generate";
import { sendOrderConfirmation } from "@/lib/email/send-order-confirmation";

// Generates the PDFs, uploads them to private storage, sends the
// confirmation email, and records the results on the order row. Called
// synchronously from the order route (after the order response would
// otherwise be sent) — Vercel serverless functions don't guarantee
// unawaited work continues after the handler returns, so this must complete
// before the API route responds.
//
// Deliberately swallows its own errors: a failure here must never turn a
// successful order into a failed API response — the order already exists.
export async function finalizeOrderConfirmation(supabase: SupabaseClient, order: Order): Promise<void> {
  try {
    let predracunNumber: string | null = null;
    let predracunPdf: Buffer | undefined;

    if (order.payment_method === "bank_transfer") {
      const year = new Date(order.created_at).getFullYear();
      const { data: seq, error: seqError } = await supabase.rpc("allocate_predracun_number", {
        p_year: year,
      });
      if (seqError) throw new Error(`predracun numbering failed: ${seqError.message}`);

      predracunNumber = `${year}-${seq}`;
      predracunPdf = await generatePredracunPdf(order, predracunNumber);
    }

    const declarationPdf = await generateDeclarationPdf(order);

    const predracunPath = predracunNumber ? `${order.id}/predracun.pdf` : null;
    const declarationPath = `${order.id}/declaration.pdf`;

    if (predracunPdf && predracunPath) {
      const { error: uploadError } = await supabase.storage
        .from("order-documents")
        .upload(predracunPath, predracunPdf, { contentType: "application/pdf", upsert: true });
      if (uploadError) throw new Error(`predracun upload failed: ${uploadError.message}`);
    }

    const { error: declUploadError } = await supabase.storage
      .from("order-documents")
      .upload(declarationPath, declarationPdf, { contentType: "application/pdf", upsert: true });
    if (declUploadError) throw new Error(`declaration upload failed: ${declUploadError.message}`);

    await sendOrderConfirmation({ order, predracunPdf, declarationPdf });

    await supabase
      .from("orders")
      .update({
        predracun_number: predracunNumber,
        predracun_pdf_path: predracunPath,
        declaration_pdf_path: declarationPath,
        confirmation_sent_at: new Date().toISOString(),
      })
      .eq("id", order.id);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[orders] confirmation email failed:", order.order_ref, message);
    await supabase.from("orders").update({ confirmation_email_error: message }).eq("id", order.id);
  }
}
