"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AchievementItem } from "@/lib/types";
import {
  Award,
  Calendar,
  Search,
  Trophy,
  Sparkles,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/MotionWrappers";

interface AchievementsSectionProps {
  items: AchievementItem[];
  showHeader?: boolean;
}

export default function AchievementsSection({
  items,
  showHeader = true,
}: AchievementsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  // Extract distinct years for quick filter tabs
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    sortedItems.forEach((item) => {
      if (item.year && item.year.trim()) {
        yearsSet.add(item.year.trim());
      }
    });
    const sorted = Array.from(yearsSet).sort((a, b) => {
      // Sort numeric years descending if possible
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
      return a.localeCompare(b);
    });
    return ["All", ...sorted];
  }, [sortedItems]);

  // Filter items by search query and selected year
  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.year && item.year.toLowerCase().includes(q));

      const matchYear =
        selectedYear === "All" ||
        (item.year && item.year.trim() === selectedYear);

      return matchSearch && matchYear;
    });
  }, [sortedItems, searchQuery, selectedYear]);

  // Lightbox items (those that have image_url)
  const imageItems = useMemo(() => {
    return filteredItems.filter((item) => Boolean(item.image_url));
  }, [filteredItems]);

  const activeLightboxItem =
    lightboxIndex !== null && imageItems[lightboxIndex]
      ? imageItems[lightboxIndex]
      : null;

  const handleOpenLightbox = (item: AchievementItem) => {
    const idx = imageItems.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handlePrevLightbox = useCallback(() => {
    if (lightboxIndex === null || imageItems.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + imageItems.length) % imageItems.length);
  }, [lightboxIndex, imageItems.length]);

  const handleNextLightbox = useCallback(() => {
    if (lightboxIndex === null || imageItems.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % imageItems.length);
  }, [lightboxIndex, imageItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrevLightbox();
      if (e.key === "ArrowRight") handleNextLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handlePrevLightbox, handleNextLightbox]);

  return (
    <section id="achievements" className="py-12 relative">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" />
                <span>Honors &amp; Recognition</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Honors &amp; Achievements ({items.length})
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                National and international merit scholarships, doctoral distinctions, research fellowships, and academic accolades.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Search & Year Filter Toolbar */}
        <FadeIn delay={0.05} direction="up">
          <div className="glass-panel p-4 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search awards by title, year, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Year Badges */}
            {availableYears.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedYear === year
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold shadow-md shadow-amber-500/20"
                        : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {year === "All" ? "All Years" : year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <FadeIn direction="up">
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No achievements found</h3>
              <p className="text-xs text-slate-400">
                {searchQuery || selectedYear !== "All"
                  ? "No awards or honors matched your current search filters."
                  : "No achievements have been added yet."}
              </p>
              {(searchQuery || selectedYear !== "All") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedYear("All");
                  }}
                  className="mt-2 text-xs font-semibold text-amber-400 hover:underline cursor-pointer"
                >
                  Clear search filters
                </button>
              )}
            </div>
          </FadeIn>
        ) : (
          /* Animated Cards Grid */
          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, idx) => {
              return (
                <StaggerItem key={item.id || idx}>
                  <HoverCard className="h-full rounded-2xl p-6 glass-card bg-slate-900/60 border border-white/10 flex flex-col justify-between group hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all">
                    <div className="space-y-4">
                      {/* Top Header: Award Icon Badge & Year */}
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        {/* Award Icon Pill */}
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10 group-hover:scale-105 group-hover:bg-amber-500/30 group-hover:border-amber-500/50 transition-all">
                            <Award className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
                          </div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 font-mono">
                            Honor
                          </span>
                        </div>

                        {/* Year Badge */}
                        {item.year && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold font-mono shadow-sm">
                            <Calendar className="w-3 h-3 text-amber-400" />
                            <span>{item.year}</span>
                          </span>
                        )}
                      </div>

                      {/* Image Thumbnail Preview (if present) */}
                      {item.image_url && (
                        <div
                          onClick={() => handleOpenLightbox(item)}
                          className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-white/10 group/img cursor-pointer hover:border-amber-500/40 transition-all shadow-inner"
                        >
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3">
                            <span className="text-[11px] text-white font-medium flex items-center gap-1.5 drop-shadow">
                              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                              <span>View Certificate</span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Achievement Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {/* Description */}
                      {item.description && (
                        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed whitespace-pre-line font-normal">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Card Footer Status */}
                    <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400/80" />
                        <span>Academic Excellence</span>
                      </span>

                      {item.image_url ? (
                        <button
                          type="button"
                          onClick={() => handleOpenLightbox(item)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                          <span>Certificate</span>
                          <ZoomIn className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Official Award
                        </span>
                      )}
                    </div>
                  </HoverCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>

      {/* Fullscreen Certificate / Image Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900/95 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-slate-950/70">
                <div className="flex items-center gap-2.5 min-w-0 pr-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm truncate">
                    {activeLightboxItem.title}
                  </h4>
                </div>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Close image preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Display */}
              <div className="relative aspect-video max-h-[70vh] w-full bg-black flex items-center justify-center overflow-hidden">
                <Image
                  src={activeLightboxItem.image_url!}
                  alt={activeLightboxItem.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />

                {/* Navigation arrows if multiple images */}
                {imageItems.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevLightbox();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all cursor-pointer hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextLightbox();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all cursor-pointer hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Footer Bar */}
              <div className="px-5 py-3 bg-slate-950/80 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  {activeLightboxItem.year && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono font-semibold text-[11px]">
                      {activeLightboxItem.year}
                    </span>
                  )}
                  <span className="text-slate-400 line-clamp-1 text-[11px]">
                    {activeLightboxItem.description || activeLightboxItem.title}
                  </span>
                </div>

                <a
                  href={activeLightboxItem.image_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px] font-medium transition-colors shrink-0 ml-4"
                >
                  <span>Open Full Resolution</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
