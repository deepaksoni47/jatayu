"use client";
import { Sidebar } from "./sidebar";
import type React from "react";
import { memo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Topbar } from "./topbar";

// Memoize the AppShell to prevent unnecessary re-renders
const AppShell = memo(function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      <Sidebar
        isOpen={isMobile ? isSidebarOpen : true}
        onClose={closeSidebar}
      />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isMobile ? "ml-0" : "ml-64"
        }`}
      >
        <Topbar onMenuClick={toggleSidebar} />
        <main className="flex-1 mx-auto w-full max-w-[1400px] p-4 md:p-6 lg:p-8 animate-fade-slide-in">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
});

export default AppShell;
