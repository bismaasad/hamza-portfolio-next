"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  GraduationCap,
  Sparkles,
  BookOpen,
  Briefcase,
  Image as ImageIcon,
  Mail,
  Home,
  Users,
  ShieldCheck,
  Award,
  Newspaper,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  name?: string;
}

export function Navbar({ name = "Dr. Hamza Khan" }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown and mobile menu on outside click or route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/about", icon: Sparkles },
    { label: "Education", href: "/education", icon: GraduationCap },
    { label: "Experience", href: "/experience", icon: Briefcase },
    { label: "Publications", href: "/publications", icon: BookOpen },
    { label: "Gallery", href: "/gallery", icon: ImageIcon },
  ];

  const moreLinks = [
    {
      label: "Thesis Supervision",
      href: "/thesis-supervision",
      icon: Users,
      badge: "Mentorship",
      description: "PhD, MS & BS student supervision",
    },
    {
      label: "Responsibilities",
      href: "/administrative-responsibilities",
      icon: ShieldCheck,
      badge: "Service",
      description: "Administrative duties & committees",
    },
    {
      label: "Achievements",
      href: "/achievements",
      icon: Award,
      badge: "Honors",
      description: "Awards, fellowships & distinctions",
    },
    {
      label: "Newspaper Publications",
      href: "/newspaper-publications",
      icon: Newspaper,
      badge: "Press",
      description: "Urdu columns & press coverage",
    },
  ];

  const isMoreActive = moreLinks.some((item) =>
    pathname.startsWith(item.href)
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#090d16]/85 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/30 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
              <span className="text-sm font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                HK
              </span>
            </div>
          </div>
          <div>
            <span className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors block leading-tight">
              {name}
            </span>
            <span className="text-[11px] font-medium text-slate-400 block tracking-wide">
              Academic &amp; Researcher
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 glass-panel px-2.5 py-1.5 rounded-full border border-white/10 shadow-inner relative">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/40 via-indigo-500/30 to-cyan-600/40 border border-indigo-500/40 shadow-sm shadow-indigo-500/20 -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* "More" Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              onMouseEnter={() => setMoreDropdownOpen(true)}
              className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                isMoreActive
                  ? "text-white font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
              }`}
              aria-expanded={moreDropdownOpen}
            >
              {isMoreActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/40 via-indigo-500/30 to-cyan-600/40 border border-indigo-500/40 shadow-sm shadow-indigo-500/20 -z-10"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <span>More</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  moreDropdownOpen ? "rotate-180 text-indigo-400" : ""
                }`}
              />
            </button>

            {/* Dropdown Card */}
            <AnimatePresence>
              {moreDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onMouseLeave={() => setMoreDropdownOpen(false)}
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#0a0f1d]/95 backdrop-blur-xl border border-white/10 p-2 shadow-2xl shadow-black/80 z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5 mb-1">
                    Specialized Sections
                  </div>
                  {moreLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl text-xs transition-all group ${
                          isActive
                            ? "bg-indigo-600/20 border border-indigo-500/40 text-white"
                            : "text-slate-300 hover:text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 transition-colors ${
                            isActive
                              ? "bg-indigo-500/30 text-indigo-300"
                              : "bg-slate-900 border border-slate-800 text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold flex items-center justify-between gap-1">
                            <span className="truncate group-hover:text-indigo-300 transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/contact"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-3 px-4 pt-2 pb-6 bg-[#090d16]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Primary Nav Links */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">
                Main Pages
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold"
                          : "text-slate-300 hover:text-white bg-slate-900/50 hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-indigo-400" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* More / Additional Sections */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1 mb-2">
                More Sections &amp; Archives
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {moreLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold"
                          : "text-slate-300 hover:text-white bg-slate-900/50 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-indigo-400" />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        {item.badge}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Contact CTA */}
            <div className="pt-2 border-t border-slate-800/80">
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 shadow-lg shadow-indigo-600/25 transition-transform active:scale-[0.99]"
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

