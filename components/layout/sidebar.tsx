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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const items = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, status: "working" },
  {
    href: "/ingestion",
    label: "Data Ingestion",
    icon: Upload,
    status: "working",
  },
  { href: "/ai", label: "AI Analytics", icon: ActivitySquare, status: "demo" },
  {
    href: "/environmental",
    label: "Environmental Health",
    icon: Heart,
    status: "coming",
  },
  {
    href: "/visualization",
    label: "Visualization (WebGIS)",
    icon: MapIcon,
    status: "working",
  },
  {
    href: "/specialized/hab",
    label: "HAB Alerts",
    icon: Layers,
    status: "sample",
  },
  {
    href: "/specialized/correlations",
    label: "Correlations",
    icon: Layers,
    status: "working",
  },
  {
    href: "/specialized/reports",
    label: "Policy / EIA",
    icon: FileText,
    status: "coming",
  },
  {
    href: "/reports",
    label: "Reports & Governance",
    icon: Shield,
    status: "coming",
  },
  { href: "/settings", label: "Settings", icon: SettingsIcon, status: "basic" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = memo(function Sidebar({
  isOpen = true,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 border-r border-primary/20 bg-gradient-to-b from-card via-card/95 to-card/90 text-sidebar-foreground flex flex-col backdrop-blur-xl shadow-2xl shadow-primary/10 z-50 transition-transform duration-300 ease-in-out",
          isMobile && !isOpen && "-translate-x-full"
        )}
      >
        <div className="px-4 py-4 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg overflow-hidden">
                <svg
                  viewBox="0 0 32 32"
                  className="h-full w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Ocean waves background */}
                  <path
                    d="M0 20c4-4 8-4 12 0s8 4 12 0v12H0V20z"
                    fill="rgba(255,255,255,0.2)"
                  />
                  <path
                    d="M0 24c4-2 8-2 12 0s8 2 12 0v8H0v-8z"
                    fill="rgba(255,255,255,0.15)"
                  />

                  {/* Stylized bird (Jatayu) */}
                  <g transform="translate(8, 6)">
                    {/* Bird body */}
                    <ellipse
                      cx="8"
                      cy="8"
                      rx="6"
                      ry="4"
                      fill="white"
                      opacity="0.9"
                    />

                    {/* Wing */}
                    <path
                      d="M2 6c0-2 2-4 6-3s6 3 6 6c0 2-2 2-4 1s-4-1-6-2c-1-1-2-1-2-2z"
                      fill="white"
                      opacity="0.8"
                    />

                    {/* Head */}
                    <circle cx="12" cy="5" r="2.5" fill="white" />

                    {/* Beak */}
                    <path d="M14 4l3-1v2l-3-1z" fill="rgba(255,255,255,0.9)" />

                    {/* Eye */}
                    <circle
                      cx="13"
                      cy="4.5"
                      r="0.7"
                      fill="rgba(59,130,246,0.8)"
                    />

                    {/* Tail feathers */}
                    <path
                      d="M2 8c-1 1-1 3 1 4l2-1c1 0 1-2 0-2s-2-1-3-1z"
                      fill="rgba(255,255,255,0.7)"
                    />
                  </g>
                </svg>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-lg" />
              </div>
              <div className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Jatayu
              </div>
            </div>

            {/* Mobile close button */}
            {isMobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-primary/10 transition-colors lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">Marine Data</div>
        </div>
        <nav className="flex-1 overflow-auto px-2 py-3">
          <ul className="space-y-1">
            {items.map(({ href, label, icon: Icon, status }) => {
              const active = pathname === href;

              const getStatusColor = (status: string) => {
                switch (status) {
                  case "working":
                    return "bg-green-500";
                  case "demo":
                    return "bg-amber-500";
                  case "sample":
                    return "bg-blue-500";
                  case "basic":
                    return "bg-cyan-500";
                  case "coming":
                    return "bg-gray-400";
                  default:
                    return "bg-gray-400";
                }
              };

              const getStatusLabel = (status: string) => {
                switch (status) {
                  case "working":
                    return "✓";
                  case "demo":
                    return "◐";
                  case "sample":
                    return "◑";
                  case "basic":
                    return "◒";
                  case "coming":
                    return "○";
                  default:
                    return "○";
                }
              };

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
                    <span className="text-pretty font-medium flex-1">
                      {label}
                    </span>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        getStatusColor(status)
                      )}
                      title={`Status: ${status}`}
                    />
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
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 text-center py-2 rounded-md space-y-1">
            <div className="font-semibold">Jatayu v1.0</div>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-[10px]">Development Build</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});
