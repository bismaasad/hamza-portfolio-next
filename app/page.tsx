import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dr. Hamza Khan | Academic Portfolio & Researcher",
  description: "Personal academic portfolio of Dr. Hamza Khan - PhD in Mathematical Sciences, Assistant Professor at National Textile University, specializing in Computational Fluid Dynamics, Control Theory, and Fractional Modeling.",
};

export default async function HomePage() {
  let heroData: HeroType | null = null;
  let totalPublications = 24;

  try {
    const [heroRes, pubRes] = await Promise.all([
      supabase
        .from("hero")
        .select("id, title, subtitle, image_url, resume_url")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      // Optimized query: count only, zero bandwidth overhead
      supabase
        .from("publications")
        .select("id", { count: "exact", head: true }),
    ]);

    if (heroRes.data) heroData = heroRes.data as HeroType;
    if (pubRes.count !== null && pubRes.count !== undefined && pubRes.count > 0) {
      totalPublications = pubRes.count;
    }
  } catch (error) {
    console.error("Error fetching homepage data from Supabase:", error);
  }

  const heroName = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Fixed Navigation Header */}
      <Navbar name={heroName} />

      {/* Main Content: Hero Section with Short Intro & Page Navigation */}
      <main className="flex-1">
        <HeroSection
          data={heroData}
          totalPublications={totalPublications}
          totalExperienceYears={12}
        />
      </main>

      {/* Footer */}
      <Footer name={heroName} />
    </div>
  );
}
