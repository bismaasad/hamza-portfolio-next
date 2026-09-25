"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Sparkles,
  GraduationCap,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Mail,
} from "lucide-react";
import { FadeIn } from "@/components/MotionWrappers";

export type IconType =
  | "about"
  | "education"
  | "experience"
  | "publications"
  | "gallery"
  | "contact";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge: string;
  iconType?: IconType;
  badgeColor?: string;
}

const iconMap = {
  about: Sparkles,
  education: GraduationCap,
  experience: Briefcase,
  publications: BookOpen,
  gallery: ImageIcon,
  contact: Mail,
};

export function PageHeader({
  title,
  subtitle,
  badge,
  iconType = "about",
  badgeColor = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
}: PageHeaderProps) {
  const Icon = iconMap[iconType] || Sparkles;

  return (
    <div className="relative pt-32 pb-12 mb-8 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn direction="down" duration={0.4}>
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 mb-6 shadow-inner">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 font-medium">{title}</span>
          </nav>
        </FadeIn>

        <FadeIn delay={0.1} direction="up">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-4 ${badgeColor}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
