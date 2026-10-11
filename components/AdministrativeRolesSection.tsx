"use client";

import { useState, useMemo } from "react";
import { AdministrativeRoleItem } from "@/lib/types";
import {
  ShieldCheck,
  Search,
  Calendar,
  Briefcase,
  Sparkles,
  Building2,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionWrappers";

interface AdministrativeRolesSectionProps {
  items: AdministrativeRoleItem[];
  showHeader?: boolean;
}

export default function AdministrativeRolesSection({
  items,
  showHeader = true,
}: AdministrativeRolesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const pos = item.position.toLowerCase();
      const start = (item.start_date || "").toLowerCase();
      const end = (item.end_date || "").toLowerCase();
      const resp = (item.responsibilities || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      return (
        pos.includes(query) ||
        start.includes(query) ||
        end.includes(query) ||
        resp.includes(query)
      );
    });
  }, [items, searchQuery]);

  // Helper to format duration string
  const formatDuration = (start?: string | null, end?: string | null) => {
    if (!start && !end) return "Duration not specified";
    if (start && end) return `${start} – ${end}`;
    if (start && !end) return `${start} – Present`;
    return `Until ${end}`;
  };

  const isCurrentRole = (end?: string | null) => {
    if (!end) return true;
    const lower = end.trim().toLowerCase();
    return lower === "present" || lower === "current" || lower === "ongoing" || lower === "continue";
  };

  return (
    <section id="administrative-responsibilities" className="py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Institutional Leadership &amp; Service</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Administrative Responsibilities ({items.length})
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Key leadership, student mentorship, industry liaison, and departmental administrative appointments at National Textile University.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Search Bar */}
        <FadeIn delay={0.05} direction="up">
          <div className="glass-panel p-4 rounded-2xl mb-12 flex items-center justify-between gap-4 border border-white/10 max-w-xl mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by role title, responsibilities, or dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>
          </div>
        </FadeIn>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800">
            <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">
              No administrative responsibilities matched your search criteria.
            </p>
          </div>
        ) : (
          /* Timeline / Card List Layout */
          <div className="relative">
            {/* Timeline Vertical Spine on larger screens */}
            <div className="hidden md:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-sky-500/50 via-indigo-500/30 to-transparent pointer-events-none" />

            <StaggerContainer staggerDelay={0.08} className="space-y-6">
              {filteredItems.map((item, idx) => {
                const durationText = formatDuration(item.start_date, item.end_date);
                const current = isCurrentRole(item.end_date);

                return (
                  <StaggerItem key={item.id || idx}>
                    <div className="relative md:pl-16">
                      {/* Timeline Node Point on Desktop */}
                      <div className="hidden md:flex absolute left-6 top-6 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-950 border-2 border-sky-500 items-center justify-center shadow-lg shadow-sky-500/30 z-10">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      </div>

                      <HoverCard className="p-6 sm:p-7 rounded-2xl glass-card bg-slate-900/50 border border-white/5 space-y-4 hover:border-sky-500/40 hover:bg-slate-900/70 transition-all shadow-xl">
                        {/* Header: Position & Duration */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 shadow-inner">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                                {item.position}
                              </h3>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                <span>National Textile University</span>
                              </div>
                            </div>
                          </div>

                          {/* Duration Badge */}
                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-sky-300 text-xs font-mono font-medium shadow-sm">
                              <Calendar className="w-3.5 h-3.5 text-sky-400" />
                              <span>{durationText}</span>
                            </span>

                            {current && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Active</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Responsibilities Details if present */}
                        {item.responsibilities && (
                          <div className="pt-3 border-t border-slate-800/80 space-y-2">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                              <span>Key Mandate &amp; Responsibilities</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                              {item.responsibilities}
                            </p>
                          </div>
                        )}
                      </HoverCard>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        )}
      </div>
    </section>
  );
}
