import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { createServerClient, createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServerClient();
  const supabaseAdmin = createServiceClient();

  const [{ data: products }, { data: heroSetting, error: heroError }] = await Promise.all([
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

  console.log("[homepage] heroSetting:", heroSetting, "error:", heroError);

  const heroImage = heroSetting?.value || undefined;
  console.log("[homepage] heroImage value:", heroImage);

  return (
    <>
      <Hero heroImage={heroImage} />
      <TrustBadges />
      <FeaturedProducts products={products ?? []} />
    </>
  );
}
