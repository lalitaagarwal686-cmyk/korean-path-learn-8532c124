import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileText, Headphones, PenLine, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/Section";

export const Route = createFileRoute("/topik")({
  head: () => ({
    meta: [
      { title: "TOPIK Preparation & Free Placement Test | Hanji Korean" },
      {
        name: "description",
        content:
          "Prepare for TOPIK I and TOPIK II with timed mock papers, listening strategy and writing templates. Start with a free six-minute placement test.",
      },
      { property: "og:title", content: "TOPIK Preparation & Free Placement Test | Hanji" },
      {
        property: "og:description",
        content: "Timed TOPIK mocks, writing templates and a free placement test for Korean learners.",
      },
    ],
  }),
  component: TopikPage,
});

const papers = [
  { name: "TOPIK I · Mock A", level: "Level 1–2", minutes: 100, sections: "Listening · Reading" },
  { name: "TOPIK I · Mock B", level: "Level 1–2", minutes: 100, sections: "Listening · Reading" },
  {
    name: "TOPIK II · Mock A",
    level: "Level 3–6",
    minutes: 180,
    sections: "Listening · Writing · Reading",
  },
  {
    name: "TOPIK II · Mock B",
    level: "Level 3–6",
    minutes: 180,
    sections: "Listening · Writing · Reading",
  },
];

function TopikPage() {
  return (
    <>
      <Section className="pt-10">
        <SectionHeading
          align="left"
          className="max-w-3xl"
          eyebrow="TOPIK track"
          korean="토픽"
          title="Exam preparation that respects the clock"
          description="Everything is timed the way the real paper is timed, so exam day feels like another Tuesday."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <PlacementDialog />
          <Button asChild variant="outline" size="lg" className="min-h-12">
            <Link to="/courses">See TOPIK courses</Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Headphones, t: "Listening strategy", b: "Prediction drills and note shorthand for 40-question sets." },
            { icon: FileText, t: "Reading pace", b: "Skim-and-scan routines timed to the second." },
            { icon: PenLine, t: "Writing 51–54", b: "Sentence frames and band-scored model essays." },
          ].map((item, i) => (
            <Reveal key={item.t} delay={i * 70} className="surface-card hover-lift p-6">
              <item.icon className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-semibold">{item.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.b}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          align="left"
          className="max-w-2xl"
          eyebrow="Mock papers"
          korean="모의고사"
          title="Full-length papers with weak-area reports"
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {papers.map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 60} className="surface-card p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{p.sections}</p>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {p.level}
                </Badge>
              </div>
              <p className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="size-3.5" aria-hidden="true" /> {p.minutes} minutes
              </p>
              <Button className="mt-4 min-h-11 w-full">Start timed mock</Button>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}

function PlacementDialog() {
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setSubmitted(false);
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="min-h-12">
          Take placement test
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick placement check</DialogTitle>
          <DialogDescription>
            Two sample questions from the six-minute adaptive test.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-4">
            <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
            <p className="mt-3 text-sm">
              Thanks{name ? `, ${name}` : ""}. Based on this sample you would start at{" "}
              <strong>Survival Korean (TOPIK I · Level 1)</strong>.
            </p>
            <Button asChild className="mt-5 min-h-11">
              <Link to="/learn">Open first lesson</Link>
            </Button>
          </div>
        ) : (
          <form
            className="grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="placement-name">Your name</Label>
              <Input
                id="placement-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya"
                autoComplete="name"
                className="h-11"
              />
            </div>
            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium">
                What does <span className="font-kr">감사합니다</span> mean?
              </legend>
              <RadioGroup value={answer} onValueChange={setAnswer} className="grid gap-2">
                {["Sorry", "Thank you", "Please", "Goodbye"].map((opt) => (
                  <div
                    key={opt}
                    className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-4"
                  >
                    <RadioGroupItem value={opt} id={`opt-${opt}`} />
                    <Label htmlFor={`opt-${opt}`} className="flex-1 cursor-pointer font-normal">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </fieldset>
            <DialogFooter>
              <Button type="submit" disabled={!answer} className="min-h-11 w-full sm:w-auto">
                See my level
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
