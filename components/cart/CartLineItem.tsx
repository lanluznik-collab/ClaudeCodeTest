"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { X } from "lucide-react";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100">
      <Link href={`/shop/${item.slug}`}>
        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/shop/${item.slug}`}>
          <p className="text-sm font-medium truncate hover:underline">{item.name}</p>
        </Link>
        <p className="text-sm text-gray-400 mt-0.5">{formatPrice(item.price)} each</p>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="px-2.5 py-1 text-gray-500 hover:text-black transition-colors text-sm"
            >
              −
            </button>
            <span className="px-2.5 py-1 text-sm font-medium min-w-[1.5rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="px-2.5 py-1 text-gray-500 hover:text-black transition-colors text-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => removeItem(item.productId)}
          className="text-gray-300 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <p className="text-sm font-semibold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
