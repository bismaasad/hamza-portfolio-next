import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import EducationSection from "@/components/EducationSection";
import { Footer } from "@/components/Footer";
import { EducationItem, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Education | Dr. Hamza Khan",
  description: "Doctoral, Master's, and Bachelor's degrees in Mathematical Sciences with honors from Obuda University Budapest and top Pakistani institutions.",
};

export default async function EducationPage() {
  let educationItems: EducationItem[] = [];
  let heroData: HeroType | null = null;

  try {
    const [eduRes, heroRes] = await Promise.all([
      supabase
        .from("education")
        .select("id, degree, institute, year, description, order_index")
        .order("order_index", { ascending: true }),
      supabase
        .from("hero")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (eduRes.data) educationItems = eduRes.data as EducationItem[];
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching education page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Education &amp; Qualifications"
          subtitle="Academic foundation spanning PhD Suma Cum Laude in Hungary to undergraduate mathematics degrees in Pakistan."
          badge="Academic Pedigree"
          iconType="education"
          badgeColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />

        <EducationSection items={educationItems} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
