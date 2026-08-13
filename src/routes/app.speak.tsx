import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/app/AppShell";

export const Route = createFileRoute("/app/speak")({
  head: () => ({
    meta: [
      { title: "Speak — Korean Bloom" },
      { name: "description", content: "Speak in Korean Bloom, the speaking-first AI Korean tutor for Indian learners." },
      { property: "og:title", content: "Speak — Korean Bloom" },
      { property: "og:description", content: "Speak in Korean Bloom, the speaking-first AI Korean tutor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader title="Speak" korean="말하기" description="This area is being wired to your live learning data." />
      <div className="surface-card p-6 text-sm text-muted-foreground">
        Coming up next: full Speak experience connected to your Korean Bloom account.
      </div>
    </>
  );
}
