import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { BlogPost } from "@/types";

const MONTHS_SLO = [
  "januar", "februar", "marec", "april", "maj", "junij",
  "julij", "avgust", "september", "oktober", "november", "december",
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getUTCDate()}. ${MONTHS_SLO[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const SIDEBAR_TAGS = [
  { icon: "ri-first-aid-kit-line", label: "Regeneracija" },
  { icon: "ri-leaf-line", label: "Dolgoživost" },
  { icon: "ri-brain-line", label: "Kognicija" },
  { icon: "ri-run-line", label: "Mišice" },
  { icon: "ri-moon-line", label: "Spanje" },
] as const;

interface Props { posts: BlogPost[]; }

export default function BlogClient({ posts }: Props) {
  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumbItems={[
          { label: "DOMOV", href: "/" },
          { label: "BLOG" },
        ]}
        title="Novosti in raziskave"
        subtitle="Pregled aktualnih ugotovitev s področja raziskav peptidov. Vsi članki so namenjeni izključno izobraževalnim namenom."
      />

      {/* Main layout */}
      <section style={{ background: "var(--gray-50)" }} className="pt-16 pb-8 md:pb-20">
        <div className="container">
          <div className="blog-grid">

            {/* ── LEFT: articles ───────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              {posts.length === 0 && (
                <p style={{ color: "var(--gray-400)", fontStyle: "italic" }}>
                  Ni objavljenih člankov.
                </p>
              )}
              {posts.map((post) => (
                <article key={post.id} className="blog-card">
                  {/* Image area */}
                  <div style={{
                    position: "relative", height: "260px", overflow: "hidden",
                    background: "linear-gradient(135deg, var(--gray-900), #1a2640)",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image ?? ""}
                      alt=""
                      className="blog-card-img"
                    />

                    {/* Tag pill top-left */}
                    {post.tag && (
                      <div style={{
                        position: "absolute", top: 16, left: 16,
                        background: "rgba(201,168,76,.9)",
                        backdropFilter: "blur(6px)",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "100px",
                        fontSize: "12px",
                        fontWeight: 700,
                        display: "inline-flex",
                        gap: "6px",
                        alignItems: "center",
                      }}>
                        {post.tag_icon && <i className={post.tag_icon} />}
                        {post.tag}
                      </div>
                    )}

                    {/* Meta pills bottom-left */}
                    <div style={{
                      position: "absolute", bottom: 16, left: 16,
                      display: "flex", gap: "12px", flexWrap: "wrap",
                    }}>
                      {[
                        { icon: "ri-calendar-line", text: formatDate(post.published_at) },
                        post.read_minutes !== null && {
                          icon: "ri-time-line",
                          text: `${post.read_minutes} min branja`,
                        },
                        post.author && { icon: "ri-user-line", text: post.author },
                      ].filter(Boolean).map((pill, i) => {
                        if (!pill || typeof pill === "boolean") return null;
                        return (
                          <span key={i} style={{
                            background: "rgba(0,0,0,.5)",
                            backdropFilter: "blur(6px)",
                            color: "rgba(255,255,255,.85)",
                            padding: "4px 10px",
                            borderRadius: "100px",
                            fontSize: "12px",
                            fontWeight: 500,
                            display: "inline-flex",
                            gap: "5px",
                            alignItems: "center",
                          }}>
                            <i className={pill.icon} style={{ fontSize: "13px" }} />
                            {pill.text}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "28px 32px 32px" }}>
                    <h2 style={{
                      fontSize: "22px", fontWeight: 800,
                      color: "var(--gray-900)", lineHeight: 1.3,
                      letterSpacing: "-0.3px", marginBottom: "12px",
                    }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {post.title}
                      </Link>
                    </h2>
                    <p style={{
                      fontSize: "15px", color: "var(--gray-500)",
                      lineHeight: 1.75, marginBottom: 0,
                    }}>
                      {post.intro}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="blog-card-footer">
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "10px 20px",
                        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: 700,
                        textDecoration: "none",
                        flexShrink: 0,
                      }}
                    >
                      <i className="ri-book-open-line" />
                      Preberi članek
                    </Link>
                    <p
                      className="blog-card-footer-disc"
                      style={{
                        fontSize: "11px", color: "var(--gray-400)",
                        maxWidth: "360px", lineHeight: 1.5, margin: 0,
                      }}
                    >
                      Za research namene. Ni odobreno za medicinsko uporabo.
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* ── RIGHT: sidebar ───────────────────────────────────────── */}
            <aside className="blog-sidebar">

              {/* Card 1: Categories — only meaningful once there are articles to filter */}
              {posts.length > 0 && (
                <div style={{
                  background: "var(--white)",
                  border: "1px solid var(--gray-200)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px",
                }}>
                  <h3 style={{
                    fontSize: "13px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.8px",
                    color: "var(--gray-500)", marginBottom: "16px",
                  }}>
                    Kategorije
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0" }}>
                    {SIDEBAR_TAGS.map(({ icon, label }) => (
                      <button
                        key={label}
                        className="blog-tag-pill"
                        style={{ margin: "0 6px 8px 0" }}
                      >
                        <i className={icon} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Card 2: Disclaimer */}
              <div style={{
                background: "#e5e7eb",
                border: "1px solid #c9cfe0",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
              }}>
                <h3 style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontSize: "12px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.8px",
                  color: "var(--accent)", marginBottom: "10px",
                }}>
                  <i className="ri-error-warning-line" />
                  Opomba
                </h3>
                <p style={{
                  fontSize: "13px", color: "#6b7280",
                  lineHeight: 1.65, margin: 0,
                }}>
                  Vsi članki na tem blogu so namenjeni izključno izobraževalnim namenom. Peptidi, opisani v člankih, niso odobreni za medicinsko uporabo pri ljudeh ali živalih.
                </p>
              </div>

              {/* Card 3: CTA */}
              <div style={{
                background: "linear-gradient(135deg, var(--gray-900), #1a2640)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                textAlign: "center",
              }}>
                <h3 style={{
                  fontSize: "15px", fontWeight: 700, color: "white",
                  marginBottom: "8px",
                }}>
                  Oglejte si produkte
                </h3>
                <p style={{
                  fontSize: "13px", color: "var(--gray-400)",
                  lineHeight: 1.6, marginBottom: "16px",
                }}>
                  Vsi peptidi, opisani v člankih, so na voljo z laboratorijsko potrjeno čistostjo.
                </p>
                <Link href="/shop" className="blog-sidebar-cta-btn">
                  <i className="ri-store-2-line" />
                  Odpri trgovino
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
