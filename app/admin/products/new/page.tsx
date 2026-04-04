import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New Product</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <ProductForm />
      </div>
    </div>
  );
}
