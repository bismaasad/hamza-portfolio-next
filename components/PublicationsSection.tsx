"use client";

import { useState, useMemo } from "react";
import { PublicationItem } from "@/lib/types";
import {
  BookOpen,
  ExternalLink,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionWrappers";

interface PublicationsSectionProps {
  items: PublicationItem[];
  showHeader?: boolean;
}

export default function PublicationsSection({
  items,
  showHeader = true,
}: PublicationsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(12);

  // Extract unique publishers
  const publishers = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => {
      if (p.publisher) set.add(p.publisher.trim());
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((pub) => {
      const matchSearch =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pub.publisher &&
          pub.publisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pub.year && pub.year.includes(searchQuery));

      const matchPublisher =
        selectedPublisher === "All" ||
        (pub.publisher && pub.publisher.trim() === selectedPublisher);

      return matchSearch && matchPublisher;
    });
  }, [items, searchQuery, selectedPublisher]);

  const visibleList = filteredItems.slice(0, visibleCount);

  return (
    <section id="publications" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Peer-Reviewed Scholarship</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Research Publications ({items.length})
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                International journal publications spanning Computational Fluid Dynamics, Adaptive Control Theory, and Mathematical Modeling.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Search & Filter Bar */}
        <FadeIn delay={0.1} direction="up">
          <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by title, journal, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Publisher Quick Badges */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {publishers.slice(0, 7).map((pub) => (
                <button
                  key={pub}
                  onClick={() => setSelectedPublisher(pub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedPublisher === pub
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {pub}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Publications Grid */}
        {visibleList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No publications matched your search criteria.</p>
          </div>
        ) : (
          <StaggerContainer
            staggerDelay={0.06}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleList.map((pub, idx) => (
              <StaggerItem key={pub.id || idx}>
                <HoverCard className="h-full rounded-2xl p-6 glass-card bg-slate-900/50 border border-white/5 flex flex-col justify-between group hover:border-indigo-500/40 transition-all">
                  <div className="space-y-4">
                    {/* Top Metadata: Year & Publisher */}
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      {pub.year ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold font-mono">
                          <Calendar className="w-3 h-3" />
                          {pub.year}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 font-mono">
                          Published
                        </span>
                      )}

                      {pub.publisher && (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-[11px] font-medium truncate max-w-[180px]">
                          {pub.publisher}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-3">
                      {pub.title}
                    </h3>

                    {/* Description / Abstract snippet if available */}
                    {pub.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {pub.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Peer-Reviewed Paper
                    </span>

                    {pub.link ? (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/40 shadow-sm transition-all hover:scale-[1.03]"
                      >
                        <span>Read Paper</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Journal Article</span>
                    )}
                  </div>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* View More / View Less Button */}
        {filteredItems.length > 12 && (
          <FadeIn delay={0.2} direction="up">
            <div className="mt-10 text-center">
              {visibleCount < filteredItems.length ? (
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 12, filteredItems.length))}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 shadow-lg transition-all cursor-pointer hover:border-slate-600"
                >
                  <span>Show More Publications ({filteredItems.length - visibleCount} remaining)</span>
                  <ChevronDown className="w-4 h-4 text-indigo-400" />
                </button>
              ) : (
                <button
                  onClick={() => setVisibleCount(12)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 shadow-lg transition-all cursor-pointer"
                >
                  <span>Collapse List</span>
                  <ChevronUp className="w-4 h-4 text-indigo-400" />
                </button>
              )}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
