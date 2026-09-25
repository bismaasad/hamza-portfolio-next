import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  icon?: LucideIcon;
  iconColor?: string;
  actionButton?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  icon: Icon,
  iconColor = "from-indigo-500 to-violet-600",
  actionButton,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
      <div className="flex items-start gap-4">
        {Icon ? (
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${iconColor} flex items-center justify-center text-white shadow-lg shrink-0 mt-0.5`}
          >
            <Icon className="w-6 h-6" />
          </div>
        ) : null}
        <div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </Link>
            {badge && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                {badge}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            {title}
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5 max-w-xl">{description}</p>
        </div>
      </div>

      {actionButton && <div className="shrink-0">{actionButton}</div>}
    </div>
  );
}
