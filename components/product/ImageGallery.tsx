"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const validImages = (images ?? []).filter(Boolean);
  const [selected, setSelected] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const src = validImages[selected];
  const hasImage = src && !imgErrors[selected];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Main image box */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        backgroundColor: "#f9f9f9",
        border: "1px solid #e8e8e8",
        borderRadius: "4px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {hasImage ? (
          <Image
            src={src}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "contain", padding: "16px" }}
            priority
            onError={() => setImgErrors((e) => ({ ...e, [selected]: true }))}
          />
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            color: "#ccc",
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#ccc",
            }}>
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                position: "relative",
                width: "72px",
                height: "72px",
                flexShrink: 0,
                borderRadius: "4px",
                overflow: "hidden",
                border: i === selected ? "2px solid #c9a84c" : "2px solid #e8e8e8",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
                padding: 0,
                transition: "border-color 0.2s",
              }}
            >
              <Image
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                sizes="72px"
                style={{ objectFit: "contain", padding: "4px" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
