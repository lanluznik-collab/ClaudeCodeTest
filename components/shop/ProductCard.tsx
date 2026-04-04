import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? "/placeholder.png";

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="aspect-square bg-gray-100 overflow-hidden mb-3 border border-transparent group-hover:border-gray-300 transition-colors duration-300">
        <Image
          src={image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-1 px-0.5">
        {product.category && (
          <p className="text-xs text-gold uppercase tracking-widest font-semibold">
            {product.category}
          </p>
        )}
        <h3 className="text-sm font-bold uppercase tracking-wide leading-snug text-[#111111]">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-gold">{formatPrice(product.price)}</p>
        {product.stock === 0 && (
          <p className="text-xs text-red-400 uppercase tracking-wide">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
