import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const supabase = getAdmin();
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "hero_image")
    .single();

  if (error) {
    console.log("[settings GET] error:", error.message, error.code);
  }

  return NextResponse.json({ value: data?.value ?? "" });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const value: string = body.value ?? "";

  const supabase = getAdmin();

  const { error } = await supabase
    .from("settings")
    .upsert({ key: "hero_image", value });

  if (error) {
    console.log("[settings PUT] error:", error.message, error.code, error.details);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
