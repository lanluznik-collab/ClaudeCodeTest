import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Public-facing lookup for the order confirmation page. order_ref acts as
// the access token here, so only non-PII fields are selected — customer
// name/email/phone/address are deliberately left out.
export async function GET(
  _req: NextRequest,
  { params }: { params: { order_ref: string } }
) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "order_ref, items, subtotal, shipping_cost, discount_code, discount_amount, cod_surcharge, total, payment_method, language, predracun_number, status, created_at"
    )
    .eq("order_ref", params.order_ref)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
