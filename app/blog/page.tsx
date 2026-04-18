import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog | SloPeps",
  description: "Novice in članki o peptidih in raziskavah.",
};

export default async function BlogPage() {
  const supabase = createServerClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div style={{ backgroundColor: "#fff", color: "#111", minHeight: "70vh" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#0a0a0a", padding: "72px 24px 56px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.22em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "12px",
          }}>
            SLOPEPS
          </p>
          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "#fff", margin: 0,
          }}>
            Blog
          </h1>
        </div>
      </div>

      {/* Posts */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 24px 96px" }}>
        {!posts || posts.length === 0 ? (
          <p style={{ fontFamily: "var(--font-opensans)", color: "#888", fontStyle: "italic" }}>
            Ni objavljenih člankov.
          </p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "40px",
          }}>
            {(posts as BlogPost[]).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <article style={{
                  border: "1px solid #eee", borderRadius: "10px", overflow: "hidden",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  height: "100%",
                }}>
                  {post.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "200px", backgroundColor: "#0a0a0a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-montserrat)", fontSize: "13px",
                        fontWeight: 800, letterSpacing: "0.15em", color: "#c9a84c",
                      }}>
                        SLOPEPS
                      </span>
                    </div>
                  )}

                  <div style={{ padding: "24px" }}>
                    <p style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "10px", fontWeight: 700,
                      letterSpacing: "0.15em", color: "#c9a84c", textTransform: "uppercase",
                      margin: "0 0 10px 0",
                    }}>
                      {new Date(post.published_at).toLocaleDateString("sl-SI")}
                      {post.reading_time ? ` · ${post.reading_time} min branja` : ""}
                    </p>

                    <h2 style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "19px", fontWeight: 800,
                      color: "#111", margin: "0 0 12px 0", lineHeight: 1.3,
                    }}>
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p style={{
                        fontFamily: "var(--font-opensans)", fontSize: "14px", lineHeight: 1.7,
                        color: "#555", margin: "0 0 18px 0",
                      }}>
                        {post.excerpt}
                      </p>
                    )}

                    <span style={{
                      fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                      letterSpacing: "0.1em", color: "#c9a84c", textTransform: "uppercase",
                    }}>
                      Preberi več →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
