import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/onboarding")({
  head: () => ({
    meta: [
      { title: "Placement test — Korean Bloom" },
      { name: "description", content: "Placement test in Korean Bloom, the speaking-first AI Korean tutor for Indian learners." },
      { property: "og:title", content: "Placement test — Korean Bloom" },
      { property: "og:description", content: "Placement test in Korean Bloom, the speaking-first AI Korean tutor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Placement test" korean="레벨테스트" description="This area is being wired to your live learning data." />
      <div className="surface-card p-6 text-sm text-muted-foreground">
        Coming up next: full Placement test experience connected to your Korean Bloom account.
      </div>
    </>
  );
}
