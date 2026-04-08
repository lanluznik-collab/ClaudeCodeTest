"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Product, Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Upload, X, Pencil, Trash2 } from "lucide-react";

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
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  featured: boolean;
  images: string[];
  coa_images: string[];
};

const emptyForm = (): FormState => ({
  name: "", description: "", price: "", stock: "",
  category: "", featured: false, images: [], coa_images: [],
});

// ─── Image uploader (inline) ──────────────────────────────────────────────────

function ImageUploader({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    for (const file of files) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (res.ok) {
        const { url } = await res.json();
        uploaded.push(url);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(`Upload failed: ${err.error ?? "Unknown error"}`);
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
        {images.map((url) => (
          <div key={url} style={{ position: "relative", width: "72px", height: "72px" }}>
            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px", border: "1px solid #ddd" }} />
            <button
              type="button"
              onClick={() => onChange(images.filter((i) => i !== url))}
              style={{
                position: "absolute", top: "-6px", right: "-6px",
                width: "18px", height: "18px", borderRadius: "50%",
                backgroundColor: "#fff", border: "1px solid #ddd",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", color: "#e53935",
              }}
            >
              <X size={10} />
            </button>
          </div>
        ))}

        <label style={{
          width: "72px", height: "72px",
          border: "2px dashed #ddd", borderRadius: "6px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: uploading ? "not-allowed" : "pointer", gap: "4px",
          opacity: uploading ? 0.5 : 1,
        }}>
          <Upload size={16} color="#aaa" />
          <span style={{ fontSize: "10px", color: "#aaa" }}>{uploading ? "…" : "Upload"}</span>
          <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading} style={{ display: "none" }} />
        </label>
      </div>
      {error && <p style={{ fontSize: "12px", color: "#e53935", margin: 0 }}>{error}</p>}
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Site settings
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroError, setHeroError] = useState("");
  const [heroSuccess, setHeroSuccess] = useState(false);

  // Product form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setLoadingProducts(false);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setLoadingOrders(false);
  }, []);

  const fetchHeroImage = useCallback(async () => {
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const { value } = await res.json();
      setHeroImageUrl(value ?? "");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchHeroImage();
  }, [fetchProducts, fetchOrders, fetchHeroImage]);

  // ── hero image handlers ────────────────────────────────────────────────────

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeroUploading(true);
    setHeroError("");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    if (res.ok) {
      const { url } = await res.json();
      setHeroImageUrl(url);
    } else {
      const err = await res.json().catch(() => ({}));
      setHeroError(`Upload failed: ${err.error ?? "Unknown error"}`);
    }
    setHeroUploading(false);
    e.target.value = "";
  }

  async function handleHeroSave() {
    setHeroSaving(true);
    setHeroError("");
    setHeroSuccess(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: heroImageUrl }),
    });
    setHeroSaving(false);
    if (res.ok) {
      setHeroSuccess(true);
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      setHeroError(err.error ?? "Failed to save.");
    }
  }

  async function handleHeroRemove() {
    setHeroError("");
    setHeroSuccess(false);
    setHeroImageUrl("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: "" }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      setHeroError(err.error ?? "Failed to remove image.");
    }
  }

  // ── product form helpers ───────────────────────────────────────────────────

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
    setShowForm(true);
    setTimeout(() => document.getElementById("pf-name")?.focus(), 50);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      stock: String(p.stock),
      category: p.category ?? "",
      featured: p.featured,
      images: p.images ?? [],
      coa_images: p.coa_images ?? [],
    });
    setFormError("");
    setShowForm(true);
    setTimeout(() => document.getElementById("pf-name")?.focus(), 50);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setFormError("");
  }

  function setField(key: keyof FormState, value: FormState[keyof FormState]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const body = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      category: form.category.trim() || null,
      featured: form.featured,
      images: form.images,
      coa_images: form.coa_images,
    };

    if (!body.name) { setFormError("Name is required."); setSaving(false); return; }
    if (isNaN(body.price) || body.price < 0) { setFormError("Enter a valid price."); setSaving(false); return; }
    if (isNaN(body.stock) || body.stock < 0) { setFormError("Enter a valid stock number."); setSaving(false); return; }

    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (res.ok) {
      cancelForm();
      fetchProducts();
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      setFormError(err.error ?? "Failed to save product.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) { fetchProducts(); router.refresh(); }
    else alert("Delete failed.");
  }

  async function updateOrderStatus(id: string, status: string) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  }

  // ── render ─────────────────────────────────────────────────────────────────

  const statusColors: Record<string, string> = {
    pending:   "#92400e",
    paid:      "#1d4ed8",
    shipped:   "#6b21a8",
    delivered: "#166534",
    cancelled: "#991b1b",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {/* ── SITE SETTINGS ── */}
      <section>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: "0 0 16px 0" }}>Site Settings</h2>
        <div style={card}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111", margin: "0 0 16px 0" }}>Hero Image</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {heroImageUrl && (
              <div>
                <img
                  src={heroImageUrl}
                  alt="Hero preview"
                  style={{ maxWidth: "320px", maxHeight: "200px", objectFit: "contain", border: "1px solid #eee", borderRadius: "6px", display: "block" }}
                />
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", backgroundColor: "#f5f5f5",
                border: "1px solid #ddd", borderRadius: "6px",
                fontSize: "13px", fontWeight: 600, color: "#333",
                cursor: heroUploading ? "not-allowed" : "pointer",
                opacity: heroUploading ? 0.6 : 1,
              }}>
                <Upload size={14} />
                {heroUploading ? "Uploading…" : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleHeroUpload} disabled={heroUploading} style={{ display: "none" }} />
              </label>
              {heroImageUrl && (
                <button
                  type="button"
                  onClick={handleHeroRemove}
                  style={{ ...btnSecondary, fontSize: "12px", padding: "8px 12px" }}
                >
                  Remove
                </button>
              )}
            </div>
            {heroError && <p style={{ fontSize: "12px", color: "#e53935", margin: 0 }}>{heroError}</p>}
            {heroSuccess && <p style={{ fontSize: "12px", color: "#166534", margin: 0 }}>Saved successfully.</p>}
            <div>
              <button
                type="button"
                onClick={handleHeroSave}
                disabled={heroSaving || heroUploading}
                style={{ ...btnPrimary, opacity: heroSaving || heroUploading ? 0.6 : 1 }}
              >
                {heroSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: 0 }}>Products</h2>
          {!showForm && (
            <button onClick={openAdd} style={btnPrimary}>
              + Add Product
            </button>
          )}
        </div>

        {/* Add / Edit form */}
        {showForm && (
          <div style={{ ...card, marginBottom: "24px", borderLeft: "3px solid #c9a84c" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111", margin: "0 0 20px 0" }}>
              {editingId ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle} htmlFor="pf-name">Name *</label>
                  <input id="pf-name" required value={form.name} onChange={(e) => setField("name", e.target.value)} style={inputStyle} placeholder="Product name" />
                </div>
                <div>
                  <label style={labelStyle}>Price (USD) *</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} style={inputStyle} placeholder="0.00" />
                </div>
                <div>
                  <label style={labelStyle}>Stock *</label>
                  <input required type="number" min="0" value={form.stock} onChange={(e) => setField("stock", e.target.value)} style={inputStyle} placeholder="0" />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <input value={form.category} onChange={(e) => setField("category", e.target.value)} style={inputStyle} placeholder="e.g. Peptides, Blends" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "20px" }}>
                  <input
                    id="pf-featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setField("featured", e.target.checked)}
                    style={{ width: "16px", height: "16px", accentColor: "#c9a84c" }}
                  />
                  <label htmlFor="pf-featured" style={{ fontSize: "13px", color: "#333", cursor: "pointer" }}>
                    Featured on homepage
                  </label>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setField("description", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} placeholder="Product description…" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Images</label>
                  <ImageUploader images={form.images} onChange={(imgs) => setField("images", imgs)} />
                </div>
                <div style={{ gridColumn: "1 / -1", borderTop: "1px solid #eee", paddingTop: "16px" }}>
                  <label style={{ ...labelStyle, marginBottom: "4px" }}>Certifikat analize</label>
                  <p style={{ fontSize: "12px", color: "#999", margin: "0 0 10px 0" }}>
                    Naloži slike certifikata analize (COA). Prikazane so na strani izdelka.
                  </p>
                  <ImageUploader images={form.coa_images} onChange={(imgs) => setField("coa_images", imgs)} />
                </div>
              </div>

              {formError && (
                <p style={{ fontSize: "13px", color: "#e53935", marginBottom: "12px" }}>{formError}</p>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Saving…" : editingId ? "Save Changes" : "Create Product"}
                </button>
                <button type="button" onClick={cancelForm} style={btnSecondary}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products table */}
        <div style={card}>
          {loadingProducts ? (
            <p style={{ fontSize: "14px", color: "#888", textAlign: "center", padding: "24px 0" }}>Loading products…</p>
          ) : products.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#888", textAlign: "center", padding: "24px 0" }}>No products yet. Add one above.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Name", "Category", "Price", "Stock", "Featured", ""].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ backgroundColor: "#fff" }}>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </td>
                      <td style={{ ...tdStyle, color: "#666" }}>{p.category ?? "—"}</td>
                      <td style={{ ...tdStyle, color: "#c9a84c", fontWeight: 700 }}>{formatPrice(p.price)}</td>
                      <td style={{ ...tdStyle, color: p.stock === 0 ? "#e53935" : "#333" }}>
                        {p.stock === 0 ? "Out of stock" : p.stock}
                      </td>
                      <td style={tdStyle}>
                        {p.featured ? (
                          <span style={{ fontSize: "11px", backgroundColor: "#111", color: "#fff", padding: "2px 8px", borderRadius: "100px" }}>Yes</span>
                        ) : (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button onClick={() => openEdit(p)} style={btnEdit}>
                            <Pencil size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                            Edit
                          </button>
                          <button onClick={() => handleDelete(p.id, p.name)} style={btnDanger}>
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
      </section>

      {/* ── ORDERS ── */}
      <section>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#111", margin: "0 0 16px 0" }}>Orders</h2>
        <div style={card}>
          {loadingOrders ? (
            <p style={{ fontSize: "14px", color: "#888", textAlign: "center", padding: "24px 0" }}>Loading orders…</p>
          ) : orders.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#888", textAlign: "center", padding: "24px 0" }}>No orders yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Date", "Customer", "Email", "Items", "Total", "Method", "Status"].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td style={{ ...tdStyle, whiteSpace: "nowrap", color: "#666" }}>
                        {new Date(o.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{o.customer_name ?? "—"}</td>
                      <td style={{ ...tdStyle, color: "#666" }}>{o.customer_email ?? "—"}</td>
                      <td style={tdStyle}>
                        {Array.isArray(o.items)
                          ? o.items.map((item: { name: string; quantity: number }) => (
                              <div key={item.name} style={{ fontSize: "12px", color: "#555" }}>
                                {item.name} × {item.quantity}
                              </div>
                            ))
                          : "—"}
                      </td>
                      <td style={{ ...tdStyle, color: "#c9a84c", fontWeight: 700 }}>
                        {formatPrice(o.total)}
                      </td>
                      <td style={{ ...tdStyle, textTransform: "capitalize", color: "#666" }}>
                        {o.payment_method}
                      </td>
                      <td style={tdStyle}>
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: statusColors[o.status] ?? "#333",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          {["pending", "paid", "shipped", "delivered", "cancelled"].map((s) => (
                            <option key={s} value={s} style={{ color: "#111" }}>{s}</option>
                          ))}
                        </select>
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
