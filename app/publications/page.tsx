import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import PublicationsSection from "@/components/PublicationsSection";
import { Footer } from "@/components/Footer";
import { PublicationItem, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Publications | Dr. Hamza Khan",
  description: "Peer-reviewed research articles and journal papers published in Fluid Dynamics, PLOS ONE, Chiang Mai Journal of Sciences, and Springer.",
};

export default async function PublicationsPage() {
  let publicationItems: PublicationItem[] = [];
  let heroData: HeroType | null = null;

  try {
    const [pubRes, heroRes] = await Promise.all([
      supabase
        .from("publications")
        .select("id, title, description, link, image_url, publisher, year, order_index")
        .order("order_index", { ascending: true }),
      supabase
        .from("hero")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (pubRes.data) publicationItems = pubRes.data as PublicationItem[];
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching publications page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Research Publications"
          subtitle={`A comprehensive archive of ${publicationItems.length || 24}+ peer-reviewed journal papers and computational modeling studies.`}
          badge="International Research Papers"
          iconType="publications"
          badgeColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />

        <PublicationsSection items={publicationItems} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
