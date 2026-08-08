import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Reveal } from "@/components/Reveal";
import { StreakStrip } from "@/components/StreakStrip";
import { progressData } from "@/lib/content";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your Korean Progress — Streak, XP & Skills | Hanji" },
      {
        name: "description",
        content:
          "Track your Korean study streak, XP, level badges and skill balance across reading, listening, speaking and writing.",
      },
      { property: "og:title", content: "Your Korean Progress — Streak, XP & Skills | Hanji" },
      {
        property: "og:description",
        content: "Streaks, XP, badges and a skill breakdown for your Korean study routine.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const maxXp = Math.max(...progressData.weekly.map((d) => d.xp));

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold sm:text-3xl">Your progress</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-kr">잘하고 있어요</span> — you are on pace for Level 8 in three
            weeks.
          </p>
        </div>
        <Badge className="shrink-0 gap-1">
          <Flame className="size-3.5" aria-hidden="true" /> {progressData.streak}
        </Badge>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <Reveal className="lg:col-span-1">
          <StreakStrip />
        </Reveal>

        <Reveal delay={80} className="surface-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">This week</h2>
          <ul className="mt-6 flex h-40 items-end gap-3">
            {progressData.weekly.map((d) => (
              <li key={d.day} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-primary/80"
                  style={{ height: `${(d.xp / maxXp) * 100}%` }}
                  role="img"
                  aria-label={`${d.day}: ${d.xp} XP`}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120} className="surface-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Skill balance</h2>
          <ul className="mt-5 grid gap-4">
            {progressData.skills.map((s) => (
              <li key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <Progress value={s.value} className="mt-2 h-2" aria-label={`${s.name} skill`} />
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl bg-secondary/70 p-4 text-sm text-muted-foreground">
            Writing is lagging. Two short writing tasks a week would close the gap by next month.
          </p>
        </Reveal>

        <Reveal delay={160} className="surface-card p-6">
          <h2 className="text-lg font-semibold">Badges</h2>
          <ul className="mt-5 grid gap-3">
            {progressData.badges.map((b) => (
              <li key={b.name} className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/25 text-gold-foreground">
                  <Award className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{b.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild className="min-h-11">
          <Link to="/learn">Continue lesson</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link to="/practice">Review 12 due cards</Link>
        </Button>
      </div>
    </div>
  );
}
