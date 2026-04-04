"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Name</th>
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Category</th>
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Price</th>
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Stock</th>
            <th className="text-left py-3 pr-4 font-medium text-gray-500">Featured</th>
            <th className="py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="py-3 pr-4 font-medium">{p.name}</td>
              <td className="py-3 pr-4 text-gray-500 capitalize">{p.category ?? "—"}</td>
              <td className="py-3 pr-4">{formatPrice(p.price)}</td>
              <td className="py-3 pr-4">
                <span className={p.stock === 0 ? "text-red-400" : ""}>
                  {p.stock}
                </span>
              </td>
              <td className="py-3 pr-4">
                {p.featured ? (
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                    Yes
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2 justify-end">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-500" />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <p className="text-center text-gray-400 py-10">No products yet.</p>
      )}
    </div>
  );
}
