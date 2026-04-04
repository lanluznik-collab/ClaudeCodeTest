"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);
  const src = images[selected] ?? "/placeholder.png";

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden">
        <Image
          src={src}
          alt={name}
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === selected ? "border-black" : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
