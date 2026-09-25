"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  User,
  Sparkles,
  GraduationCap,
  Briefcase,
  BookOpen,
  Image as ImageIcon,
  Mail,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Menu,
  X,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { AdminNotifications } from "@/components/admin/AdminNotifications";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkUserAuth() {
      if (pathname === "/admin/login") {
        setCheckingAuth(false);
        return;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user && process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http")) {
          router.push(`/admin/login?redirectTo=${encodeURIComponent(pathname)}`);
        } else if (user) {
          setUserEmail(user.email || "Admin");
        }
      } catch {
        // Handle error gracefully
      } finally {
        setCheckingAuth(false);
      }
    }

    checkUserAuth();
  }, [pathname, router, supabase]);

  // If on login page, render children without the admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Hero Section", href: "/admin/hero", icon: Sparkles },
    { name: "About Me", href: "/admin/about", icon: User },
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Publications", href: "/admin/publications", icon: BookOpen },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Contact Info", href: "/admin/contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-200 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-semibold text-white tracking-tight text-sm">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Notifications Bell */}
          <AdminNotifications />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar for Desktop & Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-950/95 border-r border-neutral-800/80 p-5 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm tracking-tight leading-tight">
                Hamza Admin
              </h2>
              <span className="text-[11px] text-neutral-400">Portfolio CMS</span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Footer Actions */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-3">
          {/* View Live Portfolio */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">View</span>
          </Link>

          {/* Admin Email pill */}
          {userEmail && (
            <div className="px-3 py-2 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 truncate">
              <span className="text-neutral-500 block text-[10px]">Logged in as:</span>
              <span className="text-white font-medium truncate block">{userEmail}</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Desktop Top Header Bar with Notifications Bell */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="text-neutral-500">Dashboard</span>
            <span>/</span>
            <span className="text-white font-medium capitalize">
              {pathname === "/admin"
                ? "Overview"
                : pathname.replace("/admin/", "").replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Website Link */}
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Site</span>
            </Link>

            {/* Notification Bell with count & popup */}
            <AdminNotifications />
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1">
          <div className="max-w-6xl mx-auto">
            {checkingAuth ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
