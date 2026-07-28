import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import BlogClient from "./BlogClient";
import { BlogPost } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — SloPeps",
  description: "Research insights and news on peptides. For educational purposes only.",
};

export default async function BlogPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,slug,tag,tag_icon,published_at,read_minutes,cover_image,title,intro,body,cta_product,author")
    .order("published_at", { ascending: false });

  const posts = (data ?? []) as BlogPost[];

  return <BlogClient posts={posts} />;
}
