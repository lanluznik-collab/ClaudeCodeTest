import { createServerClient } from "@/lib/supabase/server";
import CoaClient from "./CoaClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "COA Vault — SloPeps",
  description: "Certificates of Analysis for all SloPeps peptide products. Every batch independently tested.",
};

export default async function CoaPage() {
  const supabase = createServerClient();

  // COAs are stored as image URLs on products.coa_images (uploaded via the
  // admin product editor) — there is no separate coa_documents table, so the
  // vault reads from the same source the product page's COA tab uses.
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, images, coa_images")
    .order("name", { ascending: true });

  const rows = (products ?? []).flatMap((product) =>
    (product.coa_images ?? []).map((url: string, i: number) => ({
      id: `${product.id}-${i}`,
      product_id: product.id,
      batch_number: null,
      test_date: null,
      file_url: url,
      file_size: null,
      status: "Aktualni",
      created_at: "",
      products: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        images: product.images ?? [],
      },
    }))
  );

  // Derive unique products that have at least one COA image
  const seen = new Set<string>();
  const uniqueProducts: { id: string; name: string }[] = [];
  for (const row of rows) {
    if (row.products && !seen.has(row.products.id)) {
      seen.add(row.products.id);
      uniqueProducts.push({ id: row.products.id, name: row.products.name });
    }
  }

  return <CoaClient docs={rows} uniqueProducts={uniqueProducts} />;
}
