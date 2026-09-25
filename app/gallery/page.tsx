import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import GallerySection from "@/components/GallerySection";
import { Footer } from "@/components/Footer";
import { GalleryItem, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery | Dr. Hamza Khan",
  description: "Photographs and moments from Phander Valley, Ghizer, Gilgit-Baltistan, conferences, and academic travels.",
};

export default async function GalleryPage() {
  let galleryItems: GalleryItem[] = [];
  let heroData: HeroType | null = null;

  try {
    const [galRes, heroRes] = await Promise.all([
      supabase
        .from("gallery")
        .select("id, image_url, caption, category, order_index")
        .order("order_index", { ascending: true }),
      supabase
        .from("hero")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (galRes.data) galleryItems = galRes.data as GalleryItem[];
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching gallery page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Photo Gallery"
          subtitle="Landscapes from the scenic valley of Phander, Ghizer, Gilgit-Baltistan and academic travel memories."
          badge="Moments &amp; Landscapes"
          iconType="gallery"
          badgeColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />

        <GallerySection items={galleryItems} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
