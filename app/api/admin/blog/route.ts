import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";

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

  // slug is left as-is (including blank) — the blog_posts_set_slug trigger
  // generates it from title when empty and guarantees uniqueness.
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  return NextResponse.json(data, { status: 201 });
}
