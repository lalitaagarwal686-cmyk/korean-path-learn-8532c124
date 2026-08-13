import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/vocabulary")({
  head: () => ({
    meta: [
      { title: "Vocabulary — Korean Bloom" },
      { name: "description", content: "Vocabulary in Korean Bloom, the speaking-first AI Korean tutor for Indian learners." },
      { property: "og:title", content: "Vocabulary — Korean Bloom" },
      { property: "og:description", content: "Vocabulary in Korean Bloom, the speaking-first AI Korean tutor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Vocabulary" korean="어휘" description="This area is being wired to your live learning data." />
      <div className="surface-card p-6 text-sm text-muted-foreground">
        Coming up next: full Vocabulary experience connected to your Korean Bloom account.
      </div>
    </>
  );
}
