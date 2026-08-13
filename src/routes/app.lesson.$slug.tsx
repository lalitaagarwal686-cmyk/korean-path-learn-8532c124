import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/lesson/$slug")({
  head: () => ({
    meta: [
      { title: "Lesson — Korean Bloom" },
      { name: "description", content: "Lesson in Korean Bloom, the speaking-first AI Korean tutor for Indian learners." },
      { property: "og:title", content: "Lesson — Korean Bloom" },
      { property: "og:description", content: "Lesson in Korean Bloom, the speaking-first AI Korean tutor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Lesson" korean="레슨" description="This area is being wired to your live learning data." />
      <div className="surface-card p-6 text-sm text-muted-foreground">
        Coming up next: full Lesson experience connected to your Korean Bloom account.
      </div>
    </>
  );
}
