import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServiceClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("blog_posts")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/blog");
  return NextResponse.json({ success: true });
}
