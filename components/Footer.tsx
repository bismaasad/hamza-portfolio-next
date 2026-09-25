"use client";

import { ArrowUp, GraduationCap, Mail, Phone } from "lucide-react";

interface FooterProps {
  name?: string;
  email?: string;
  phone?: string;
}

function ResearchGateIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.083.535c-.473-.043-.928-.065-1.364-.065-2.298 0-4.23.622-5.794 1.868C7.382 6.265 6.6 7.925 6.6 10c0 1.22.28 2.308.838 3.265.558.957 1.34 1.697 2.345 2.222a7.65 7.65 0 0 0 3.57.778c.436 0 .89-.022 1.364-.065.02.18.048.358.083.535.035.176.072.322.112.437.243.744.65 1.303 1.213 1.68.565.375 1.255.565 2.073.565 1.055 0 1.944-.316 2.668-.948.723-.632 1.085-1.464 1.085-2.497V2.017C21.94 1.345 21.6.84 20.916.505 20.473.284 19.967.16 19.586 0zm.014 2.164c.29 0 .524.086.7.257.177.172.266.398.266.68v17.798c0 .282-.089.508-.266.68-.176.17-.41.256-.7.256-.292 0-.525-.085-.7-.256-.176-.172-.265-.398-.265-.68V3.1c0-.282.09-.508.266-.68.175-.171.408-.257.7-.257z" />
    </svg>
  );
}

function GoogleScholarIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 8a8 8 0 0 1 7.162 5.44L24 9.5 12 0z" />
    </svg>
  );
}

export function Footer({
  name = "Dr. Hamza Khan",
  email = "hamzakhan@ntu.edu.pk",
  phone = "+92 333 3032982",
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[#060910] text-slate-400 text-xs py-10 relative mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-900">
          {/* Brand & Academic Info */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{name}</span>
              <span className="text-[11px] text-slate-500 block">
                PhD in Mathematical Sciences &bull; National Textile University
              </span>
            </div>
          </div>

          {/* Quick Contact Info & Academic Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{email}</span>
            </a>

            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{phone}</span>
              </a>
            )}

            <div className="flex items-center gap-2">
              <a
                href="https://www.researchgate.net/profile/Hamza-Khan-7?ev=hdr_xprf"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 transition-colors"
                title="ResearchGate Profile"
              >
                <ResearchGateIcon className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://scholar.google.com/citations?user=EpFSiBkAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-indigo-400 hover:text-indigo-300 transition-colors"
                title="Google Scholar Citations"
              >
                <GoogleScholarIcon className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer hover:scale-105"
              aria-label="Back to top"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Applied Mathematics &bull; Computational Fluid Dynamics &bull; Adaptive Control
          </p>
        </div>
      </div>
    </footer>
  );
}
