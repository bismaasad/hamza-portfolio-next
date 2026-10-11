"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NewspaperArticleItem } from "@/lib/types";
import { isUrduText } from "@/lib/utils";
import {
  Newspaper,
  Calendar,
  User,
  Search,
  ZoomIn,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Type,
} from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/MotionWrappers";

interface NewspaperArticlesSectionProps {
  items: NewspaperArticleItem[];
  showHeader?: boolean;
}

export default function NewspaperArticlesSection({
  items,
  showHeader = true,
}: NewspaperArticlesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNewspaper, setSelectedNewspaper] = useState<string>("All");

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Reading View Modal State
  const [readingArticle, setReadingArticle] =
    useState<NewspaperArticleItem | null>(null);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [copied, setCopied] = useState(false);

  // Sort items by order_index ascending, then created_at descending
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const orderA = a.order_index ?? 0;
      const orderB = b.order_index ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [items]);

  // Extract distinct newspaper names for filter tabs
  const newspapers = useMemo(() => {
    const set = new Set<string>();
    sortedItems.forEach((item) => {
      if (item.newspaper_name && item.newspaper_name.trim()) {
        set.add(item.newspaper_name.trim());
      }
    });
    return ["All", ...Array.from(set)];
  }, [sortedItems]);

  // Filter items by search query and newspaper
  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.newspaper_name.toLowerCase().includes(q) ||
        (item.publish_date && item.publish_date.toLowerCase().includes(q)) ||
        (item.author_byline && item.author_byline.toLowerCase().includes(q)) ||
        (item.article_text && item.article_text.toLowerCase().includes(q));

      const matchPaper =
        selectedNewspaper === "All" ||
        (item.newspaper_name &&
          item.newspaper_name.trim() === selectedNewspaper);

      return matchSearch && matchPaper;
    });
  }, [sortedItems, searchQuery, selectedNewspaper]);

  // Items with images for lightbox cycling
  const imageItems = useMemo(() => {
    return filteredItems.filter((item) => Boolean(item.image_url));
  }, [filteredItems]);

  const activeLightboxItem =
    lightboxIndex !== null && imageItems[lightboxIndex]
      ? imageItems[lightboxIndex]
      : null;

  const handleOpenLightbox = (item: NewspaperArticleItem) => {
    const idx = imageItems.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handlePrevLightbox = useCallback(() => {
    if (lightboxIndex === null || imageItems.length === 0) return;
    setLightboxIndex(
      (lightboxIndex - 1 + imageItems.length) % imageItems.length
    );
  }, [lightboxIndex, imageItems.length]);

  const handleNextLightbox = useCallback(() => {
    if (lightboxIndex === null || imageItems.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % imageItems.length);
  }, [lightboxIndex, imageItems.length]);

  // Keyboard navigation for lightbox & reader modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowLeft") handlePrevLightbox();
        if (e.key === "ArrowRight") handleNextLightbox();
      } else if (readingArticle !== null) {
        if (e.key === "Escape") setReadingArticle(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, readingArticle, handlePrevLightbox, handleNextLightbox]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Font size classes for reader
  const readerFontSizeClass = {
    sm: "text-sm leading-relaxed",
    base: "text-base sm:text-lg leading-loose",
    lg: "text-lg sm:text-xl leading-loose",
    xl: "text-xl sm:text-2xl leading-loose",
  }[fontSize];

  return (
    <section id="newspaper-publications" className="py-12 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <Newspaper className="w-3.5 h-3.5" />
                <span>Media &amp; Press Archives</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Newspaper Publications &amp; Columns ({items.length})
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Featured op-eds, columns, and analytical articles published in leading national dailies including Daily K2, Daily Ausaf, Daily Baad-e-Shimal, and more.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Search & Newspaper Filter Toolbar */}
        <FadeIn delay={0.05} direction="up">
          <div className="glass-panel p-4 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by article title, newspaper, date, or text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>

            {/* Newspaper Tabs */}
            {newspapers.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {newspapers.map((paper) => {
                  const isSelected = selectedNewspaper === paper;
                  const count =
                    paper === "All"
                      ? sortedItems.length
                      : sortedItems.filter(
                          (i) => i.newspaper_name?.trim() === paper
                        ).length;

                  return (
                    <button
                      key={paper}
                      onClick={() => setSelectedNewspaper(paper)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold shadow-md shadow-rose-600/25 border border-rose-500/40"
                          : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      <span className={isUrduText(paper) ? "font-urdu-naskh" : ""}>
                        {paper === "All" ? "All Newspapers" : paper}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <FadeIn direction="up">
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No articles found</h3>
              <p className="text-xs text-slate-400">
                {searchQuery || selectedNewspaper !== "All"
                  ? "No newspaper articles matched your search filters."
                  : "No newspaper articles have been published yet."}
              </p>
              {(searchQuery || selectedNewspaper !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedNewspaper("All");
                  }}
                  className="mt-2 text-xs font-semibold text-rose-400 hover:underline cursor-pointer"
                >
                  Clear search filters
                </button>
              )}
            </div>
          </FadeIn>
        ) : (
          /* Cards Grid */
          <StaggerContainer
            staggerDelay={0.07}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((article, idx) => {
              const isUrduTitle = isUrduText(article.title);
              const isUrduPaper = isUrduText(article.newspaper_name);
              const isUrduByline = isUrduText(article.author_byline);
              const hasText = Boolean(article.article_text?.trim());

              return (
                <StaggerItem key={article.id || idx}>
                  <HoverCard className="h-full rounded-2xl p-5 sm:p-6 glass-card bg-slate-900/60 border border-white/10 flex flex-col justify-between group hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-500/10 transition-all">
                    <div className="space-y-4">
                      {/* Clipping Image Thumbnail */}
                      {article.image_url ? (
                        <div
                          onClick={() => handleOpenLightbox(article)}
                          className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 group/img cursor-pointer hover:border-rose-500/40 transition-all shadow-inner"
                        >
                          <Image
                            src={article.image_url}
                            alt={article.title}
                            fill
                            className="object-cover object-top group-hover/img:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          {/* Top clipping overlay banner */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-rose-300">
                            <Newspaper className="w-3 h-3 text-rose-400" />
                            <span className={isUrduPaper ? "font-urdu-naskh" : ""}>
                              {article.newspaper_name}
                            </span>
                          </div>

                          {/* Hover Zoom Prompt */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3">
                            <span className="text-[11px] text-white font-medium flex items-center gap-1.5 drop-shadow">
                              <ZoomIn className="w-3.5 h-3.5 text-rose-400" />
                              <span>View Clipping Scan</span>
                            </span>
                            <span className="text-[10px] bg-rose-600/90 text-white px-2 py-0.5 rounded-md font-mono">
                              Zoom
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Placeholder Header if no clipping image */
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold">
                            <Newspaper className="w-3.5 h-3.5 text-rose-400" />
                            <span className={isUrduPaper ? "font-urdu-naskh" : ""}>
                              {article.newspaper_name}
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Metadata: Date & Byline */}
                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-slate-400 pt-1">
                        {article.publish_date && (
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                            <Calendar className="w-3.5 h-3.5 text-rose-400" />
                            <span>{article.publish_date}</span>
                          </span>
                        )}

                        {article.author_byline && (
                          <span
                            dir={isUrduByline ? "rtl" : "ltr"}
                            className={`inline-flex items-center gap-1 text-[11px] text-slate-400 ${
                              isUrduByline ? "font-urdu-naskh" : ""
                            }`}
                          >
                            <User className="w-3 h-3 text-slate-500" />
                            <span>{article.author_byline}</span>
                          </span>
                        )}
                      </div>

                      {/* Article Title */}
                      <h3
                        dir={isUrduTitle ? "rtl" : "ltr"}
                        className={`text-base sm:text-lg font-bold text-white group-hover:text-rose-300 transition-colors ${
                          isUrduTitle
                            ? "font-urdu leading-[2.1] text-right"
                            : "leading-snug"
                        }`}
                      >
                        {article.title}
                      </h3>

                      {/* Article Text Excerpt (if present) */}
                      {article.article_text && (
                        <p
                          dir={isUrduText(article.article_text) ? "rtl" : "ltr"}
                          className={`text-xs sm:text-sm text-slate-300/85 line-clamp-3 ${
                            isUrduText(article.article_text)
                              ? "font-urdu leading-[2.0] text-right"
                              : "leading-relaxed"
                          }`}
                        >
                          {article.article_text}
                        </p>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                      {/* Left: Newspaper Badge */}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Newspaper className="w-3 h-3 text-rose-400" />
                        <span className={isUrduPaper ? "font-urdu-naskh" : ""}>
                          {article.newspaper_name}
                        </span>
                      </span>

                      {/* Right: Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Clipping Scan Link */}
                        {article.image_url && (
                          <button
                            type="button"
                            onClick={() => handleOpenLightbox(article)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                            title="View Newspaper Scan"
                          >
                            <ZoomIn className="w-3.5 h-3.5 text-rose-400" />
                            <span>Scan</span>
                          </button>
                        )}

                        {/* Read Article View Button */}
                        {hasText && (
                          <button
                            type="button"
                            onClick={() => setReadingArticle(article)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-md shadow-rose-600/20 border border-rose-400/30 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read Article</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </HoverCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. NEWSPAPER CLIPPING LIGHTBOX MODAL                      */}
      {/* ========================================================= */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[92vh] bg-slate-900/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-slate-950/80 shrink-0">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      dir={isUrduText(activeLightboxItem.title) ? "rtl" : "ltr"}
                      className={`font-bold text-white text-sm truncate ${
                        isUrduText(activeLightboxItem.title) ? "font-urdu-naskh" : ""
                      }`}
                    >
                      {activeLightboxItem.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="text-rose-400 font-medium">
                        {activeLightboxItem.newspaper_name}
                      </span>
                      {activeLightboxItem.publish_date && (
                        <>
                          <span>&bull;</span>
                          <span>{activeLightboxItem.publish_date}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Switch to Reading View if text exists */}
                  {activeLightboxItem.article_text && (
                    <button
                      onClick={() => {
                        const cur = activeLightboxItem;
                        setLightboxIndex(null);
                        setReadingArticle(cur);
                      }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 border border-slate-700 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Reading View</span>
                    </button>
                  )}

                  <button
                    onClick={() => setLightboxIndex(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Close lightbox"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image View Container */}
              <div className="relative flex-1 min-h-[50vh] max-h-[72vh] w-full bg-black/90 flex items-center justify-center overflow-auto p-2">
                <div className="relative w-full h-full min-h-[450px]">
                  <Image
                    src={activeLightboxItem.image_url!}
                    alt={activeLightboxItem.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1400px) 100vw, 1400px"
                    priority
                  />
                </div>

                {/* Left / Right navigation */}
                {imageItems.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevLightbox();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 transition-all cursor-pointer hover:scale-110 shadow-lg"
                      aria-label="Previous article clipping"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextLightbox();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/10 transition-all cursor-pointer hover:scale-110 shadow-lg"
                      aria-label="Next article clipping"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Footer Bar */}
              <div className="px-4 sm:px-6 py-3 bg-slate-950/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {activeLightboxItem.author_byline || "Dr. Hamza Khan"}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Image {lightboxIndex! + 1} of {imageItems.length}
                  </span>
                </div>

                <a
                  href={activeLightboxItem.image_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors shrink-0"
                >
                  <span>Open Full Resolution Scan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 2. CLEAN READING VIEW MODAL (URDU RTL & TYPOGRAPHY)       */}
      {/* ========================================================= */}
      <AnimatePresence>
        {readingArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setReadingArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] bg-[#0c111d] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Reader Header Toolbar */}
              <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-slate-950/90 shrink-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 font-semibold">
                    {readingArticle.newspaper_name}
                  </span>
                  {readingArticle.publish_date && (
                    <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                      {readingArticle.publish_date}
                    </span>
                  )}
                </div>

                {/* Reader Controls: Font Size, Copy, Lightbox switch, Close */}
                <div className="flex items-center gap-2">
                  {/* Font Size Selector */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs text-slate-400">
                    <button
                      onClick={() => setFontSize("sm")}
                      className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                        fontSize === "sm" ? "bg-rose-600 text-white" : "hover:text-white"
                      }`}
                      title="Small font"
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setFontSize("base")}
                      className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                        fontSize === "base" ? "bg-rose-600 text-white" : "hover:text-white"
                      }`}
                      title="Medium font"
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize("lg")}
                      className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                        fontSize === "lg" ? "bg-rose-600 text-white" : "hover:text-white"
                      }`}
                      title="Large font"
                    >
                      A+
                    </button>
                    <button
                      onClick={() => setFontSize("xl")}
                      className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                        fontSize === "xl" ? "bg-rose-600 text-white" : "hover:text-white"
                      }`}
                      title="Extra large font"
                    >
                      A++
                    </button>
                  </div>

                  {/* Copy Button */}
                  {readingArticle.article_text && (
                    <button
                      onClick={() => handleCopyText(readingArticle.article_text!)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                      title="Copy article text"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* View Clipping Scan Button */}
                  {readingArticle.image_url && (
                    <button
                      onClick={() => {
                        const cur = readingArticle;
                        setReadingArticle(null);
                        handleOpenLightbox(cur);
                      }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
                      title="View original scanned clipping"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-rose-400" />
                      <span>View Scan</span>
                    </button>
                  )}

                  {/* Close Reader */}
                  <button
                    onClick={() => setReadingArticle(null)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors ml-1"
                    aria-label="Close reading view"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reader Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
                {/* Article Header */}
                <div
                  dir={isUrduText(readingArticle.title) ? "rtl" : "ltr"}
                  className="space-y-3 pb-6 border-b border-slate-800"
                >
                  <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold font-mono">
                    <Newspaper className="w-4 h-4" />
                    <span>{readingArticle.newspaper_name}</span>
                    {readingArticle.publish_date && (
                      <>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-slate-400 font-sans">
                          {readingArticle.publish_date}
                        </span>
                      </>
                    )}
                  </div>

                  <h1
                    className={`font-extrabold text-white tracking-tight ${
                      isUrduText(readingArticle.title)
                        ? "font-urdu text-2xl sm:text-3xl leading-[2.2] text-right"
                        : "text-2xl sm:text-3xl leading-snug text-left"
                    }`}
                  >
                    {readingArticle.title}
                  </h1>

                  {readingArticle.author_byline && (
                    <p
                      dir={isUrduText(readingArticle.author_byline) ? "rtl" : "ltr"}
                      className={`text-sm text-slate-400 flex items-center gap-2 ${
                        isUrduText(readingArticle.author_byline)
                          ? "font-urdu-naskh text-right"
                          : ""
                      }`}
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>{readingArticle.author_byline}</span>
                    </p>
                  )}
                </div>

                {/* Article Body Text */}
                <div
                  dir={
                    isUrduText(readingArticle.article_text) ? "rtl" : "ltr"
                  }
                  className={`text-slate-200 whitespace-pre-line ${
                    isUrduText(readingArticle.article_text)
                      ? "font-urdu text-right"
                      : "text-left font-sans"
                  } ${readerFontSizeClass}`}
                >
                  {readingArticle.article_text}
                </div>
              </div>

              {/* Reader Footer */}
              <div className="px-6 py-3.5 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Type className="w-3.5 h-3.5" />
                  <span>
                    {isUrduText(readingArticle.article_text)
                      ? "اردو رسم الخط (Nastaliq & Naskh Typography)"
                      : "English Article Text"}
                  </span>
                </span>

                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs font-semibold cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
