import Link from "next/link";
import { Product } from "@/types";
import { ProductGrid } from "@/components/shop/ProductGrid";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold mb-2">
            Hand-picked
          </p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
            Featured Products
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs uppercase tracking-widest text-gold font-semibold hover:text-[#111111] transition-colors border-b border-gold pb-0.5"
        >
          View All →
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
