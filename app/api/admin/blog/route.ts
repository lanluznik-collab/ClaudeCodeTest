import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  let slug = slugify(body.title);
  const { data: existing } = await supabase.from("blog_posts").select("slug").eq("slug", slug);
  if (existing && existing.length > 0) slug = `${slug}-${Date.now()}`;

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...body, slug })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/blog");
  return NextResponse.json(data, { status: 201 });
}
