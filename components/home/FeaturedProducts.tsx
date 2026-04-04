import Link from "next/link";
import { Product } from "@/types";
import { ProductGrid } from "@/components/shop/ProductGrid";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
        <Link
          href="/shop"
          className="text-sm text-gray-400 hover:text-black transition-colors"
        >
          View all →
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
