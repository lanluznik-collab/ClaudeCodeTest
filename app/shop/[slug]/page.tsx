import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { ProductDetailClient } from "./ProductDetailClient";

interface Props {
  params: { slug: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.slopeps.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("name, description, description_sl, amount_mg, purity")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Izdelek ni najden" };

  // `name` already carries the amount in parentheses (e.g. "Retatrutide (5mg)"),
  // matching the store's existing naming convention.
  const title = `${data.name} — SloPeps`;
  const descriptionParts = [
    data.description_sl ?? data.description,
    data.purity ? `Čistost ${data.purity}.` : null,
  ].filter(Boolean);

  return {
    title,
    description: descriptionParts.join(" ") || undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) notFound();

  const [{ data: related }, { data: coaDocs }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("category", product.category ?? "")
      .neq("id", product.id)
      .limit(4),
    supabase
      .from("coa_documents")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description_sl ?? product.description ?? undefined,
    image: product.images?.[0] ?? undefined,
    sku: product.id,
    brand: { "@type": "Brand", name: "SloPeps" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: "EUR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        related={related ?? []}
        coaDocs={coaDocs ?? []}
      />
    </>
  );
}
