"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GalleryItem } from "@/lib/types";
import {
  Image as ImageIcon,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/MotionWrappers";

interface GallerySectionProps {
  items: GalleryItem[];
  showHeader?: boolean;
}

export default function GallerySection({ items, showHeader = true }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Sort by order_index
  const sortedItems = useMemo(() => {
    return [...items].sort(
      (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
    );
  }, [items]);

  // Extract distinct category list
  const categories = useMemo(() => {
    const defaultCategories = ["All", "Gilgit Valley", "NTU Life"];
    const foundCategories = new Set<string>();

    sortedItems.forEach((item) => {
      if (item.category && item.category.trim()) {
        foundCategories.add(item.category.trim());
      }
    });

    return Array.from(new Set([...defaultCategories, ...Array.from(foundCategories)]));
  }, [sortedItems]);

  // Match category helper
  const matchCategory = (item: GalleryItem, category: string) => {
    if (category === "All") return true;

    if (item.category && item.category.trim()) {
      return item.category.trim().toLowerCase() === category.toLowerCase();
    }

    // Fallback classification based on caption if category is null/unspecified
    const caption = (item.caption || "").toLowerCase();
    if (category.toLowerCase() === "gilgit valley") {
      return (
        caption.includes("gilgit") ||
        caption.includes("phander") ||
        caption.includes("baltistan") ||
        caption.includes("valley") ||
        caption.includes("lake") ||
        caption.includes("mountain") ||
        !caption
      );
    }
    if (category.toLowerCase() === "ntu life") {
      return (
        caption.includes("ntu") ||
        caption.includes("textile") ||
        caption.includes("university") ||
        caption.includes("faculty") ||
        caption.includes("campus") ||
        caption.includes("lecture") ||
        caption.includes("conference") ||
        caption.includes("student")
      );
    }

    return false;
  };

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => matchCategory(item, activeCategory));
  }, [sortedItems, activeCategory]);

  const activeItem = selectedIdx !== null ? filteredItems[selectedIdx] : null;

  const handlePrev = () => {
    if (selectedIdx === null || filteredItems.length === 0) return;
    setSelectedIdx((selectedIdx - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    if (selectedIdx === null || filteredItems.length === 0) return;
    setSelectedIdx((selectedIdx + 1) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-12 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Memories &amp; Landscapes</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Photo Gallery
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Snapshots from the scenic Phander Valley (Ghizer, Gilgit-Baltistan), university campus life at NTU, and academic travels.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Category Filter Tabs */}
        <FadeIn delay={0.05} direction="up">
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count =
                cat === "All"
                  ? sortedItems.length
                  : sortedItems.filter((item) => matchCategory(item, cat)).length;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedIdx(null);
                  }}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-indigo-600 to-cyan-600 shadow-lg shadow-indigo-600/25 border border-indigo-400/40 scale-[1.02]"
                      : "text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800">
            <ImageIcon className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">
              No photos found in &ldquo;{activeCategory}&rdquo;.
            </p>
          </div>
        ) : (
          <StaggerContainer
            key={activeCategory}
            staggerDelay={0.06}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item, idx) => (
              <StaggerItem key={item.id || idx}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedIdx(idx)}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/10 cursor-pointer shadow-lg hover:shadow-indigo-500/20"
                >
                  {/* Image */}
                  <Image
                    src={item.image_url}
                    alt={item.caption || `Gallery image ${idx + 1}`}
                    fill
                    priority={idx < 3}
                    quality={85}
                    loading={idx < 3 ? "eager" : "lazy"}
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Hover Zoom Icon */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-105">
                    <ZoomIn className="w-4 h-4 text-cyan-400" />
                  </div>

                  {/* Caption Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.category || "Gilgit-Baltistan"}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight drop-shadow-sm">
                      {item.caption || "Phander Ghizer Gilgit"}
                    </h3>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedIdx !== null && activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedIdx(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer z-50"
              aria-label="Close image modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer z-50"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 border border-white/20 text-white flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer z-50"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Content Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950">
                <Image
                  src={activeItem.image_url}
                  alt={activeItem.caption || "Gallery full image"}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {(activeItem.caption || activeItem.category) && (
                <div className="mt-4 px-6 py-2.5 rounded-full bg-slate-900/90 border border-white/10 text-white text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>
                    {activeItem.caption || activeItem.category || "Gallery Image"}
                  </span>
                  {activeItem.category && activeItem.caption && (
                    <span className="text-[11px] text-cyan-300 font-mono ml-1 px-2 py-0.5 rounded-md bg-slate-800">
                      {activeItem.category}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
