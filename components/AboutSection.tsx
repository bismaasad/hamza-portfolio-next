"use client";

import { motion } from "framer-motion";
import { AboutSection as AboutType } from "@/lib/types";
import {
  CheckCircle2,
  Globe,
  Terminal,
  Cpu,
  Layers,
  Flame,
  Award,
  BookMarked,
  MapPin,
  Sparkles,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionWrappers";

interface AboutSectionProps {
  data: AboutType | null;
  showHeader?: boolean;
}

export default function AboutSection({ data, showHeader = true }: AboutSectionProps) {
  const content =
    data?.content ||
    "Applied Mathematical Researcher with expertise in mathematical sciences, Adaptive Control Theory, Computational Fluid Dynamics, Fractional Modeling and Data Analysis, with several years of experience teaching graduate and postgraduate students.";

  const bioHighlights: string[] = Array.isArray(data?.bio_highlights)
    ? (data?.bio_highlights as string[])
    : [
        "MATLAB",
        "JULIA",
        "LaTeX",
        "MS Office",
        "Visual Basic (Excel)",
        "MINITAB",
        "E.VIEW",
      ];

  const researchDomains = [
    {
      title: "Adaptive Control Theory",
      description: "Nonlinear dynamical systems, stability analysis, and feedback control architectures.",
      icon: Cpu,
      gradient: "from-indigo-500/20 to-indigo-900/30",
      border: "border-indigo-500/30",
      accent: "text-indigo-400",
    },
    {
      title: "Computational Fluid Dynamics",
      description: "Mixed convection, heat transfer simulations, and numerical modeling in square cavities.",
      icon: Flame,
      gradient: "from-cyan-500/20 to-cyan-900/30",
      border: "border-cyan-500/30",
      accent: "text-cyan-400",
    },
    {
      title: "Fractional Modeling",
      description: "Fractional derivative-based numerical solutions and diffusion processes in nonlinear physics.",
      icon: Layers,
      gradient: "from-purple-500/20 to-purple-900/30",
      border: "border-purple-500/30",
      accent: "text-purple-400",
    },
    {
      title: "Applied Mathematical Data Analysis",
      description: "Boundary value problems, perturbation methods, and robust numerical optimization algorithms.",
      icon: Terminal,
      gradient: "from-emerald-500/20 to-emerald-900/30",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
    },
  ];

  const languages = [
    { name: "English", level: "Professional / Academic" },
    { name: "Urdu", level: "Native / Bilingual" },
    { name: "Arabic", level: "Basic Proficiency" },
    { name: "Shina", level: "Native" },
    { name: "Khowar", level: "Native / Regional" },
  ];

  return (
    <section id="about" className="py-12 relative">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Academic Profile &amp; Biography</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                About Dr. Hamza Khan
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Bridging rigorous mathematical theory, computational simulation, and higher education.
              </p>
            </div>
          </FadeIn>
        )}

        {/* Top Story Card */}
        <FadeIn delay={0.1} direction="up">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Narrative */}
              <div className="lg:col-span-8 space-y-5">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                  <BookMarked className="w-4 h-4" />
                  <span>BIOGRAPHICAL SUMMARY</span>
                </div>

                <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{content}</p>
                </div>

                {/* Origin badge */}
                <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Phander Valley, Ghizer, Gilgit-Baltistan</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>HEC International PhD Scholar (Hungary)</span>
                  </div>
                </div>
              </div>

              {/* Right Tools & Software Skills */}
              <div className="lg:col-span-4 bg-slate-950/70 rounded-2xl p-5 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Computational &amp; Tool Stack</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {bioHighlights.length} tools
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {bioHighlights.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/60 text-indigo-300 hover:text-white hover:border-indigo-500/50 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      {skill}
                    </motion.span>
                  ))}
                </div>

                {/* Languages */}
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] bg-slate-900/90 text-slate-300 border border-slate-800"
                        title={lang.level}
                      >
                        <strong className="text-white">{lang.name}</strong>{" "}
                        <span className="text-slate-400 text-[10px]">
                          ({lang.level.split(" ")[0]})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* 4 Research Domain Cards */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {researchDomains.map((domain, idx) => {
            const Icon = domain.icon;
            return (
              <StaggerItem key={idx}>
                <HoverCard
                  className={`h-full rounded-2xl p-6 bg-gradient-to-b ${domain.gradient} border ${domain.border} glass-card flex flex-col justify-between`}
                >
                  <div>
                    <div
                      className={`w-11 h-11 rounded-xl bg-slate-950/80 border ${domain.border} flex items-center justify-center ${domain.accent} mb-4 shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {domain.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {domain.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Specialization</span>
                    <span className={`${domain.accent} font-medium`}>Active Research</span>
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
