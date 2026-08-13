import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { curriculumQueries, learnerQueries } from "@/lib/queries";

export const Route = createFileRoute("/app/learn")({
  head: () => ({
    meta: [
      { title: "Learn Korean — lessons & missions | Korean Bloom" },
      {
        name: "description",
        content: "Beginner to advanced Korean missions: vocabulary, pronunciation, grammar, listening and speaking.",
      },
      { property: "og:title", content: "Learn Korean — lessons & missions" },
      { property: "og:description", content: "2–5 minute Korean missions built around speaking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const { user } = useAuth();
  const { data: lessons } = useQuery(curriculumQueries.lessons());
  const { data: progress } = useQuery({
    ...learnerQueries.progress(user?.id ?? ""),
    enabled: Boolean(user?.id),
  });

  const levels = Array.from(new Set((lessons ?? []).map((l) => l.level)));

  return (
    <>
      <PageHeader
        title="Learn"
        korean="배우기"
        description="Every mission ends with you speaking Korean out loud."
      />
      <div className="space-y-8">
        {levels.map((level) => (
          <section key={level}>
            <h2 className="mb-3 font-display text-lg font-semibold capitalize">
              {level.replace(/_/g, " ")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {(lessons ?? [])
                .filter((l) => l.level === level)
                .map((lesson) => {
                  const row = progress?.find((p) => p.lesson_id === lesson.id);
                  return (
                    <article key={lesson.id} className="surface-card flex flex-col p-5">
                      <p className="font-kr text-sm text-primary">{lesson.korean_title}</p>
                      <h3 className="font-display text-base font-semibold">{lesson.title}</h3>
                      <p className="mt-1 flex-1 text-sm text-muted-foreground">{lesson.summary}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{lesson.minutes ?? 5} min</span>
                        <span>{row?.status === "completed" ? "Completed" : row ? "In progress" : "New"}</span>
                      </div>
                      <Button asChild size="sm" className="mt-3">
                        <Link to="/app/lesson/$slug" params={{ slug: lesson.slug }}>
                          {row?.status === "completed" ? "Practice again" : "Start mission"}
                        </Link>
                      </Button>
                    </article>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
