import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createServiceClient();

    const items = session.metadata?.items
      ? JSON.parse(session.metadata.items)
      : [];

    const total = (session.amount_total ?? 0) / 100;

    await supabase.from("orders").upsert(
      {
        stripe_session_id: session.id,
        items,
        total,
        customer_name: session.customer_details?.name ?? null,
        customer_email: session.customer_details?.email ?? null,
        payment_method: "stripe",
        status: "paid",
      },
      { onConflict: "stripe_session_id" }
    );
  }

  return NextResponse.json({ received: true });
}
