"use client";
import { Sidebar } from "./sidebar";
import type React from "react";
import { memo } from "react";

import { Topbar } from "./topbar";

// Memoize the AppShell to prevent unnecessary re-renders
const AppShell = memo(function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 mx-auto w-full max-w-[1400px] p-4 md:p-6 lg:p-8 animate-fade-slide-in">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
});

export default AppShell;
