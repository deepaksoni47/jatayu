"use client"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 pt-3">
        <div className="glass-card ring-1 ring-primary/10 px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-3 md:gap-4">
          {/* Brand title */}
          <div className="hidden md:block">
            <h1
              className="text-sm md:text-base font-semibold text-pretty bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))] bg-clip-text text-transparent"
              aria-label="Jatayu – Unified Marine Data Platform"
              title="Jatayu – Unified Marine Data Platform"
            >
              Jatayu – Unified Marine Data Platform
            </h1>
          </div>

          {/* Search */}
          <div className="ml-auto hidden md:block w-[380px] lg:w-[460px]">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" aria-hidden />
              <Input
                className="pl-8 h-9 bg-secondary/40 border-border focus-visible:ring-2 focus-visible:ring-primary/50 transition"
                placeholder="Search datasets, species, alerts..."
                aria-label="Search"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto md:ml-0 flex items-center gap-2">
            <button
              className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-secondary/50 focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors glow"
              aria-label="Notifications"
            >
              <Bell className="size-5" aria-hidden />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <Avatar className="ring-1 ring-border">
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
