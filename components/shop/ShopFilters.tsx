"use client";

import { useRouter, useSearchParams } from "next/navigation";

const dropdownStyle: React.CSSProperties = {
  fontFamily: "var(--font-opensans)",
  fontSize: "13px",
  color: "#333",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "8px 12px",
  cursor: "pointer",
  outline: "none",
  minWidth: "140px",
};

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-opensans)",
  fontSize: "13px",
  color: "#333",
  cursor: "pointer",
  userSelect: "none",
};

const priceOptions = [
  { value: "", label: "Vse cene" },
  { value: "under50", label: "Pod 50 €" },
  { value: "50to100", label: "50 € – 100 €" },
  { value: "over100", label: "Nad 100 €" },
];

const sortOptions = [
  { value: "newest",     label: "Najnovejše" },
  { value: "price_asc",  label: "Cena: od najnižje" },
  { value: "price_desc", label: "Cena: od najvišje" },
];

export function ShopFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort     = searchParams.get("sort") ?? "newest";
  const currentPrice    = searchParams.get("price") ?? "";
  const inStock         = searchParams.get("in_stock") === "true";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "12px", marginBottom: "32px",
    }}>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <select value={currentPrice} onChange={(e) => update("price", e.target.value)} style={dropdownStyle}>
          {priceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <select value={currentCategory} onChange={(e) => update("category", e.target.value)} style={dropdownStyle}>
          <option value="">Vse kategorije</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => update("in_stock", e.target.checked ? "true" : "")}
            style={{ accentColor: "#c9a84c", width: "14px", height: "14px" }}
          />
          Na zalogi
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontFamily: "var(--font-opensans)", fontSize: "13px", color: "#555" }}>
          Razvrsti:
        </span>
        <select value={currentSort} onChange={(e) => update("sort", e.target.value)} style={dropdownStyle}>
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
