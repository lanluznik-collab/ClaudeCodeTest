import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { StatsSection } from "@/components/home/StatsSection";
import { CtaBox } from "@/components/home/CtaBox";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createServerClient();
  const [{ data: products }, { data: heroSlides }, { data: blogPosts }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("blog_posts")
      .select("id")
      .limit(1),
  ]);

  return (
    <>
      <HeroCarousel slides={heroSlides ?? []} />
      <TrustBar />
      <FeaturedCarousel products={products ?? []} />
      <StatsSection />
      <CtaBox hasBlogPosts={(blogPosts ?? []).length > 0} />
    </>
  );
}
