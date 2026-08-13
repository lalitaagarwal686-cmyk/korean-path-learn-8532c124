import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/scenarios")({
  head: () => ({
    meta: [
      { title: "Scenarios — Korean Bloom" },
      { name: "description", content: "Scenarios in Korean Bloom, the speaking-first AI Korean tutor for Indian learners." },
      { property: "og:title", content: "Scenarios — Korean Bloom" },
      { property: "og:description", content: "Scenarios in Korean Bloom, the speaking-first AI Korean tutor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Scenarios" korean="상황" description="This area is being wired to your live learning data." />
      <div className="surface-card p-6 text-sm text-muted-foreground">
        Coming up next: full Scenarios experience connected to your Korean Bloom account.
      </div>
    </>
  );
}
