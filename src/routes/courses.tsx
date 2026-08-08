import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Layers } from "lucide-react";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses } from "@/lib/content";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Korean Courses — Beginner to Advanced | Hanji" },
      {
        name: "description",
        content:
          "Browse Korean courses from Hangul foundations to business Korean, each mapped to TOPIK levels with lesson counts and study hours.",
      },
      { property: "og:title", content: "Korean Courses — Beginner to Advanced | Hanji" },
      {
        property: "og:description",
        content: "Structured Korean courses mapped to TOPIK levels, from Hangul to business Korean.",
      },
    ],
  }),
  component: CoursesPage,
});

const groups = ["All", "Beginner", "Elementary", "Intermediate", "Upper-Int", "Advanced"] as const;

function CoursesPage() {
  return (
    <Section className="pt-10">
      <SectionHeading
        align="left"
        className="max-w-3xl"
        eyebrow="Courses"
        korean="강좌"
        title="Pick the rung that matches where you actually are"
        description="Not sure? Take the six-minute placement test and we will choose for you."
      />
      <div className="mt-6">
        <Button asChild variant="outline" className="min-h-11">
          <Link to="/topik">Take placement test</Link>
        </Button>
      </div>

      <Tabs defaultValue="All" className="mt-10">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          {groups.map((g) => (
            <TabsTrigger key={g} value={g} className="min-h-10">
              {g}
            </TabsTrigger>
          ))}
        </TabsList>
        {groups.map((g) => (
          <TabsContent key={g} value={g} className="mt-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses
                .filter((c) => g === "All" || c.level === g)
                .map((course, i) => (
                  <Reveal key={course.id} delay={i * 60}>
                    <article className="surface-card hover-lift flex h-full flex-col p-6">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                        <div className="min-w-0">
                          <h2 className="text-lg font-semibold">{course.title}</h2>
                          <p className="font-kr text-sm text-muted-foreground">
                            {course.koreanTitle}
                          </p>
                        </div>
                        <Badge className="shrink-0">{course.level}</Badge>
                      </div>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {course.summary}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Layers className="size-3.5" aria-hidden="true" /> {course.lessons}{" "}
                          lessons
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" aria-hidden="true" /> {course.hours} hrs
                        </span>
                        <span>{course.topik}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild className="mt-5 min-h-11">
                        <Link to="/learn">Start course</Link>
                      </Button>
                    </article>
                  </Reveal>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Section>
  );
}
