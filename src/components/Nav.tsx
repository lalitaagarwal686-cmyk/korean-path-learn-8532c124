import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  Home,
  Menu,
  Sparkles,
  Trophy,
  User,
  X,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/topik", label: "TOPIK", icon: Sparkles },
  { to: "/progress", label: "Progress", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="Hanji home">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary font-kr text-lg font-bold text-primary-foreground">
            한
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none font-semibold">
              Hanji
            </span>
            <span className="block text-[11px] tracking-wide text-muted-foreground">
              Korean, made learnable
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          {navItems.slice(1, 6).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/learn">Start Learning</Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-card lg:hidden">
          <nav aria-label="Mobile" className="container-page grid gap-1 py-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <item.icon className="size-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link to="/learn" onClick={() => setOpen(false)}>
                Start Learning
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function MobileTabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs = navItems.filter((i) =>
    ["/", "/courses", "/learn", "/practice", "/progress"].includes(i.to),
  );

  return (
    <nav
      aria-label="Bottom"
      className="fixed inset-x-0 bottom-0 z-50 glass pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = pathname === tab.to;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <tab.icon className="size-5" aria-hidden="true" />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40 pb-24 lg:pb-0">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary font-kr text-lg font-bold text-primary-foreground">
              한
            </span>
            <span className="font-display text-lg font-semibold">Hanji</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A Korean learning platform built for Indian learners — Hangul to TOPIK II, on any
            phone.
          </p>
        </div>
        <FooterCol
          title="Learn"
          links={[
            { to: "/courses", label: "Courses" },
            { to: "/learn", label: "Lessons" },
            { to: "/practice", label: "Practice" },
          ]}
        />
        <FooterCol
          title="Exams"
          links={[
            { to: "/topik", label: "TOPIK prep" },
            { to: "/progress", label: "Progress" },
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            { to: "/profile", label: "Profile & settings" },
            { to: "/learn", label: "Start learning" },
          ]}
        />
      </div>
      <div className="container-page border-t border-border py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Hanji Korean Learning. Sample content for demonstration.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
