import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import AchievementsSection from "@/components/AchievementsSection";
import { Footer } from "@/components/Footer";
import { AchievementItem, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Honors & Achievements | Dr. Hamza Khan",
  description:
    "National and international merit scholarships, doctoral distinctions, research fellowships, and academic honors awarded to Dr. Hamza Khan.",
};

export default async function AchievementsPage() {
  let achievementItems: AchievementItem[] = [];
  let heroData: HeroType | null = null;

  try {
    const [achRes, heroRes] = await Promise.all([
      supabase
        .from("achievements")
        .select("id, title, description, year, image_url, order_index, created_at, updated_at")
        .order("order_index", { ascending: true }),
      supabase
        .from("hero")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (achRes.data) achievementItems = achRes.data as AchievementItem[];
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching achievements page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Honors &amp; Achievements"
          subtitle={`A distinguished record of ${achievementItems.length || 6}+ competitive awards, doctoral honors, research fellowships, and academic accolades.`}
          badge="Distinctions &amp; Awards"
          iconType="achievements"
          badgeColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />

        <AchievementsSection items={achievementItems} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
