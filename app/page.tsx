import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { createServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts products={products ?? []} />
    </>
  );
}
