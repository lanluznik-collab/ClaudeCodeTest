import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", params.slug)
    .single();
  if (!data) return { title: "Objava ni najdena" };
  return { title: data.title, description: data.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!post) notFound();

  return (
    <div style={{ backgroundColor: "#fff", color: "#111", minHeight: "70vh" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#f7f7f7", borderBottom: "1px solid #eee" }}>
        <div className="mx-auto px-4 md:px-8 py-3" style={{ maxWidth: "1200px" }}>
          <p style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#999", margin: 0 }}>
            <Link href="/" style={{ color: "#999", textDecoration: "none" }}>Domov</Link>
            <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
            <Link href="/blog" style={{ color: "#999", textDecoration: "none" }}>Blog</Link>
            <span style={{ margin: "0 8px", color: "#ccc" }}>/</span>
            <span style={{ color: "#333" }}>{post.title}</span>
          </p>
        </div>
      </div>

      {/* Article */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 24px 96px" }}>
        {/* Meta */}
        <p style={{
          fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
          letterSpacing: "0.18em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "16px",
        }}>
          {new Date(post.published_at).toLocaleDateString("sl-SI")}
          {post.author ? ` · ${post.author}` : ""}
          {post.reading_time ? ` · ${post.reading_time} min branja` : ""}
        </p>

        <h1 style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900,
          color: "#111", lineHeight: 1.2, margin: "0 0 32px 0",
        }}>
          {post.title}
        </h1>

        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            style={{ width: "100%", borderRadius: "8px", marginBottom: "40px", border: "1px solid #eee" }}
          />
        )}

        {post.excerpt && (
          <p style={{
            fontFamily: "var(--font-opensans)", fontSize: "18px", lineHeight: 1.7,
            color: "#555", fontStyle: "italic",
            borderLeft: "3px solid #c9a84c", paddingLeft: "20px", marginBottom: "40px",
          }}>
            {post.excerpt}
          </p>
        )}

        {post.content && (
          <div style={{
            fontFamily: "var(--font-opensans)", fontSize: "16px",
            lineHeight: 1.9, color: "#333", whiteSpace: "pre-wrap",
          }}>
            {post.content}
          </div>
        )}

        <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid #eee" }}>
          <Link href="/blog" style={{
            fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.1em", color: "#c9a84c", textDecoration: "none", textTransform: "uppercase",
          }}>
            ← Nazaj na blog
          </Link>
        </div>
      </div>
    </div>
  );
}
