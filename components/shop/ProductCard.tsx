import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? "/placeholder.png";

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square bg-[#f5f5f5] overflow-hidden mb-4">
        <Image
          src={image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
            Sold Out
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        {product.category && (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C]">
            {product.category}
          </p>
        )}
        <h3 className="text-sm font-bold uppercase tracking-wide text-black leading-snug group-hover:text-[#C9A84C] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-black text-black">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
