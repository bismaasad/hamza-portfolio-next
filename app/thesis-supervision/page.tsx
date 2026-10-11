import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import ThesisSupervisionSection from "@/components/ThesisSupervisionSection";
import { Footer } from "@/components/Footer";
import { ThesisSupervisionItem, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Thesis Supervision | Dr. Hamza Khan",
  description: "Postgraduate and undergraduate thesis supervision and mentorship in Applied Mathematics, Fluid Dynamics, and Mathematical Modeling.",
};

export default async function ThesisSupervisionPage() {
  let supervisionItems: ThesisSupervisionItem[] = [];
  let heroData: HeroType | null = null;

  try {
    const [supervisionRes, heroRes] = await Promise.all([
      supabase
        .from("thesis_supervision")
        .select("*")
        .order("order_index", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("hero")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (supervisionRes.error) {
      console.error("Supabase error fetching thesis_supervision:", supervisionRes.error);
    }
    if (supervisionRes.data) {
      supervisionItems = supervisionRes.data as ThesisSupervisionItem[];
    }
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching thesis supervision page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Thesis Supervision"
          subtitle="Scholarly mentorship of PhD, MS / MPhil, and BS researchers advancing computational mathematics and control theory."
          badge="Research Supervision"
          iconType="thesis"
          badgeColor="text-teal-400 bg-teal-500/10 border-teal-500/20"
        />

        <ThesisSupervisionSection items={supervisionItems} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
