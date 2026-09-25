"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSection as HeroType } from "@/lib/types";
import {
  FileText,
  Mail,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Atom,
  Briefcase,
  Image as ImageIcon,
  User,
  ChevronRight,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/MotionWrappers";

interface HeroSectionProps {
  data: HeroType | null;
  totalPublications?: number;
  totalExperienceYears?: number;
}

export function HeroSection({
  data,
  totalPublications = 24,
  totalExperienceYears = 12,
}: HeroSectionProps) {
  const title = data?.title || "Dr. Hamza Khan";
  const subtitle =
    data?.subtitle ||
    "PhD in Mathematical Sciences | Applied Mathematics & Computational Fluid Dynamics";
  const imageUrl = data?.image_url;
  const resumeUrl = data?.resume_url;

  // Extract key topic pills if subtitle has comma-separated fields
  const researchPills = subtitle.includes(",")
    ? subtitle.split(",").map((s) => s.trim()).filter(Boolean)
    : [
        "Applied Mathematics",
        "Adaptive Control Theory",
        "Computational Fluid Dynamics",
        "Fractional Modeling",
      ];

  const exploreRoutes = [
    {
      title: "Biography & Profile",
      subtitle: "Academic journey from Phander to Europe",
      href: "/about",
      icon: User,
      badge: "Biography",
      color: "from-indigo-500/20 to-indigo-900/30",
      border: "border-indigo-500/30",
      textAccent: "text-indigo-400",
    },
    {
      title: "Academic Degrees",
      subtitle: "PhD Suma Cum Laude & M.Phil degrees",
      href: "/education",
      icon: GraduationCap,
      badge: "Qualifications",
      color: "from-cyan-500/20 to-cyan-900/30",
      border: "border-cyan-500/30",
      textAccent: "text-cyan-400",
    },
    {
      title: "Experience & Faculty",
      subtitle: "Assistant Professor & Lecturer appointments",
      href: "/experience",
      icon: Briefcase,
      badge: "Timeline",
      color: "from-purple-500/20 to-purple-900/30",
      border: "border-purple-500/30",
      textAccent: "text-purple-400",
    },
    {
      title: "Research Publications",
      subtitle: `${totalPublications}+ peer-reviewed journal papers`,
      href: "/publications",
      icon: BookOpen,
      badge: "Scholarship",
      color: "from-emerald-500/20 to-emerald-900/30",
      border: "border-emerald-500/30",
      textAccent: "text-emerald-400",
    },
    {
      title: "Photo Gallery",
      subtitle: "Scenic Phander Valley & academic travels",
      href: "/gallery",
      icon: ImageIcon,
      badge: "Memories",
      color: "from-rose-500/20 to-rose-900/30",
      border: "border-rose-500/30",
      textAccent: "text-rose-400",
    },
    {
      title: "Connect & Contact",
      subtitle: "Inquiries, ResearchGate & Scholar profiles",
      href: "/contact",
      icon: Mail,
      badge: "Reach Out",
      color: "from-amber-500/20 to-amber-900/30",
      border: "border-amber-500/30",
      textAccent: "text-amber-400",
    },
  ];

  return (
    <div className="relative pt-32 pb-24 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-20">
        {/* Main Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Availability / Status Pill */}
            <FadeIn direction="down" duration={0.4}>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Available for Academic &amp; Research Collaborations</span>
              </div>
            </FadeIn>

            {/* Main Headline */}
            <FadeIn delay={0.1} direction="up">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                  Hello, I&apos;m{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                    {title}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  {subtitle}
                </p>
              </div>
            </FadeIn>

            {/* Research Fields Tags */}
            <FadeIn delay={0.2} direction="up">
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {researchPills.slice(0, 5).map((pill, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-700/60 text-slate-300 flex items-center gap-1.5 shadow-sm"
                  >
                    <Atom className="w-3.5 h-3.5 text-cyan-400" />
                    {pill}
                  </motion.span>
                ))}
              </div>
            </FadeIn>

            {/* Action Buttons */}
            <FadeIn delay={0.3} direction="up">
              <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start pt-2">
                <Link
                  href="/publications"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Publications</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 shadow-sm transition-all hover:scale-[1.02]"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>About Me</span>
                </Link>

                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>Download CV</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-indigo-400" />
                    <span>Contact</span>
                  </Link>
                )}
              </div>
            </FadeIn>

            {/* Quick Metrics Bar */}
            <FadeIn delay={0.4} direction="up">
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <Link href="/publications" className="group block">
                  <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    {totalPublications}+
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium flex items-center justify-center lg:justify-start gap-1">
                    <span>Research Papers</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </Link>

                <Link href="/education" className="group block">
                  <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    97%
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium flex items-center justify-center lg:justify-start gap-1">
                    <span>PhD Suma Cum Laude</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </Link>

                <Link href="/experience" className="group block">
                  <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    {totalExperienceYears}+ Yrs
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium flex items-center justify-center lg:justify-start gap-1">
                    <span>Teaching &amp; Faculty</span>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Hero Graphic / Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <FadeIn delay={0.2} direction="left">
              <div className="relative w-72 sm:w-80 lg:w-96 aspect-square">
                {/* Outer decorative glowing ring */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 p-[2px] shadow-2xl shadow-indigo-500/20 rotate-1">
                  <div className="w-full h-full bg-[#0d1322] rounded-[22px] overflow-hidden relative flex flex-col items-center justify-center p-6 text-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 384px"
                        priority
                        quality={90}
                      />
                    ) : (
                      <div className="space-y-4 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600/40 to-cyan-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-xl">
                          <GraduationCap className="w-12 h-12" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white">{title}</h2>
                          <p className="text-xs text-indigo-300 mt-0.5 font-medium">
                            PhD in Mathematical Sciences
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">
                            Obuda University Budapest &bull; National Textile University
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-[11px] text-slate-300">
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>HEC International Scholar</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Badge 1: Top Right */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 glass-panel px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Doctoral School</div>
                    <div className="text-xs font-bold text-white">Applied Informatics</div>
                  </div>
                </motion.div>

                {/* Floating Badge 2: Bottom Left */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 glass-panel px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Peer-Reviewed</div>
                    <div className="text-xs font-bold text-white">{totalPublications}+ Articles Published</div>
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Section Navigation Quick Cards */}
        <div className="space-y-8 pt-8 border-t border-slate-800/80">
          <FadeIn direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                Explore Portfolio Pages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Discover Research, Teaching &amp; Scholarly Work
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                Navigate through dedicated pages for comprehensive qualifications, timeline, articles, and contacts.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {exploreRoutes.map((route, idx) => {
              const Icon = route.icon;
              return (
                <StaggerItem key={idx}>
                  <Link href={route.href} className="block h-full">
                    <HoverCard className={`h-full rounded-2xl p-6 bg-gradient-to-b ${route.color} border ${route.border} glass-card flex flex-col justify-between group`}>
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-11 h-11 rounded-xl bg-slate-950/80 border ${route.border} flex items-center justify-center ${route.textAccent} shadow-md group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-950/90 text-slate-300 border border-slate-800">
                            {route.badge}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5">
                          {route.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">
                          {route.subtitle}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                        <span>Open Page</span>
                        <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </HoverCard>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </div>
    </div>
  );
}
