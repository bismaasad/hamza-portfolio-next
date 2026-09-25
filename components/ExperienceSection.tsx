"use client";

import { ExperienceItem } from "@/lib/types";
import { Briefcase, Calendar, Building, ChevronRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionWrappers";

interface ExperienceSectionProps {
  items: ExperienceItem[];
  showHeader?: boolean;
}

const defaultExperienceItems: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Assistant Professor",
    company: "National Textile University Faisalabad",
    duration: "2023 - Present",
    description:
      "Instruction in undergraduate and postgraduate Mathematics, Curriculum Design and Research Supervision.",
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "exp-2",
    role: "Lecturer",
    company: "National Textile University Karachi Campus",
    duration: "2020 - 2023",
    description:
      "Instruction in undergraduate and postgraduate Mathematics, Curriculum Design and Research Supervision.",
    order_index: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "exp-3",
    role: "Senior Instructor of Mathematics",
    company: "F.G. Public Colleges Jutial Gilgit",
    duration: "2018 - 2020",
    description:
      "Taught Mathematics at intermediate and college level, prepared course content and assessments.",
    order_index: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "exp-4",
    role: "Lecturer",
    company: "Army Public College Gilgit",
    duration: "2016 - 2018",
    description: "Taught Mathematics courses at college level.",
    order_index: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function getRoleDescription(item: ExperienceItem): string {
  const role = item.role?.toLowerCase() || "";
  const company = item.company?.toLowerCase() || "";

  // 1. Senior Instructor of Mathematics at F.G. Public Colleges Jutial Gilgit
  if (
    company.includes("jutial") ||
    company.includes("f.g.") ||
    role.includes("senior instructor")
  ) {
    return "Taught Mathematics at intermediate and college level, prepared course content and assessments.";
  }

  // 2. Lecturer at Army Public College Gilgit
  if (
    company.includes("army public") ||
    (company.includes("gilgit") && role.includes("lecturer"))
  ) {
    return "Taught Mathematics courses at college level.";
  }

  // 3. Assistant Professor at NTU Faisalabad / Lecturer at NTU Karachi Campus
  if (
    company.includes("textile") ||
    company.includes("ntu") ||
    role.includes("assistant professor") ||
    role.includes("lecturer")
  ) {
    return "Instruction in undergraduate and postgraduate Mathematics, Curriculum Design and Research Supervision.";
  }

  // Return custom database description or standard university default
  return (
    item.description?.trim() ||
    "Instruction in undergraduate and postgraduate Mathematics, Curriculum Design and Research Supervision."
  );
}

export default function ExperienceSection({
  items,
  showHeader = true,
}: ExperienceSectionProps) {
  const displayItems = items && items.length > 0 ? items : defaultExperienceItems;

  // Sort by order_index ascending
  const sortedItems = [...displayItems].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  return (
    <section id="experience" className="py-12 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Academic Appointments</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Teaching &amp; Professional Experience
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Over a decade of academic lectureships, university faculty roles, and mathematical research instruction.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Timeline List */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Center/Side Line */}
          <div className="hidden sm:block absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent" />

          <StaggerContainer staggerDelay={0.15} className="space-y-8">
            {sortedItems.map((item, idx) => {
              const isCurrent =
                item.duration.toLowerCase().includes("present") ||
                item.duration.toLowerCase().includes("current");
              const descriptionText = getRoleDescription(item);

              return (
                <StaggerItem key={item.id || idx}>
                  <div className="relative flex flex-col sm:flex-row items-start gap-6 group">
                    {/* Timeline Icon / Dot */}
                    <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-[#090d16] border-2 border-indigo-500/50 items-center justify-center text-indigo-400 shrink-0 z-10 shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:border-indigo-400 transition-transform">
                      <Briefcase className="w-6 h-6" />
                    </div>

                    {/* Content Card */}
                    <HoverCard
                      className={`w-full rounded-3xl p-6 sm:p-7 glass-card flex-1 ${
                        isCurrent
                          ? "bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/40 border-indigo-500/40 shadow-xl shadow-indigo-500/10"
                          : "bg-slate-900/40 border-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap pb-3 border-b border-slate-800/80">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                              {item.role}
                            </h3>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Current Position
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-indigo-400 text-xs sm:text-sm font-semibold mt-1">
                            <Building className="w-4 h-4 shrink-0" />
                            <span>{item.company}</span>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.duration}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-start gap-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{descriptionText}</span>
                      </div>
                    </HoverCard>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
