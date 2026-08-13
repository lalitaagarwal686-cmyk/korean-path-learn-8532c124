import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Flame, Mic, Sparkles, Target, Trophy } from "lucide-react";

import { PageHeader } from "@/components/app/AppShell";
import { RealisticAITutor } from "@/components/app/RealisticAITutor";
import { ScoreBar } from "@/components/app/PronunciationReport";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { curriculumQueries, learnerQueries } from "@/lib/queries";
import { useActiveTutor } from "@/lib/use-tutor";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Korean Bloom" },
      {
        name: "description",
        content:
          "Your Korean speaking dashboard: streak, XP, coins, weaknesses, recommended lessons and today's AI conversation.",
      },
      { property: "og:title", content: "Dashboard — Korean Bloom" },
      { property: "og:description", content: "Track your Korean speaking progress every day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string | number;
}) {
  return (
    <div className="surface-card p-4">
      <Icon className="size-4 text-primary" aria-hidden />
      <p className="mt-2 font-display text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const id = user?.id ?? "";
  const { persona } = useActiveTutor();
  const { data: profile } = useQuery({ ...learnerQueries.profile(id), enabled: Boolean(id) });
  const { data: days } = useQuery({ ...learnerQueries.days(id), enabled: Boolean(id) });
  const { data: mistakes } = useQuery({ ...learnerQueries.mistakes(id), enabled: Boolean(id) });
  const { data: recs } = useQuery({ ...learnerQueries.recommendations(id), enabled: Boolean(id) });
  const { data: words } = useQuery({ ...learnerQueries.savedWords(id), enabled: Boolean(id) });
  const { data: progress } = useQuery({ ...learnerQueries.progress(id), enabled: Boolean(id) });
  const { data: sessions } = useQuery({ ...learnerQueries.sessions(id), enabled: Boolean(id) });
  const { data: lessons } = useQuery(curriculumQueries.lessons());

  const today = new Date().toISOString().slice(0, 10);
  const todayRow = days?.find((d) => d.day === today);
  const goal = profile?.daily_goal_minutes ?? 10;
  const goalPct = Math.min(100, Math.round(((todayRow?.minutes ?? 0) / goal) * 100));
  const completed = progress?.filter((p) => p.status === "completed").length ?? 0;
  const nextLesson =
    lessons?.find((l) => !progress?.some((p) => p.lesson_id === l.id && p.status === "completed")) ??
    lessons?.[0];
  const minutesTotal = (days ?? []).reduce((s, d) => s + (d.minutes ?? 0), 0);

  return (
    <>
      <PageHeader
        title={`안녕하세요, ${profile?.display_name ?? "learner"}!`}
        korean="오늘도 같이 한국어 공부해요"
        description="Speak first, learn faster. Your tutor remembers yesterday's mistakes."
        action={
          <Button asChild size="lg">
            <Link to="/app/speak">
              <Mic className="size-4" /> Speak now
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Flame} label="Day streak" value={profile?.streak_days ?? 0} />
            <Stat icon={Sparkles} label="Total XP" value={profile?.xp ?? 0} />
            <Stat icon={Trophy} label="Lessons done" value={completed} />
            <Stat icon={BookMarked} label="Saved words" value={words?.length ?? 0} />
          </div>

          <section className="surface-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Today's goal</h2>
              <span className="text-sm text-muted-foreground">
                {todayRow?.minutes ?? 0} / {goal} min
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700"
                style={{ width: `${Math.max(3, goalPct)}%` }}
              />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Button asChild variant="secondary" size="sm">
                <Link to="/app/learn">Daily lesson</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link to="/app/vocabulary">Review words</Link>
              </Button>
              <Button asChild variant="secondary" size="sm">
                <Link to="/app/shadowing">Shadowing drill</Link>
              </Button>
            </div>
          </section>

          <section className="surface-card p-5">
            <h2 className="font-display text-lg font-semibold">Weekly activity</h2>
            <div className="mt-4 flex items-end gap-2">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10);
                const row = days?.find((x) => x.day === d);
                const h = Math.min(100, ((row?.minutes ?? 0) / Math.max(goal, 1)) * 100);
                return (
                  <div key={d} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-24 w-full items-end rounded-lg bg-secondary">
                      <div
                        className="w-full rounded-lg bg-primary transition-[height] duration-700"
                        style={{ height: `${Math.max(4, h)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(d).toLocaleDateString("en", { weekday: "narrow" })}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {minutesTotal} minutes of Korean logged so far.
            </p>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="surface-card p-5">
              <h2 className="font-display text-lg font-semibold">Recent mistakes</h2>
              {mistakes?.length ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {mistakes.slice(0, 5).map((m) => (
                    <li key={m.id} className="rounded-xl bg-secondary/60 p-3">
                      <p className="font-kr">
                        {m.original} <span className="text-muted-foreground">→</span> {m.correction}
                      </p>
                      <p className="text-xs text-muted-foreground">{m.explanation}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  No mistakes logged yet — start a conversation and your tutor will track them.
                </p>
              )}
            </section>

            <section className="surface-card p-5">
              <h2 className="font-display text-lg font-semibold">AI recommendations</h2>
              {recs?.length ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {recs.map((r) => (
                    <li key={r.id} className="rounded-xl bg-primary/8 p-3">
                      <p className="font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Finish a lesson or conversation and your tutor will suggest what to do next.
                </p>
              )}
            </section>
          </div>
        </div>

        <aside className="space-y-4">
          <RealisticAITutor persona={persona} state="idle" />
          <div className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recommended lesson
            </p>
            <p className="mt-1 font-display text-base font-semibold">
              {nextLesson?.title ?? "Introducing yourself"}
            </p>
            <p className="font-kr text-sm text-muted-foreground">{nextLesson?.korean_title}</p>
            <Button asChild size="sm" className="mt-3 w-full">
              <Link to="/app/lesson/$slug" params={{ slug: nextLesson?.slug ?? "" }}>
                <Target className="size-4" /> Start 5-minute mission
              </Link>
            </Button>
          </div>

          <div className="surface-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Speaking confidence
            </p>
            <div className="mt-3 space-y-3">
              <ScoreBar label="Speaking" value={profile?.speaking_score ?? 0} />
              <ScoreBar label="Listening" value={profile?.listening_score ?? 0} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {sessions?.length ?? 0} conversations recorded.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
