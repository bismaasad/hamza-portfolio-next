"use client";

import { EducationItem } from "@/lib/types";
import { GraduationCap, Calendar, Building, Award, CheckCircle2 } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionWrappers";

interface EducationSectionProps {
  items: EducationItem[];
  showHeader?: boolean;
}

export default function EducationSection({ items, showHeader = true }: EducationSectionProps) {
  // Sort by order_index ascending
  const sortedItems = [...items].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  return (
    <section id="education" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academic Qualifications</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Education &amp; Degrees
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Academic foundation in Mathematical Sciences and Information Science from premier international institutions.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Timeline / Grid of Education Cards */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {sortedItems.map((item, idx) => {
            const isPhD =
              item.degree.toLowerCase().includes("phd") ||
              item.degree.toLowerCase().includes("doctor");

            return (
              <StaggerItem key={item.id || idx}>
                <HoverCard
                  className={`h-full rounded-3xl p-6 sm:p-7 glass-card relative overflow-hidden flex flex-col justify-between ${
                    isPhD
                      ? "bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950/80 border-indigo-500/40 shadow-xl shadow-indigo-500/10"
                      : "bg-slate-900/50 border-white/5"
                  }`}
                >
                  {/* Top Row: Year & PhD badge */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-cyan-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.year}</span>
                      </div>

                      {isPhD && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold shadow-sm">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>Doctoral Degree</span>
                        </span>
                      )}
                    </div>

                    {/* Degree Title */}
                    <div className="space-y-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                        {item.degree}
                      </h3>

                      {/* Institute */}
                      <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                        <Building className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{item.institute}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description & Honors */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                    {item.description ? (
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{item.description}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        Mathematical Sciences &amp; Education Curriculum
                      </div>
                    )}
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
