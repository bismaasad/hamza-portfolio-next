import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import AboutSection from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { AboutSection as AboutType, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "About | Dr. Hamza Khan - Academic & Researcher",
  description: "Biographical journey, mathematical research domains, language skills, and computational software stack of Dr. Hamza Khan.",
};

export default async function AboutPage() {
  let aboutData: AboutType | null = null;
  let heroData: HeroType | null = null;

  try {
    const [aboutRes, heroRes] = await Promise.all([
      supabase
        .from("about")
        .select("id, content, bio_highlights, image_url")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("hero")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (aboutRes.data) aboutData = aboutRes.data as AboutType;
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching about page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="About &amp; Biography"
          subtitle="Applied Mathematical Researcher specializing in Adaptive Control Theory, Computational Fluid Dynamics, and Fractional Modeling."
          badge="Academic Profile"
          iconType="about"
          badgeColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        />

        <AboutSection data={aboutData} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
