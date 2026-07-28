import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { BlogPost } from "@/types";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, intro")
    .eq("slug", params.slug)
    .single();
  if (!data) return { title: "Objava ni najdena" };
  return { title: data.title?.slo, description: data.intro?.slo ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("id,slug,tag,tag_icon,published_at,read_minutes,cover_image,title,intro,body,cta_product,author")
    .eq("slug", params.slug)
    .single();

  if (!post) notFound();

  return <BlogPostClient post={post as BlogPost} />;
}
