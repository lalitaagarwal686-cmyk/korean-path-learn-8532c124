import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Reveal } from "@/components/Reveal";
import { QuizBlock, WordCard } from "@/components/learning";
import { grammarPoints, lessonSteps, quiz, words } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Lesson 1: Greetings & Introductions | Hanji Korean" },
      {
        name: "description",
        content:
          "Work through a full Korean lesson: warm-up, vocabulary with audio, one grammar pattern, and a mixed quiz with instant feedback.",
      },
      { property: "og:title", content: "Lesson 1: Greetings & Introductions | Hanji Korean" },
      {
        property: "og:description",
        content: "A guided Korean lesson with audio vocabulary, grammar and an interactive quiz.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const current = lessonSteps[step]!;
  const pct = ((step + 1) / lessonSteps.length) * 100;

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Survival Korean · Unit 1
          </p>
          <h1 className="mt-1 truncate text-2xl font-semibold sm:text-3xl">
            Greetings & Introductions
          </h1>
        </div>
        <Badge className="shrink-0">+50 XP</Badge>
      </div>

      <Progress value={pct} className="mt-5 h-2" aria-label="Lesson progress" />
      <ol className="mt-3 flex flex-wrap gap-2 text-xs">
        {lessonSteps.map((s, i) => (
          <li
            key={s.id}
            className={cn(
              "rounded-full border px-3 py-1",
              i === step
                ? "border-primary bg-primary-soft font-semibold"
                : "border-border text-muted-foreground",
            )}
          >
            {s.label}
          </li>
        ))}
      </ol>

      <div className="mt-8">
        {current.id === "intro" ? <Warmup /> : null}
        {current.id === "vocab" ? <VocabStep /> : null}
        {current.id === "grammar" ? <GrammarStep /> : null}
        {current.id === "quiz" ? (
          <QuizBlock questions={quiz} onComplete={(s) => setScore(s)} />
        ) : null}
        {current.id === "done" ? <Completion score={score} /> : null}
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <Button
          variant="outline"
          className="min-h-11"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button
          className="min-h-11"
          disabled={step === lessonSteps.length - 1}
          onClick={() => setStep((s) => Math.min(lessonSteps.length - 1, s + 1))}
        >
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function Warmup() {
  return (
    <Reveal className="surface-card p-6 sm:p-8">
      <h2 className="text-xl font-semibold">Today you will be able to…</h2>
      <ul className="mt-4 grid gap-3 text-sm">
        {[
          "Greet someone politely at any time of day",
          "Introduce yourself with your name and country",
          "Use the topic marker 은/는 correctly",
          "Recognise six high-frequency words by sound",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 rounded-xl bg-secondary/70 p-4 text-sm text-muted-foreground">
        Estimated time: 18 minutes · Audio recommended
      </p>
    </Reveal>
  );
}

function VocabStep() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {words.map((word, i) => (
        <Reveal key={word.hangul} delay={i * 50}>
          <WordCard word={word} />
        </Reveal>
      ))}
    </div>
  );
}

function GrammarStep() {
  const point = grammarPoints[0]!;
  return (
    <Reveal className="surface-card p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-kr text-3xl font-semibold text-primary">{point.pattern}</span>
        <Badge variant="secondary">{point.meaning}</Badge>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{point.note}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {grammarPoints.slice(0, 4).map((g) => (
          <div key={g.pattern} className="rounded-xl bg-secondary/70 p-4">
            <p className="font-kr text-sm font-semibold">{g.example}</p>
            <p className="mt-1 text-xs text-muted-foreground">{g.exampleEnglish}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

function Completion({ score }: { score: number | null }) {
  return (
    <Reveal className="surface-card hero-gradient p-8 text-center sm:p-12">
      <PartyPopper className="mx-auto size-10 text-accent" aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-semibold">Lesson complete · 수고했어요!</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {score !== null ? `You answered ${score} of ${quiz.length} correctly. ` : ""}
        You earned 50 XP and extended your streak.
      </p>
      <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
        {[
          { v: "+50", l: "XP" },
          { v: "25", l: "day streak" },
          { v: "6", l: "new words" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card p-3">
            <p className="text-lg font-semibold">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild className="min-h-11">
          <Link to="/practice">Practice these words</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link to="/progress">See progress</Link>
        </Button>
      </div>
    </Reveal>
  );
}
