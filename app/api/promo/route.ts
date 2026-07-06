import { NextRequest, NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (typeof code !== "string" || typeof subtotal !== "number") {
      return NextResponse.json({ valid: false, reason: "not_found" }, { status: 400 });
    }

    const result = await validatePromoCode(code, subtotal);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[promo] error:", message);
    return NextResponse.json({ valid: false, reason: "not_found" }, { status: 500 });
  }
}
