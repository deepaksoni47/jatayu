"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  ActivitySquare,
  MapIcon,
  Layers,
  FileText,
  Shield,
  SettingsIcon,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ingestion", label: "Data Ingestion", icon: Upload },
  { href: "/ai", label: "AI Analytics", icon: ActivitySquare },
  { href: "/environmental", label: "Environmental Health", icon: Heart },
  { href: "/visualization", label: "Visualization (WebGIS)", icon: MapIcon },
  { href: "/specialized/hab", label: "HAB Alerts", icon: Layers },
  { href: "/specialized/correlations", label: "Correlations", icon: Layers },
  { href: "/specialized/reports", label: "Policy / EIA", icon: FileText },
  { href: "/reports", label: "Reports & Governance", icon: Shield },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-primary/20 bg-gradient-to-b from-card via-card/95 to-card/90 text-sidebar-foreground flex flex-col backdrop-blur-xl shadow-2xl shadow-primary/10 z-50">
      <div className="px-4 py-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 animate-gentle-float">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="sidebar-logo-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
              </defs>
              {/* Ocean waves */}
              <path
                d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0v6H3v-6z"
                fill="url(#sidebar-logo-gradient)"
                opacity="0.8"
              />
              <path
                d="M3 16c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0v4H3v-4z"
                fill="url(#sidebar-logo-gradient)"
                opacity="0.6"
              />
              {/* Bird silhouette (Jatayu) */}
              <path
                d="M8 4c1-1 2-1 3 0l1 1c1 0 2 1 2 2 0 1-1 1-1 2l2 1c1 0 1 1 0 1l-3-1c-1 0-2-1-3-2l-1-1c-1-1-1-2 0-3z"
                fill="url(#sidebar-logo-gradient)"
              />
              <circle
                cx="10"
                cy="6"
                r="0.5"
                fill="hsl(var(--foreground))"
                opacity="0.8"
              />
            </svg>
            <div className="absolute inset-0 rounded-md ring-1 ring-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm" />
          </div>
          <div className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Jatayu
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Unified Marine Data</div>
      </div>
      <nav className="flex-1 overflow-auto px-2 py-3">
        <ul className="space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="relative">
                {active ? (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded bg-gradient-to-b from-primary to-accent shadow-lg shadow-primary/40 animate-pulse-glow" />
                ) : null}
                <Link
                  href={href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-out overflow-hidden",
                    active
                      ? "bg-gradient-to-r from-primary/20 via-primary/15 to-accent/10 text-primary border border-primary/30 shadow-lg shadow-primary/20"
                      : "hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent hover:text-primary hover:border hover:border-primary/20 hover:shadow-md hover:shadow-primary/10 hover:scale-105"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "size-4 transition-all duration-300",
                      active
                        ? "text-primary drop-shadow-sm"
                        : "text-muted-foreground group-hover:text-primary group-hover:scale-110"
                    )}
                    aria-hidden
                  />
                  <span className="text-pretty font-medium">{label}</span>
                  {active && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 animate-shimmer pointer-events-none" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-3 py-3 text-xs text-muted-foreground border-t border-primary/20">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 text-center py-2 rounded-md">
          Jatayu
        </div>
      </div>
    </aside>
  );
});
