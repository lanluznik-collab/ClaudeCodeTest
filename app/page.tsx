import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { StatsSection } from "@/components/home/StatsSection";
import { CtaBox } from "@/components/home/CtaBox";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <>
      <HeroCarousel />
      <TrustBar />
      <FeaturedCarousel products={products ?? []} />
      <StatsSection />
      <CtaBox />
    </>
  );
}
