"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { Product } from "@/types";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity: qty,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-3.5 rounded-full bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Qty</span>
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="px-3 py-2 text-gray-500 hover:text-black transition-colors"
          >
            −
          </button>
          <span className="px-3 py-2 text-sm font-medium min-w-[2rem] text-center">
            {qty}
          </span>
          <button
            onClick={() => setQty(Math.min(product.stock, qty + 1))}
            className="px-3 py-2 text-gray-500 hover:text-black transition-colors"
          >
            +
          </button>
        </div>
        <span className="text-xs text-gray-400">{product.stock} in stock</span>
      </div>
      <button
        onClick={handleAdd}
        className="w-full py-3.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        {added ? "Added to cart ✓" : "Add to Cart"}
      </button>
    </div>
  );
}
