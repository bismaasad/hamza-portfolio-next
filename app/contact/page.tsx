import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import ContactSection from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ContactInfo, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact | Dr. Hamza Khan",
  description: "Get in touch with Dr. Hamza Khan for academic inquiries, research collaborations, lectureships, or mathematical consultation.",
};

export default async function ContactPage() {
  let contactData: ContactInfo | null = null;
  let heroData: HeroType | null = null;

  try {
    const [contactRes, heroRes] = await Promise.all([
      supabase
        .from("contact_info")
        .select("id, email, phone, address, github_url, linkedin_url, twitter_url, instagram_url, social_links")
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

    if (contactRes.data) contactData = contactRes.data as ContactInfo;
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching contact page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Connect &amp; Collaborate"
          subtitle="Reach out directly via university email, telephone, ResearchGate, Google Scholar, or through the message form below."
          badge="Contact Channels"
          iconType="contact"
          badgeColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />

        <ContactSection data={contactData} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
