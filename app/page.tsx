import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createServerClient();
  const supabaseAdmin = createServiceClient();
  const [{ data: products }, { data: heroSetting }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabaseAdmin
      .from("settings")
      .select("value")
      .eq("key", "hero_image")
      .single(),
  ]);

  const heroImage = heroSetting?.value || undefined;

  return (
    <>
      <Hero heroImage={heroImage} />
      <TrustBadges />
      <FeaturedProducts products={products ?? []} />
    </>
  );
}
