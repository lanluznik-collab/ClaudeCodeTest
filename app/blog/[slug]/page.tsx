import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { BlogPost, Product } from "@/types";
import { MarkdownBody } from "@/components/blog/MarkdownBody";
import { ProductCard } from "@/components/shop/ProductCard";
import { extractH2Headings, splitBodyAtReferences } from "@/lib/markdown";

interface Props {
  params: { slug: string };
}

const MONTHS_SLO = [
  "januar", "februar", "marec", "april", "maj", "junij",
  "julij", "avgust", "september", "oktober", "november", "december",
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getUTCDate()}. ${MONTHS_SLO[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const POST_COLUMNS = "id,slug,tag,tag_icon,published_at,read_minutes,cover_image,title,intro,body,cta_product,author";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, intro")
    .eq("slug", params.slug)
    .single();
  if (!data) return { title: "Objava ni najdena" };
  return { title: data.title, description: data.intro ?? undefined };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createServerClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select(POST_COLUMNS)
    .eq("slug", params.slug)
    .single();

  if (!post) notFound();
  const typedPost = post as BlogPost;

  const [{ data: allPostsRaw }, { data: taggedProducts }, { data: newestProducts }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("id,slug,title,published_at")
      .order("published_at", { ascending: false }),
    typedPost.tag
      ? supabase.from("products").select("*").ilike("category", typedPost.tag).limit(4)
      : Promise.resolve({ data: [] as Product[] }),
    supabase.from("products").select("*").order("created_at", { ascending: false }).limit(4),
  ]);

  const relatedProducts: Product[] = taggedProducts && taggedProducts.length > 0 ? taggedProducts : (newestProducts ?? []);

  const allPosts = allPostsRaw ?? [];
  const currentIndex = allPosts.findIndex((p) => p.slug === typedPost.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const allHeadings = extractH2Headings(typedPost.body);
  const { main, references } = splitBodyAtReferences(typedPost.body);
  const mainH2Count = (main.match(/^##\s+/gm) ?? []).length;
  const mainHeadingIds = allHeadings.slice(0, mainH2Count).map((h) => h.id);
  const referencesHeadingIds = allHeadings.slice(mainH2Count).map((h) => h.id);

  return (
    <div style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)", minHeight: "70vh" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="mx-auto px-4 md:px-8 py-3" style={{ maxWidth: "1200px" }}>
          <p style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "var(--color-text-muted)", margin: 0 }}>
            <Link href="/" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Domov</Link>
            <span style={{ margin: "0 8px", color: "var(--color-text-faint)" }}>/</span>
            <Link href="/blog" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Blog</Link>
            <span style={{ margin: "0 8px", color: "var(--color-text-faint)" }}>/</span>
            <span style={{ color: "var(--color-text)" }}>{typedPost.title}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1200px", padding: "64px 16px 96px" }}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: "800px", margin: "0 auto 48px" }}>
          {typedPost.tag && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "var(--color-accent-wash)", color: "var(--color-accent-text)",
              padding: "5px 14px", borderRadius: "100px",
              fontSize: "11px", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.08em", marginBottom: "18px",
            }}>
              {typedPost.tag_icon && <i className={typedPost.tag_icon} />}
              {typedPost.tag}
            </div>
          )}

          <p style={{
            fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.18em", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "16px",
          }}>
            {formatDate(typedPost.published_at)}
            {typedPost.read_minutes ? ` · ${typedPost.read_minutes} min branja` : ""}
            {typedPost.author ? ` · ${typedPost.author}` : ""}
          </p>

          <h1 style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900,
            color: "var(--color-text)", lineHeight: 1.2, margin: "0 0 32px 0",
          }}>
            {typedPost.title}
          </h1>

          {typedPost.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typedPost.cover_image}
              alt={typedPost.title}
              style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--color-border)" }}
            />
          )}
        </div>

        {/* ── Article + TOC ────────────────────────────────────────────── */}
        {allHeadings.length > 0 ? (
          <div className="blog-article-grid" style={{ maxWidth: "1080px", margin: "0 auto" }}>
            <div style={{ maxWidth: "800px" }}>
              {typedPost.intro && (
                <p style={{
                  fontFamily: "var(--font-opensans)", fontSize: "18px", lineHeight: 1.7,
                  color: "var(--color-text-muted)", fontStyle: "italic",
                  borderLeft: "3px solid var(--color-accent-text)", paddingLeft: "20px", marginBottom: "40px",
                }}>
                  {typedPost.intro}
                </p>
              )}

              <MarkdownBody content={main} headingIds={mainHeadingIds} />

              {typedPost.cta_product && (
                <ProductCtaBox product={typedPost.cta_product} />
              )}

              {references && <MarkdownBody content={references} headingIds={referencesHeadingIds} />}

              <OpombaBox />
            </div>

            <aside className="blog-toc">
              <p className="blog-toc-title">Na tej strani</p>
              <nav className="blog-toc-list">
                {allHeadings.map((h) => (
                  <a key={h.id} href={`#${h.id}`} className="blog-toc-link">{h.text}</a>
                ))}
              </nav>
            </aside>
          </div>
        ) : (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {typedPost.intro && (
              <p style={{
                fontFamily: "var(--font-opensans)", fontSize: "18px", lineHeight: 1.7,
                color: "var(--color-text-muted)", fontStyle: "italic",
                borderLeft: "3px solid var(--color-accent-text)", paddingLeft: "20px", marginBottom: "40px",
              }}>
                {typedPost.intro}
              </p>
            )}

            <MarkdownBody content={main} headingIds={mainHeadingIds} />

            {typedPost.cta_product && <ProductCtaBox product={typedPost.cta_product} />}

            {references && <MarkdownBody content={references} headingIds={referencesHeadingIds} />}

            <OpombaBox />
          </div>
        )}

        {/* ── Related products ─────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: "72px" }}>
            <h2 style={{
              fontFamily: "var(--font-montserrat)", fontSize: "18px", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text)",
              margin: "0 0 32px 0", paddingBottom: "16px", borderBottom: "1px solid var(--color-border)",
            }}>
              Sorodni produkti
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7">
              {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* ── Prev / next ──────────────────────────────────────────────── */}
        {(prevPost || nextPost) && (
          <div style={{
            marginTop: "64px", paddingTop: "32px", borderTop: "1px solid var(--color-border)",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px",
          }}>
            <div>
              {prevPost && (
                <Link href={`/blog/${prevPost.slug}`} style={{ textDecoration: "none" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                    letterSpacing: "0.1em", color: "var(--color-accent-text)", textTransform: "uppercase", margin: "0 0 6px 0",
                  }}>
                    ← Prejšnji članek
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: 0 }}>{prevPost.title}</p>
                </Link>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} style={{ textDecoration: "none" }}>
                  <p style={{
                    fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700,
                    letterSpacing: "0.1em", color: "var(--color-accent-text)", textTransform: "uppercase", margin: "0 0 6px 0",
                  }}>
                    Naslednji članek →
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-muted)", margin: 0 }}>{nextPost.title}</p>
                </Link>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: "48px" }}>
          <Link href="/blog" style={{
            fontFamily: "var(--font-montserrat)", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.1em", color: "var(--color-accent-text)", textDecoration: "none", textTransform: "uppercase",
          }}>
            ← Blog
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductCtaBox({ product }: { product: string }) {
  return (
    <div style={{
      margin: "8px 0 40px", padding: "24px",
      background: "linear-gradient(135deg, var(--color-brand-deep), var(--color-brand))",
      borderRadius: "8px", textAlign: "center",
    }}>
      <Link
        href="/shop"
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "12px 24px",
          background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))",
          color: "var(--color-on-accent)", borderRadius: "6px",
          fontFamily: "var(--font-montserrat)", fontSize: "13px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.06em", textDecoration: "none",
        }}
      >
        <i className="ri-flask-line" />
        Oglejte si {product}
      </Link>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "12px", marginBottom: 0 }}>
        Za research namene. Ni odobreno za medicinsko uporabo.
      </p>
    </div>
  );
}

function OpombaBox() {
  return (
    <div style={{
      marginTop: "16px", padding: "20px",
      background: "rgba(199,122,10,0.06)",
      border: "1px solid rgba(199,122,10,0.25)",
      borderRadius: "8px",
    }}>
      <h3 style={{
        display: "flex", alignItems: "center", gap: "6px",
        fontSize: "12px", fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.08em",
        color: "var(--color-warning)", margin: "0 0 10px 0",
      }}>
        <i className="ri-error-warning-line" />
        Opomba
      </h3>
      <p style={{ fontSize: "13px", color: "var(--color-text-muted)", lineHeight: 1.65, margin: 0 }}>
        Vsi članki na tem blogu so namenjeni izključno izobraževalnim namenom. Peptidi, opisani v člankih, niso odobreni za medicinsko uporabo pri ljudeh ali živalih.
      </p>
    </div>
  );
}
