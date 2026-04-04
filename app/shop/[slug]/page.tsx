import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { ImageGallery } from "@/components/product/ImageGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", params.slug)
    .single();

  if (!data) return { title: "Product not found" };
  return { title: data.name, description: data.description ?? undefined };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ImageGallery images={product.images} name={product.name} />

        <div className="space-y-6">
          {product.category && (
            <p className="text-xs uppercase tracking-widest text-gray-400">
              {product.category}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="text-gray-500 leading-relaxed">{product.description}</p>
          )}

          <div className="space-y-3 pt-2">
            <AddToCartButton product={product} />
            <WhatsAppButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
