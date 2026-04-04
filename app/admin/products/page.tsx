import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductTable } from "@/components/admin/ProductTable";

export default async function AdminProductsPage() {
  const supabase = createServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
        >
          + New Product
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <ProductTable products={products ?? []} />
      </div>
    </div>
  );
}
