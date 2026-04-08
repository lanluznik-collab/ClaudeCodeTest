import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("products")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/shop/${data.slug}`);

  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServiceClient();

  const { data: product } = await supabase
    .from("products")
    .select("slug")
    .eq("id", params.id)
    .single();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/shop");
  revalidatePath("/");
  if (product?.slug) revalidatePath(`/shop/${product.slug}`);

  return NextResponse.json({ ok: true });
}
