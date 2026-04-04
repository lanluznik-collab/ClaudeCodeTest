import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServiceClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
