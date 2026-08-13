import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  Flame,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Medal,
  Mic,
  MessagesSquare,
  Repeat2,
  Settings,
  Sparkles,
  Trophy,
  Coins,
  Type,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { learnerQueries } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const appNav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/learn", label: "Learn", icon: GraduationCap },
  { to: "/app/speak", label: "Speak", icon: Mic },
  { to: "/app/scenarios", label: "Scenarios", icon: MessagesSquare },
  { to: "/app/freetalk", label: "Free talk", icon: Sparkles },
  { to: "/app/shadowing", label: "Shadowing", icon: Repeat2 },
  { to: "/app/vocabulary", label: "Vocabulary", icon: BookMarked },
  { to: "/app/grammar", label: "Grammar", icon: Type },
  { to: "/app/topik", label: "TOPIK", icon: Medal },
  { to: "/app/progress", label: "Progress", icon: Trophy },
  { to: "/app/leaderboard", label: "Leaderboard", icon: Flame },
  { to: "/app/achievements", label: "Achievements", icon: Medal },
  { to: "/app/history", label: "Conversations", icon: MessagesSquare },
  { to: "/app/profile", label: "Profile", icon: Settings },
] as const;

const mobileNav = [
  { to: "/app/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/app/learn", label: "Learn", icon: GraduationCap },
  { to: "/app/speak", label: "Speak", icon: Mic },
  { to: "/app/vocabulary", label: "Words", icon: BookMarked },
  { to: "/app/progress", label: "Progress", icon: Trophy },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: profile } = useQuery({
    ...learnerQueries.profile(user?.id ?? ""),
    enabled: Boolean(user?.id),
  });

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-sidebar lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary font-kr text-lg font-bold text-primary-foreground">
            한
          </span>
          <span>
            <span className="block font-display text-lg leading-none font-semibold">Korean Bloom</span>
            <span className="text-[11px] text-muted-foreground">Speak from day one</span>
          </span>
        </Link>
        <nav aria-label="App" className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
          {appNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.to
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => void signOut()}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 glass">
          <div className="flex h-14 items-center gap-3 px-4">
            <Link to="/app/dashboard" className="font-display text-base font-semibold lg:hidden">
              Korean Bloom
            </Link>
            <div className="ml-auto flex items-center gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-accent">
                <Flame className="size-3.5" /> {profile?.streak_days ?? 0}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-primary">
                <Sparkles className="size-3.5" /> {profile?.xp ?? 0} XP
              </span>
              <span className="hidden items-center gap-1 rounded-full bg-gold/25 px-2.5 py-1 text-gold-foreground sm:inline-flex">
                <Coins className="size-3.5" /> {profile?.coins ?? 0}
              </span>
            </div>
          </div>
        </header>

        <main id="main" className="px-4 pb-28 pt-5 lg:px-8 lg:pb-12">
          {children}
        </main>
      </div>

      <nav
        aria-label="App bottom"
        className="fixed inset-x-0 bottom-0 z-40 glass pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid grid-cols-5 items-end">
          {mobileNav.map((tab) => {
            const active = pathname === tab.to;
            const primary = tab.to === "/app/speak";
            return (
              <li key={tab.to} className="flex justify-center">
                <Link
                  to={tab.to}
                  className={cn(
                    "flex w-full flex-col items-center gap-1 py-2 text-[11px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "grid place-items-center rounded-full transition-transform",
                      primary
                        ? "-mt-6 size-14 bg-primary text-primary-foreground shadow-glow"
                        : "size-8",
                    )}
                  >
                    <tab.icon className={primary ? "size-6" : "size-5"} aria-hidden />
                  </span>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  korean,
  description,
  action,
}: {
  title: string;
  korean?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {korean ? <p className="font-kr text-sm text-primary">{korean}</p> : null}
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="surface-card grid place-items-center p-10 text-center">
      <p className="font-display text-base font-semibold">{title}</p>
      {hint ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
