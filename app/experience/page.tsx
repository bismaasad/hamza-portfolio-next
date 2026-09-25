import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import ExperienceSection from "@/components/ExperienceSection";
import { Footer } from "@/components/Footer";
import { ExperienceItem, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Experience & Faculty | Dr. Hamza Khan",
  description: "Academic appointments including Assistant Professor at National Textile University, lectureships, and college mathematics instruction.",
};

export default async function ExperiencePage() {
  let experienceItems: ExperienceItem[] = [];
  let heroData: HeroType | null = null;

  try {
    const [expRes, heroRes] = await Promise.all([
      supabase
        .from("experience")
        .select("id, role, company, duration, description, order_index")
        .order("order_index", { ascending: true }),
      supabase
        .from("hero")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (expRes.data) experienceItems = expRes.data as ExperienceItem[];
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching experience page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Teaching &amp; Professional Experience"
          subtitle="Over 10+ years of university faculty appointments, graduate lectureships, and research supervision in applied mathematics."
          badge="Faculty Appointments"
          iconType="experience"
          badgeColor="text-purple-400 bg-purple-500/10 border-purple-500/20"
        />

        <ExperienceSection items={experienceItems} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
