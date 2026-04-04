import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? "/placeholder.png";

  return (
    <Link href={`/shop/${product.slug}`} style={{ display: "block", textDecoration: "none" }} className="group">
      {/* Image container — matches woocommerce 265x265 square */}
      <div style={{
        position: "relative",
        aspectRatio: "1 / 1",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        marginBottom: "12px",
      }}>
        <Image
          src={image}
          alt={product.name}
          width={265}
          height={265}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          className="group-hover:scale-105"
        />
        {product.stock === 0 && (
          <span style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "#958e09",
            color: "#fff",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-montserrat)",
            textTransform: "uppercase",
            padding: "3px 8px",
          }}>
            Sold Out
          </span>
        )}
      </div>

      {/* Title — matches woocommerce-loop-product__title */}
      <h2 style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "14px",
        fontWeight: 600,
        color: "#222",
        margin: "0 0 6px 0",
        lineHeight: 1.4,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        transition: "color 0.2s",
      }}
        className="group-hover:text-[#ca8b2b]"
      >
        {product.name}
      </h2>

      {/* Category */}
      {product.category && (
        <p style={{
          fontFamily: "var(--font-opensans)",
          fontSize: "11px",
          color: "#999",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: "0 0 4px 0",
        }}>
          {product.category}
        </p>
      )}

      {/* Price — matches .price color from woocommerce */}
      <span style={{
        display: "block",
        fontFamily: "var(--font-montserrat)",
        fontSize: "15px",
        fontWeight: 700,
        color: "#ca8b2b",
      }}>
        {formatPrice(product.price)}
      </span>
    </Link>
  );
}
