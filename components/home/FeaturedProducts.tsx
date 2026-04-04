import Link from "next/link";
import { Product } from "@/types";
import { ProductGrid } from "@/components/shop/ProductGrid";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#C9A84C] mb-2">
              Our Range
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              Products For Sale
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-black border-b-2 border-[#C9A84C] pb-1 hover:text-[#C9A84C] transition-colors self-start sm:self-auto"
          >
            View All Products →
          </Link>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
