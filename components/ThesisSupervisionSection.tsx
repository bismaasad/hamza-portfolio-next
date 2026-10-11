"use client";

import { useState, useMemo } from "react";
import { ThesisSupervisionItem } from "@/lib/types";
import {
  Users,
  Search,
  GraduationCap,
  Award,
  BookOpen,
  UserCheck,
  Sparkles,
  IdCard,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionWrappers";

interface ThesisSupervisionSectionProps {
  items: ThesisSupervisionItem[];
  showHeader?: boolean;
}

export default function ThesisSupervisionSection({
  items,
  showHeader = true,
}: ThesisSupervisionSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All");

  // Normalized helper to categorize degree level
  const getDegreeCategory = (levelStr: string) => {
    const l = (levelStr || "").trim().toUpperCase();
    if (l.includes("PHD") || l.includes("DOCTOR")) return "PhD";
    if (l.includes("MS") || l.includes("MPHIL") || l.includes("MASTER")) return "MS or MPhil";
    if (l.includes("BS") || l.includes("BACHELOR") || l.includes("UNDERGRAD")) return "BS";
    return "MS or MPhil";
  };

  const getRole = (item: ThesisSupervisionItem) => {
    return (item.supervision_role || item.role || "Supervisor").trim();
  };

  const getRegNo = (item: ThesisSupervisionItem) => {
    return (item.registration_number || item.reg_no || "").trim();
  };

  // Filter items by search query and role
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const regNo = getRegNo(item);
      const role = getRole(item);

      const matchSearch =
        item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.thesis_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.degree_level && item.degree_level.toLowerCase().includes(searchQuery.toLowerCase())) ||
        role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole =
        selectedRole === "All" ||
        (selectedRole === "Supervisor" &&
          role.toLowerCase().includes("supervisor") &&
          !role.toLowerCase().includes("co-supervisor")) ||
        (selectedRole === "Co-supervisor" &&
          role.toLowerCase().includes("co-supervisor"));

      return matchSearch && matchRole;
    });
  }, [items, searchQuery, selectedRole]);

  // Split into 3 sections
  const phdItems = useMemo(
    () => filteredItems.filter((i) => getDegreeCategory(i.degree_level) === "PhD"),
    [filteredItems]
  );

  const msItems = useMemo(
    () => filteredItems.filter((i) => getDegreeCategory(i.degree_level) === "MS or MPhil"),
    [filteredItems]
  );

  const bsItems = useMemo(
    () => filteredItems.filter((i) => getDegreeCategory(i.degree_level) === "BS"),
    [filteredItems]
  );

  // Overall counts for summary stats
  const totalPhDCount = useMemo(
    () => items.filter((i) => getDegreeCategory(i.degree_level) === "PhD").length,
    [items]
  );
  const totalMSCount = useMemo(
    () => items.filter((i) => getDegreeCategory(i.degree_level) === "MS or MPhil").length,
    [items]
  );
  const totalBSCount = useMemo(
    () => items.filter((i) => getDegreeCategory(i.degree_level) === "BS").length,
    [items]
  );

  const isCoSupervisor = (roleStr: string) =>
    (roleStr || "").trim().toLowerCase().includes("co-supervisor");

  return (
    <section id="thesis-supervision" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Graduate &amp; Undergraduate Mentorship</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Thesis Supervision ({items.length})
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Supervision and co-supervision of postgraduate and undergraduate researchers in Applied Mathematics, Computational Fluid Dynamics, and Mathematical Modeling.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Stats Summary Bar */}
        <FadeIn delay={0.05} direction="up">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {items.length}
                </div>
                <div className="text-xs text-slate-400 font-medium">Total Theses Supervised</div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {totalPhDCount}
                </div>
                <div className="text-xs text-slate-400 font-medium">PhD Supervision</div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {totalMSCount}
                </div>
                <div className="text-xs text-slate-400 font-medium">MS / MPhil Supervision</div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {totalBSCount}
                </div>
                <div className="text-xs text-slate-400 font-medium">BS Projects Supervised</div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Search & Role Filter Bar */}
        <FadeIn delay={0.1} direction="up">
          <div className="glass-panel p-4 rounded-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by student name, reg. no, or thesis title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>

            {/* Role Filter Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Role:</span>
              {(["All", "Supervisor", "Co-supervisor"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedRole === role
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                      : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {role === "All" ? "All Roles" : role}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Global Empty State */}
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No thesis supervision records matched your criteria.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* ========================================================= */}
            {/* 1. PhD SUPERVISION SECTION                                */}
            {/* ========================================================= */}
            <div className="space-y-6">
              <FadeIn direction="up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                        PhD Thesis Supervision
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold font-mono">
                          {phdItems.length}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Doctoral research supervision in Applied Mathematics &amp; Fluid Mechanics.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {phdItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/20 border border-slate-800/60">
                  <p className="text-xs text-slate-400">No PhD thesis supervision records matching this filter.</p>
                </div>
              ) : (
                <SupervisionTable items={phdItems} isCoSupervisor={isCoSupervisor} />
              )}
            </div>

            {/* ========================================================= */}
            {/* 2. MS / MPHIL SUPERVISION SECTION                         */}
            {/* ========================================================= */}
            <div className="space-y-6 pt-4">
              <FadeIn direction="up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                        MS / MPhil Thesis Supervision
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold font-mono">
                          {msItems.length}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Postgraduate Master&apos;s theses supervised and co-supervised across specialized mathematical domains.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {msItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/20 border border-slate-800/60">
                  <p className="text-xs text-slate-400">No MS / MPhil thesis records matching this filter.</p>
                </div>
              ) : (
                <SupervisionTable items={msItems} isCoSupervisor={isCoSupervisor} />
              )}
            </div>

            {/* ========================================================= */}
            {/* 3. BS SUPERVISION SECTION                                 */}
            {/* ========================================================= */}
            <div className="space-y-6 pt-4">
              <FadeIn direction="up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                        BS Project &amp; Thesis Supervision
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold font-mono">
                          {bsItems.length}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Undergraduate final year projects and Bachelor&apos;s research dissertations.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {bsItems.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/20 border border-slate-800/60">
                  <p className="text-xs text-slate-400">No BS thesis records matching this filter.</p>
                </div>
              ) : (
                <SupervisionTable items={bsItems} isCoSupervisor={isCoSupervisor} />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Responsive Dual-View Component:
 * - Desktop: Clean, glassmorphic data table
 * - Mobile: Staggered interactive glass cards
 */
function SupervisionTable({
  items,
  isCoSupervisor,
}: {
  items: ThesisSupervisionItem[];
  isCoSupervisor: (role: string) => boolean;
}) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl glass-card border border-white/5 bg-slate-900/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-5 text-center w-12">#</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-5">Reg. Number</th>
                <th className="py-4 px-6">Thesis / Research Title</th>
                <th className="py-4 px-5 text-center">Degree</th>
                <th className="py-4 px-6 text-center">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {items.map((item, idx) => {
                const roleStr = (item.supervision_role || item.role || "Supervisor").trim();
                const regNo = (item.registration_number || item.reg_no || "").trim();
                const co = isCoSupervisor(roleStr);
                return (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-indigo-950/20 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-4 px-5 text-center font-mono text-slate-500 font-medium">
                      {idx + 1}
                    </td>

                    {/* Student Name */}
                    <td className="py-4 px-6 font-semibold text-white group-hover:text-teal-300 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium">{item.student_name}</span>
                      </div>
                    </td>

                    {/* Reg Number */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {regNo ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                          <IdCard className="w-3 h-3 text-slate-500" />
                          {regNo}
                        </span>
                      ) : (
                        <span className="text-slate-600 italic">—</span>
                      )}
                    </td>

                    {/* Thesis Title */}
                    <td className="py-4 px-6 text-slate-200 leading-relaxed font-normal">
                      <p className="line-clamp-2">{item.thesis_title}</p>
                    </td>

                    {/* Degree Level */}
                    <td className="py-4 px-5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono font-medium text-[11px] border border-slate-700/60">
                        {item.degree_level}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border shadow-sm ${
                          co
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        {co ? "Co-supervisor" : "Supervisor"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden">
        <StaggerContainer staggerDelay={0.06} className="space-y-4">
          {items.map((item, idx) => {
            const roleStr = (item.supervision_role || item.role || "Supervisor").trim();
            const regNo = (item.registration_number || item.reg_no || "").trim();
            const co = isCoSupervisor(roleStr);
            return (
              <StaggerItem key={item.id || idx}>
                <HoverCard className="p-5 rounded-2xl glass-card bg-slate-900/50 border border-white/5 space-y-3.5 hover:border-teal-500/40 transition-all">
                  {/* Top Bar: Name & Role */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm leading-tight">
                          {item.student_name}
                        </h4>
                        {regNo && (
                          <span className="text-[11px] font-mono text-slate-400">
                            {regNo}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                        co
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      }`}
                    >
                      {co ? "Co-supervisor" : "Supervisor"}
                    </span>
                  </div>

                  {/* Thesis Title */}
                  <div className="pt-1">
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      {item.thesis_title}
                    </p>
                  </div>

                  {/* Footer Meta: Degree Level */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Degree Level</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono font-medium">
                      {item.degree_level}
                    </span>
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </>
  );
}
