"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/types";
import { Upload, X, Pencil, Trash2 } from "lucide-react";

const card: React.CSSProperties = {
  backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "24px",
};
const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #ddd", borderRadius: "6px",
  padding: "8px 12px", fontSize: "14px", color: "#111",
  backgroundColor: "#fff", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 600, color: "#555",
  marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em",
};
const btnPrimary: React.CSSProperties = {
  padding: "9px 20px", backgroundColor: "#111", color: "#fff",
  border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
};
const btnSecondary: React.CSSProperties = {
  padding: "9px 20px", backgroundColor: "#fff", color: "#555",
  border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", cursor: "pointer",
};
const btnDanger: React.CSSProperties = {
  padding: "6px 12px", backgroundColor: "#fff", color: "#e53935",
  border: "1px solid #fca5a5", borderRadius: "6px", fontSize: "12px", cursor: "pointer",
};
const btnEdit: React.CSSProperties = {
  padding: "6px 12px", backgroundColor: "#fff", color: "#333",
  border: "1px solid #ddd", borderRadius: "6px", fontSize: "12px", cursor: "pointer",
};
const thStyle: React.CSSProperties = {
  textAlign: "left", padding: "10px 12px", fontSize: "11px", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.07em", color: "#888",
  borderBottom: "1px solid #eee", backgroundColor: "#fafafa",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", fontSize: "13px", color: "#333",
  borderBottom: "1px solid #f0f0f0", verticalAlign: "middle",
};

type BlogFormState = {
  title: string;
  slug: string;
  tag: string;
  tagIcon: string;
  ctaProduct: string;
  readMinutes: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  intro: string;
  body: string;
};

const emptyForm = (): BlogFormState => ({
  title: "", slug: "", tag: "", tagIcon: "", ctaProduct: "",
  readMinutes: "", coverImage: "", author: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  intro: "", body: "",
});

function CoverImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    } else {
      const err = await res.json().catch(() => ({}));
      setError(`Upload failed: ${err.error ?? "Unknown error"}`);
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      {value ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }} />
          <button
            type="button"
            onClick={() => onChange("")}
            style={{ ...btnSecondary, fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "4px" }}
          >
            <X size={12} /> Odstrani
          </button>
        </div>
      ) : (
        <label style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", border: "2px dashed #ddd", borderRadius: "6px",
          cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.5 : 1,
        }}>
          <Upload size={14} color="#aaa" />
          <span style={{ fontSize: "13px", color: "#888" }}>{uploading ? "Nalagam…" : "Naloži sliko"}</span>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} style={{ display: "none" }} />
        </label>
      )}
      {error && <p style={{ fontSize: "12px", color: "#e53935", margin: "6px 0 0 0" }}>{error}</p>}
    </div>
  );
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blog");
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
    setShowForm(true);
    setTimeout(() => document.getElementById("bf-title")?.focus(), 50);
  }

  function openEdit(p: BlogPost) {
    setEditingId(p.id);
    setForm({
      title: p.title ?? "",
      slug: p.slug ?? "",
      tag: p.tag ?? "",
      tagIcon: p.tag_icon ?? "",
      ctaProduct: p.cta_product ?? "",
      readMinutes: p.read_minutes ? String(p.read_minutes) : "",
      coverImage: p.cover_image ?? "",
      author: p.author ?? "",
      publishedAt: new Date(p.published_at).toISOString().slice(0, 10),
      intro: p.intro ?? "",
      body: p.body ?? "",
    });
    setFormError("");
    setShowForm(true);
    setTimeout(() => document.getElementById("bf-title")?.focus(), 50);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
  }

  function setField<K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const title = form.title.trim();
    const intro = form.intro.trim();
    if (!title) { setFormError("Naslov je obvezen."); return; }
    if (!intro) { setFormError("Uvod je obvezen."); return; }

    setSaving(true);

    const body = {
      title,
      intro,
      body: form.body,
      slug: form.slug.trim(),
      tag: form.tag.trim() || null,
      tag_icon: form.tagIcon.trim() || null,
      cta_product: form.ctaProduct.trim() || null,
      read_minutes: form.readMinutes ? parseInt(form.readMinutes, 10) : null,
      cover_image: form.coverImage || null,
      author: form.author.trim() || null,
      published_at: form.publishedAt || new Date().toISOString().slice(0, 10),
    };

    const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (res.ok) {
      cancelForm();
      fetchPosts();
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      setFormError(err.error ?? "Napaka pri shranjevanju.");
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Izbriši "${title}"? Tega ni mogoče razveljaviti.`)) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) { fetchPosts(); router.refresh(); }
    else alert("Brisanje ni uspelo.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: 0 }}>Blog objave</h2>
          {!showForm && (
            <button onClick={openAdd} style={btnPrimary}>+ Nova objava</button>
          )}
        </div>

        {showForm && (
          <div style={{ ...card, marginBottom: "24px", borderLeft: "3px solid var(--color-accent-text)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 20px 0" }}>
              {editingId ? "Uredi objavo" : "Nova blog objava"}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle} htmlFor="bf-title">Naslov *</label>
                  <input
                    id="bf-title" required value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    style={inputStyle} placeholder="Naslov objave"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Slug</label>
                  <input
                    value={form.slug} onChange={(e) => setField("slug", e.target.value)}
                    style={inputStyle} placeholder="Prazno pusti za samodejno generiranje iz naslova"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Značka (tag)</label>
                  <input
                    value={form.tag} onChange={(e) => setField("tag", e.target.value)}
                    style={inputStyle} placeholder="npr. Regeneracija"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Ikona značke</label>
                  <input
                    value={form.tagIcon} onChange={(e) => setField("tagIcon", e.target.value)}
                    style={inputStyle} placeholder="npr. ri-leaf-line"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Avtor</label>
                  <input
                    value={form.author} onChange={(e) => setField("author", e.target.value)}
                    style={inputStyle} placeholder="Ime avtorja"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Čas branja (min)</label>
                  <input
                    type="number" min="1" value={form.readMinutes}
                    onChange={(e) => setField("readMinutes", e.target.value)}
                    style={inputStyle} placeholder="5"
                  />
                </div>

                <div>
                  <label style={labelStyle}>Datum objave</label>
                  <input
                    type="date" value={form.publishedAt}
                    onChange={(e) => setField("publishedAt", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Produkt za CTA</label>
                  <input
                    value={form.ctaProduct} onChange={(e) => setField("ctaProduct", e.target.value)}
                    style={inputStyle} placeholder="npr. BPC-157"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Naslovnica</label>
                  <CoverImageUploader
                    value={form.coverImage}
                    onChange={(url) => setField("coverImage", url)}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Uvod *</label>
                  <textarea
                    rows={3} value={form.intro}
                    onChange={(e) => setField("intro", e.target.value)}
                    style={{ ...inputStyle, resize: "vertical" }}
                    placeholder="Kratek uvod v objavo…"
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Vsebina (markdown)</label>
                  <textarea
                    rows={16} value={form.body}
                    onChange={(e) => setField("body", e.target.value)}
                    style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace" }}
                    placeholder={"## Naslov odseka\n\nBesedilo odseka. Podprto: **krepko**, [povezave](https://...), sezname.\n\n## Viri\n\n1. ..."}
                  />
                </div>
              </div>

              {formError && (
                <p style={{ fontSize: "13px", color: "#e53935", marginBottom: "12px" }}>{formError}</p>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Shranjujem…" : editingId ? "Shrani spremembe" : "Objavi"}
                </button>
                <button type="button" onClick={cancelForm} style={btnSecondary}>Prekliči</button>
              </div>
            </form>
          </div>
        )}

        <div style={card}>
          {loading ? (
            <p style={{ fontSize: "14px", color: "#888", textAlign: "center", padding: "24px 0" }}>Nalagam…</p>
          ) : posts.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#888", textAlign: "center", padding: "24px 0" }}>
              Še ni objav. Dodaj prvo zgoraj.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Naslov", "Avtor", "Datum", "Čas branja", ""].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} style={{ backgroundColor: "#fff" }}>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 600 }}>{p.title}</span>
                        {p.intro && (
                          <p style={{ fontSize: "12px", color: "#888", margin: "2px 0 0 0" }}>
                            {p.intro.slice(0, 80)}{p.intro.length > 80 ? "…" : ""}
                          </p>
                        )}
                      </td>
                      <td style={{ ...tdStyle, color: "#666" }}>{p.author ?? "—"}</td>
                      <td style={{ ...tdStyle, color: "#666", whiteSpace: "nowrap" }}>
                        {new Date(p.published_at).toLocaleDateString("sl-SI")}
                      </td>
                      <td style={{ ...tdStyle, color: "#666" }}>
                        {p.read_minutes ? `${p.read_minutes} min` : "—"}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button onClick={() => openEdit(p)} style={btnEdit}>
                            <Pencil size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                            Uredi
                          </button>
                          <button onClick={() => handleDelete(p.id, p.title ?? "")} style={btnDanger}>
                            <Trash2 size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                            Izbriši
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
