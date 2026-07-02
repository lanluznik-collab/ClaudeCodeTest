"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { ImageUploader } from "./ImageUploader";

type FormData = Omit<Product, "id" | "slug" | "created_at">;

interface Props {
  product?: Product;
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    category: product?.category ?? "",
    images: product?.images ?? [],
    coa_images: product?.coa_images ?? [],
    stock: product?.stock ?? 0,
    featured: product?.featured ?? false,
    purity: product?.purity ?? null,
    analysis_method: product?.analysis_method ?? null,
    storage_temp: product?.storage_temp ?? null,
    form: product?.form ?? null,
    amount_mg: product?.amount_mg ?? null,
    description_sl: product?.description_sl ?? null,
    description_en: product?.description_en ?? null,
    coa_url: product?.coa_url ?? null,
    msds_url: product?.msds_url ?? null,
  });

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";

    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    }
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          rows={4}
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price (USD) *</label>
          <input
            required
            type="number"
            min={0}
            step={0.01}
            value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock *</label>
          <input
            required
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          value={form.category ?? ""}
          onChange={(e) => set("category", e.target.value)}
          placeholder="e.g. peptides, supplements"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Purity</label>
          <input
            value={form.purity ?? ""}
            onChange={(e) => set("purity", e.target.value || null)}
            placeholder="e.g. >99%"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            value={form.amount_mg ?? ""}
            onChange={(e) => set("amount_mg", e.target.value || null)}
            placeholder="e.g. 5 mg"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Analysis method</label>
          <input
            value={form.analysis_method ?? ""}
            onChange={(e) => set("analysis_method", e.target.value || null)}
            placeholder="e.g. HPLC, MS"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Storage temperature</label>
          <input
            value={form.storage_temp ?? ""}
            onChange={(e) => set("storage_temp", e.target.value || null)}
            placeholder="e.g. -20°C"
            className={inputClass}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Form</label>
          <input
            value={form.form ?? ""}
            onChange={(e) => set("form", e.target.value || null)}
            placeholder="e.g. Lyophilized powder"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description (Slovenian)</label>
        <textarea
          rows={3}
          value={form.description_sl ?? ""}
          onChange={(e) => set("description_sl", e.target.value || null)}
          placeholder="Per-product chemical composition text shown on the product page (SL)"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description (English)</label>
        <textarea
          rows={3}
          value={form.description_en ?? ""}
          onChange={(e) => set("description_en", e.target.value || null)}
          placeholder="Per-product chemical composition text shown on the product page (EN)"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">COA document URL</label>
          <input
            value={form.coa_url ?? ""}
            onChange={(e) => set("coa_url", e.target.value || null)}
            placeholder="https://…"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">MSDS document URL</label>
          <input
            value={form.msds_url ?? ""}
            onChange={(e) => set("msds_url", e.target.value || null)}
            placeholder="https://… (leave empty to hide the MSDS card)"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Images</label>
        <ImageUploader
          images={form.images}
          onChange={(imgs) => set("images", imgs)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="featured" className="text-sm">
          Featured on homepage
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-200 text-sm rounded-lg hover:border-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
