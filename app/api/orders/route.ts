import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { CartItem } from "@/types";

// NOTE: The orders table requires a customer_address TEXT column.
// Run this migration if it doesn't exist yet:
//   ALTER TABLE orders ADD COLUMN customer_address TEXT;

export async function POST(req: NextRequest) {
  try {
    const {
      items,
      total,
      customer_name,
      customer_email,
      customer_address,
      order_ref,
    }: {
      items: CartItem[];
      total: number;
      customer_name: string;
      customer_email: string;
      customer_address: string;
      order_ref: string;
    } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Košarica je prazna" }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error } = await supabase.from("orders").insert({
      stripe_session_id: order_ref,
      items,
      total,
      customer_name,
      customer_email,
      customer_address,
      payment_method: "bank",
      status: "pending_payment",
    });

    if (error) {
      console.error("[orders] insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ order_ref });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[orders] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
