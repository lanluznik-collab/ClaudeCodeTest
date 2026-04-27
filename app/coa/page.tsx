import { createServerClient } from "@/lib/supabase/server";
import CoaClient from "./CoaClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "COA Vault — SloPeps",
  description: "Certificates of Analysis for all SloPeps peptide products. Every batch independently tested.",
};

export default async function CoaPage() {
  const supabase = createServerClient();

  const { data: docs } = await supabase
    .from("coa_documents")
    .select("*, products(id, name, slug, images)")
    .order("created_at", { ascending: false });

  const rows = docs ?? [];

  // Derive unique products that have at least one COA doc
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
