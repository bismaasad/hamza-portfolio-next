import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import AdministrativeRolesSection from "@/components/AdministrativeRolesSection";
import { Footer } from "@/components/Footer";
import { AdministrativeRoleItem, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Administrative Responsibilities | Dr. Hamza Khan",
  description: "Institutional leadership appointments and administrative roles including Student Advisor, Industrial Liaison Officer, and Job Placement Officer at National Textile University.",
};

export default async function AdministrativeResponsibilitiesPage() {
  let roles: AdministrativeRoleItem[] = [];
  let heroData: HeroType | null = null;

  try {
    const [rolesRes, heroRes] = await Promise.all([
      supabase
        .from("administrative_roles")
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

    if (rolesRes.error) {
      console.error("Supabase error fetching administrative_roles:", rolesRes.error);
    }
    if (rolesRes.data) {
      roles = rolesRes.data as AdministrativeRoleItem[];
    }
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching administrative responsibilities page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Administrative Responsibilities"
          subtitle="Leadership and institutional governance appointments at National Textile University, including student advisory, industry partnerships, and career placement services."
          badge="University Service"
          iconType="administrative"
          badgeColor="text-sky-400 bg-sky-500/10 border-sky-500/20"
        />

        <AdministrativeRolesSection items={roles} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
