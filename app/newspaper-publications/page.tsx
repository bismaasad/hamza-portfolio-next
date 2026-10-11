import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { PageHeader } from "@/components/PageHeader";
import NewspaperArticlesSection from "@/components/NewspaperArticlesSection";
import { Footer } from "@/components/Footer";
import { NewspaperArticleItem, HeroSection as HeroType } from "@/lib/types";

// Incremental Static Regeneration: Cache and revalidate in background
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Newspaper Publications & Columns | Dr. Hamza Khan",
  description:
    "Press coverage, featured op-eds, and analytical columns published in major national dailies including Daily K2, Daily Ausaf, and Daily Baad-e-Shimal.",
};

export default async function NewspaperPublicationsPage() {
  let articles: NewspaperArticleItem[] = [];
  let heroData: HeroType | null = null;

  try {
    const [newsRes, heroRes] = await Promise.all([
      supabase
        .from("newspaper_articles")
        .select(
          "id, title, newspaper_name, publish_date, author_byline, image_url, article_text, order_index, created_at, updated_at"
        )
        .order("order_index", { ascending: true }),
      supabase
        .from("hero")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (newsRes.data) articles = newsRes.data as NewspaperArticleItem[];
    if (heroRes.data) heroData = heroRes.data as HeroType;
  } catch (err) {
    console.error("Error fetching newspaper publications page data:", err);
  }

  const name = heroData?.title || "Dr. Hamza Khan";

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-rose-500/30 selection:text-rose-200">
      <Navbar name={name} />

      <main className="flex-1 pb-16">
        <PageHeader
          title="Newspaper Publications &amp; Columns"
          subtitle={`A digital archive of ${articles.length || 5}+ op-eds, educational columns, and press coverage published in regional and national dailies.`}
          badge="Press &amp; Media Archives"
          iconType="newspaper"
          badgeColor="text-rose-400 bg-rose-500/10 border-rose-500/20"
        />

        <NewspaperArticlesSection items={articles} showHeader={false} />
      </main>

      <Footer name={name} />
    </div>
  );
}
