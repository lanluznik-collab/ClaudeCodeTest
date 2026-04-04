import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? "/placeholder.png";

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
        <Image
          src={image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
        {product.stock === 0 && (
          <p className="text-xs text-red-400">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
