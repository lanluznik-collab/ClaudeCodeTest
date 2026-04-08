import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "hero_image")
    .single();

  return NextResponse.json({ value: data?.value ?? "" });
}

export async function PUT(req: NextRequest) {
  const { value } = await req.json();
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("settings")
    .upsert({ key: "hero_image", value }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
