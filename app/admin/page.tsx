import Link from "next/link";
import {
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Mail,
  ArrowRight,
  Database,
  Layers,
  MessageSquare,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Hamza Portfolio",
};

export default function AdminDashboardPage() {
  const sections = [
    {
      title: "Contact Messages",
      description: "Review inquiries, collaboration proposals, and messages from visitors.",
      href: "/admin/messages",
      icon: MessageSquare,
      color: "from-indigo-500 to-cyan-600",
      table: "contact_messages",
    },
    {
      title: "Hero Section",
      description: "Manage your main headline, subtitle, avatar image, and resume link.",
      href: "/admin/hero",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-600",
      table: "hero",
    },
    {
      title: "About Me",
      description: "Update your personal story, bio highlights, and introduction.",
      href: "/admin/about",
      icon: User,
      color: "from-indigo-500 to-violet-600",
      table: "about",
    },
    {
      title: "Education",
      description: "Manage academic degrees, institutes, graduation years, and details.",
      href: "/admin/education",
      icon: GraduationCap,
      color: "from-violet-500 to-purple-600",
      table: "education",
    },
    {
      title: "Experience",
      description: "Update work history, companies, roles, timeline, and achievements.",
      href: "/admin/experience",
      icon: Briefcase,
      color: "from-purple-500 to-pink-600",
      table: "experience",
    },
    {
      title: "Publications",
      description: "Manage research papers, articles, external links, and cover images.",
      href: "/admin/publications",
      icon: BookOpen,
      color: "from-pink-500 to-rose-600",
      table: "publications",
    },
    {
      title: "Gallery",
      description: "Curate project showcase images, photography, and captions.",
      href: "/admin/gallery",
      icon: ImageIcon,
      color: "from-emerald-500 to-teal-600",
      table: "gallery",
    },
    {
      title: "Contact Info",
      description: "Update contact email, phone number, and social profile links.",
      href: "/admin/contact",
      icon: Mail,
      color: "from-amber-500 to-orange-600",
      table: "contact_info",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-neutral-900 border border-neutral-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-4">
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Connected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Welcome to Portfolio Admin
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Manage, update, and publish your portfolio data directly from this dashboard. All changes sync in real-time with your PostgreSQL database.
          </p>
        </div>
      </div>

      {/* Section Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight">
            Portfolio Sections
          </h2>
          <p className="text-xs text-neutral-400">
            Select a section below to review and edit its content
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Layers className="w-4 h-4" />
          <span>8 Tables</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.title}
              href={section.href}
              className="group relative rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-6 hover:border-indigo-500/50 hover:bg-neutral-900 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between block"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${section.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-800/80 text-neutral-400 border border-neutral-700/50">
                    public.{section.table}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-base mb-1 group-hover:text-indigo-400 transition-colors">
                  {section.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {section.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs font-medium text-neutral-400 group-hover:text-indigo-400 transition-colors">
                <span>Manage entries</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
