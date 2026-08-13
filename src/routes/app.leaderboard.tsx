import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Korean Bloom" },
      { name: "description", content: "Leaderboard in Korean Bloom, the speaking-first AI Korean tutor for Indian learners." },
      { property: "og:title", content: "Leaderboard — Korean Bloom" },
      { property: "og:description", content: "Leaderboard in Korean Bloom, the speaking-first AI Korean tutor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Leaderboard" korean="순위" description="This area is being wired to your live learning data." />
      <div className="surface-card p-6 text-sm text-muted-foreground">
        Coming up next: full Leaderboard experience connected to your Korean Bloom account.
      </div>
    </>
  );
}
