"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { HeroSlide } from "@/types";

// ─── styles ──────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  padding: "24px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "8px 12px",
  fontSize: "14px",
  color: "#111",
  backgroundColor: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#555",
  marginBottom: "5px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const btnPrimary: React.CSSProperties = {
  padding: "9px 20px",
  backgroundColor: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "9px 20px",
  backgroundColor: "#fff",
  color: "#555",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#fff",
  color: "#e53935",
  border: "1px solid #fca5a5",
  borderRadius: "6px",
  fontSize: "12px",
  cursor: "pointer",
};

const btnEdit: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#fff",
  color: "#333",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "12px",
  cursor: "pointer",
};

const btnIcon: React.CSSProperties = {
  padding: "4px 8px",
  backgroundColor: "#fff",
  color: "#555",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "#888",
  borderBottom: "1px solid #eee",
  backgroundColor: "#fafafa",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "13px",
  color: "#333",
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "middle",
};

// ─── types ────────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  label: string;
  subtitle: string;
  button_text: string;
  button_link: string;
  image_url: string;
  is_active: boolean;
  sort_order: string;
};

const emptyForm = (): FormState => ({
  title: "",
  label: "",
  subtitle: "",
  button_text: "",
  button_link: "",
  image_url: "",
  is_active: true,
  sort_order: "0",
});

// ─── Hero image uploader ──────────────────────────────────────────────────────

function HeroImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload-hero", { method: "POST", body });

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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={value}
            alt=""
            style={{ width: "120px", height: "68px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <p style={{ fontSize: "12px", color: "#666", margin: 0, wordBreak: "break-all", maxWidth: "300px" }}>
              {value.split("/").pop()}
            </p>
            <button
              type="button"
              onClick={() => onChange("")}
              style={{ ...btnDanger, padding: "4px 10px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px", width: "fit-content" }}
            >
              <X size={10} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <label style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", border: "2px dashed #ddd", borderRadius: "6px",
          cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.5 : 1,
        }}>
          <Upload size={14} color="#aaa" />
          <span style={{ fontSize: "13px", color: "#888" }}>
            {uploading ? "Uploading…" : "Upload hero image"}
          </span>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} style={{ display: "none" }} />
        </label>
      )}
      {!value && (
        <p style={{ fontSize: "11px", color: "#aaa", margin: "6px 0 0 0" }}>
          Leave empty for a dark background slide (no image).
        </p>
      )}
      {error && <p style={{ fontSize: "12px", color: "#e53935", margin: "6px 0 0 0" }}>{error}</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SlidesAdminPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/slides");
    if (res.ok) setSlides(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openAdd() {
    const nextOrder = slides.length > 0
      ? Math.max(...slides.map((s) => s.sort_order)) + 1
      : 0;
    setEditingId(null);
    setForm({ ...emptyForm(), sort_order: String(nextOrder) });
    setFormError("");
    setShowForm(true);
  }

  function openEdit(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm({
      title: slide.title,
      label: slide.label ?? "",
      subtitle: slide.subtitle ?? "",
      button_text: slide.button_text,
      button_link: slide.button_link,
      image_url: slide.image_url ?? "",
      is_active: slide.is_active,
      sort_order: String(slide.sort_order),
    });
    setFormError("");
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const body = {
      title: form.title.trim(),
      label: form.label.trim() || null,
      subtitle: form.subtitle.trim() || null,
      button_text: form.button_text.trim(),
      button_link: form.button_link.trim(),
      image_url: form.image_url || null,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order, 10) || 0,
    };

    if (!body.title) { setFormError("Title is required."); setSaving(false); return; }
    if (!body.button_text) { setFormError("Button text is required."); setSaving(false); return; }
    if (!body.button_link) { setFormError("Button link is required."); setSaving(false); return; }

    const url = editingId ? `/api/admin/slides/${editingId}` : "/api/admin/slides";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (res.ok) {
      cancelForm();
      fetchSlides();
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      setFormError(err.error ?? "Failed to save slide.");
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete slide "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/slides/${id}`, { method: "DELETE" });
    if (res.ok) { fetchSlides(); router.refresh(); }
    else alert("Delete failed.");
  }

  async function moveSlide(slide: HeroSlide, direction: "up" | "down") {
    const sorted = [...slides].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === slide.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx];
    await Promise.all([
      fetch(`/api/admin/slides/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: other.sort_order }),
      }),
      fetch(`/api/admin/slides/${other.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sort_order: slide.sort_order }),
      }),
    ]);

    fetchSlides();
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#111", margin: "0 0 4px 0" }}>Hero Slides</h1>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>Manage the homepage hero carousel</p>
        </div>
        {!showForm && (
          <button onClick={openAdd} style={btnPrimary}>+ Add Slide</button>
        )}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div style={{ ...card, borderLeft: "3px solid #c9a84c" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 20px 0" }}>
            {editingId ? "Edit Slide" : "Add New Slide"}
          </h3>
          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Hero Image</label>
                <HeroImageUploader
                  value={form.image_url}
                  onChange={(url) => setField("image_url", url)}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Title *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Premium Research Peptides"
                />
              </div>

              <div>
                <label style={labelStyle}>Label <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(small text above title)</span></label>
                <input
                  value={form.label}
                  onChange={(e) => setField("label", e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. EU DOSTAVA"
                />
              </div>

              <div>
                <label style={labelStyle}>Sort Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) => setField("sort_order", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Subtitle <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(description below title)</span></label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) => setField("subtitle", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical" }}
                  placeholder="Short description shown below the title"
                />
              </div>

              <div>
                <label style={labelStyle}>Button Text *</label>
                <input
                  required
                  value={form.button_text}
                  onChange={(e) => setField("button_text", e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Razišči ponudbo"
                />
              </div>

              <div>
                <label style={labelStyle}>Button Link *</label>
                <input
                  required
                  value={form.button_link}
                  onChange={(e) => setField("button_link", e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. /shop"
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  id="slide-active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setField("is_active", e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "#c9a84c" }}
                />
                <label htmlFor="slide-active" style={{ fontSize: "13px", color: "#333", cursor: "pointer" }}>
                  Active (visible on site)
                </label>
              </div>
            </div>

            {formError && (
              <p style={{ fontSize: "13px", color: "#e53935", marginBottom: "12px" }}>{formError}</p>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving…" : editingId ? "Save Changes" : "Create Slide"}
              </button>
              <button type="button" onClick={cancelForm} style={btnSecondary}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Slides table */}
      <div style={card}>
        {loading ? (
          <p style={{ fontSize: "14px", color: "#888", textAlign: "center", padding: "24px 0" }}>Loading slides…</p>
        ) : slides.length === 0 ? (
          <p style={{ fontSize: "14px", color: "#888", textAlign: "center", padding: "24px 0" }}>
            No slides yet. Add one above.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Order", "Preview", "Title", "Label", "Button", "Active", ""].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slides.map((slide, idx) => (
                  <tr key={slide.id} style={{ backgroundColor: "#fff" }}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
                        <button
                          onClick={() => moveSlide(slide, "up")}
                          disabled={idx === 0}
                          style={{ ...btnIcon, opacity: idx === 0 ? 0.3 : 1 }}
                          title="Move up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <span style={{ fontSize: "12px", color: "#aaa", fontWeight: 600 }}>{slide.sort_order}</span>
                        <button
                          onClick={() => moveSlide(slide, "down")}
                          disabled={idx === slides.length - 1}
                          style={{ ...btnIcon, opacity: idx === slides.length - 1 ? 0.3 : 1 }}
                          title="Move down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {slide.image_url ? (
                        <img
                          src={slide.image_url}
                          alt=""
                          style={{ width: "80px", height: "45px", objectFit: "cover", borderRadius: "4px", border: "1px solid #eee" }}
                        />
                      ) : (
                        <div style={{
                          width: "80px", height: "45px", borderRadius: "4px",
                          backgroundColor: "#111", border: "1px solid #333",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: "10px", color: "#555" }}>dark</span>
                        </div>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600 }}>{slide.title}</span>
                    </td>
                    <td style={{ ...tdStyle, color: "#666" }}>{slide.label ?? "—"}</td>
                    <td style={{ ...tdStyle, color: "#666" }}>
                      <span style={{ display: "block", fontSize: "12px" }}>{slide.button_text}</span>
                      <span style={{ display: "block", fontSize: "11px", color: "#aaa" }}>{slide.button_link}</span>
                    </td>
                    <td style={tdStyle}>
                      {slide.is_active ? (
                        <span style={{ fontSize: "11px", backgroundColor: "#111", color: "#fff", padding: "2px 8px", borderRadius: "100px" }}>Active</span>
                      ) : (
                        <span style={{ fontSize: "11px", backgroundColor: "#f0f0f0", color: "#999", padding: "2px 8px", borderRadius: "100px" }}>Hidden</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        <button onClick={() => openEdit(slide)} style={btnEdit}>
                          <Pencil size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                          Edit
                        </button>
                        <button onClick={() => handleDelete(slide.id, slide.title)} style={btnDanger}>
                          <Trash2 size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                          Delete
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
    </div>
  );
}
