import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Headphones,
  Mic,
  PenLine,
  Sparkles,
  Star,
  Volume2,
} from "lucide-react";
import heroImage from "@/assets/hero-korean.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { WordCard } from "@/components/learning";
import { StreakStrip } from "@/components/StreakStrip";
import {
  courses,
  faqs,
  grammarPoints,
  hangulLetters,
  learningPath,
  stats,
  testimonials,
  words,
} from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hanji — Learn Korean from Hangul to TOPIK II" },
      {
        name: "description",
        content:
          "Learn Korean the structured way: Hangul foundations, grammar, speaking drills, AI practice and TOPIK preparation designed for Indian learners.",
      },
      { property: "og:title", content: "Hanji — Learn Korean from Hangul to TOPIK II" },
      {
        property: "og:description",
        content:
          "Structured Korean courses, AI speaking practice and TOPIK prep built mobile-first for Indian learners.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <PathSection />
      <LevelsSection />
      <HangulSection />
      <VocabSection />
      <GrammarSection />
      <SpeakingSection />
      <TopikSection />
      <AiSection />
      <DashboardPreview />
      <ProcessSection />
      <TestimonialSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="container-page grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <Reveal>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <span className="font-kr">한국어</span> · Built for Indian learners
          </Badge>
          <h1 className="mt-5 text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl lg:text-6xl">
            Read Hangul this week. <span className="text-gradient">Speak Korean</span> this year.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A calm, structured path from your first letter to TOPIK II — with English and Hindi
            explanations, daily 20-minute sessions and pronunciation feedback that actually
            corrects you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-12">
              <Link to="/learn">
                Start Learning <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12">
              <Link to="/topik">Take Placement Test</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="min-h-12">
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-xl font-semibold">{s.value}</dd>
                <p className="text-xs leading-snug text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-lift">
            <img
              src={heroImage}
              alt="A quiet Korean study desk with celadon vases, ink brushes and hanji paper at golden hour"
              width={1280}
              height={960}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 glass rounded-2xl p-4 shadow-lift sm:left-8 sm:right-auto sm:w-72">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="font-kr text-xl font-semibold">안녕하세요</p>
                <p className="truncate text-xs text-muted-foreground">
                  annyeonghaseyo · Hello · नमस्ते
                </p>
              </div>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Volume2 className="size-4" aria-hidden="true" />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <Section className="py-10 sm:py-12" tone="muted">
      <Reveal className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Trusted by learners preparing for
        </p>
        {["TOPIK I & II", "KIIP levels", "Korean workplaces in India", "University exchange"].map(
          (item) => (
            <span key={item} className="text-sm font-semibold">
              {item}
            </span>
          ),
        )}
        <span className="inline-flex items-center gap-1 text-sm font-semibold">
          <Star className="size-4 fill-gold text-gold" aria-hidden="true" /> 4.9 average rating
        </span>
      </Reveal>
    </Section>
  );
}

function PathSection() {
  return (
    <Section id="path">
      <SectionHeading
        eyebrow="Learning path"
        korean="학습 경로"
        title="One clear road, from first letter to fluent conversation"
        description="Every learner follows the same proven spine — placement, daily practice, spaced review, then real usage."
      />
      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {learningPath.map((item, i) => (
          <Reveal as="li" key={item.step} delay={i * 90} className="surface-card hover-lift p-6">
            <span className="font-display text-3xl font-semibold text-primary/40">
              {item.step}
            </span>
            <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
            <p className="font-kr text-sm text-muted-foreground">{item.korean}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function LevelsSection() {
  return (
    <Section id="levels" tone="muted">
      <SectionHeading
        eyebrow="Course levels"
        korean="레벨"
        title="Six levels, each with a finish line you can feel"
        description="Beginner through advanced, mapped to TOPIK bands so you always know where you stand."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, i) => (
          <Reveal key={course.id} delay={i * 70}>
            <article className="surface-card hover-lift flex h-full flex-col p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold">{course.title}</h3>
                  <p className="font-kr text-sm text-muted-foreground">{course.koreanTitle}</p>
                </div>
                <Badge className="shrink-0">{course.level}</Badge>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {course.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{course.lessons} lessons</span>
                <span aria-hidden="true">·</span>
                <span>{course.hours} hrs</span>
                <span aria-hidden="true">·</span>
                <span>{course.topik}</span>
              </div>
              <Button asChild variant="outline" className="mt-5 min-h-11">
                <Link to="/courses">View syllabus</Link>
              </Button>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function HangulSection() {
  return (
    <Section id="hangul">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <SectionHeading
          align="left"
          eyebrow="Hangul foundations"
          korean="한글"
          title="The alphabet takes days, not months"
          description="Hangul was designed to be learnable. Stroke-order animations, sound comparisons with Hindi and English, and syllable-block drills get you reading real signs within a week."
          className="max-w-none"
        />
        <Reveal delay={100} className="surface-card p-5 sm:p-7">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {hangulLetters.map((letter) => (
              <li
                key={letter.char}
                className="rounded-xl border border-border bg-secondary/60 p-3 text-center"
              >
                <span className="font-kr text-2xl font-semibold">{letter.char}</span>
                <p className="mt-1 text-xs font-medium">{letter.sound}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                  {letter.tip}
                </p>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 min-h-11 w-full sm:w-auto">
            <Link to="/learn">Practice Hangul</Link>
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}

function VocabSection() {
  return (
    <Section id="vocabulary" tone="muted">
      <SectionHeading
        eyebrow="Vocabulary"
        korean="어휘"
        title="Words you will actually use, with meaning in two languages"
        description="Every card carries pronunciation, English and Hindi meaning, and a natural example sentence."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {words.slice(0, 6).map((word, i) => (
          <Reveal key={word.hangul} delay={i * 60}>
            <WordCard word={word} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function GrammarSection() {
  return (
    <Section id="grammar">
      <SectionHeading
        eyebrow="Grammar"
        korean="문법"
        title="Patterns explained the way they are actually used"
        description="No grammar-table dumps. One pattern at a time, contrasted with familiar structures, then drilled in context."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {grammarPoints.map((point, i) => (
          <Reveal key={point.pattern} delay={i * 70} className="surface-card hover-lift p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-kr text-2xl font-semibold text-primary">{point.pattern}</span>
              <Badge variant="secondary">{point.meaning}</Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{point.note}</p>
            <div className="mt-4 rounded-xl bg-secondary/70 p-3">
              <p className="font-kr text-sm">{point.example}</p>
              <p className="mt-1 text-xs text-muted-foreground">{point.exampleEnglish}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SpeakingSection() {
  const items = [
    {
      icon: Mic,
      title: "Speaking drills",
      body: "Shadow native audio, record yourself and get syllable-level pronunciation scoring.",
    },
    {
      icon: Headphones,
      title: "Listening ladders",
      body: "Clips graded from slow classroom Korean to natural drama-speed conversation.",
    },
    {
      icon: PenLine,
      title: "Writing feedback",
      body: "Short writing tasks corrected for particles, spacing and register.",
    },
  ];
  return (
    <Section id="practice" tone="muted">
      <SectionHeading
        eyebrow="Practice"
        korean="연습"
        title="Output practice, not just recognition"
        description="Understanding Korean and producing Korean are different skills. We train both every session."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 80} className="surface-card hover-lift p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
              <item.icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8 text-center">
        <Button asChild size="lg" className="min-h-12">
          <Link to="/practice">Open practice hub</Link>
        </Button>
      </Reveal>
    </Section>
  );
}

function TopikSection() {
  return (
    <Section id="topik">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          align="left"
          className="max-w-none"
          eyebrow="TOPIK preparation"
          korean="토픽 대비"
          title="Walk into the exam knowing the paper"
          description="Full-length timed mocks, section strategy, and writing templates for tasks 51 to 54 with model answers and scoring rubrics."
        />
        <Reveal delay={100} className="surface-card p-6">
          <ul className="grid gap-4">
            {[
              "Adaptive mock papers for TOPIK I and TOPIK II",
              "Listening strategy for 40-question sprints",
              "Essay frames with band-scored model answers",
              "Weak-area reports after every attempt",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 min-h-11 w-full sm:w-auto">
            <Link to="/topik">Explore TOPIK track</Link>
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}

function AiSection() {
  return (
    <Section tone="muted">
      <SectionHeading
        eyebrow="AI practice"
        korean="AI 연습"
        title="A patient conversation partner, available at 6am"
        description="Role-play ordering food, an interview, or a first meeting. Get corrections in plain English, then try again."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Brain, t: "Adaptive difficulty", b: "Sentences scale with your last 20 answers." },
          { icon: Mic, t: "Pronunciation score", b: "Per-syllable feedback with a replay model." },
          { icon: Sparkles, t: "Instant corrections", b: "Why it was wrong, not just that it was." },
          { icon: BookOpen, t: "Saved mistakes", b: "Errors return automatically in tomorrow's review." },
        ].map((item, i) => (
          <Reveal key={item.t} delay={i * 70} className="surface-card hover-lift p-6">
            <item.icon className="size-5 text-accent" aria-hidden="true" />
            <h3 className="mt-3 text-base font-semibold">{item.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.b}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function DashboardPreview() {
  return (
    <Section id="progress">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <SectionHeading
          align="left"
          className="max-w-none"
          eyebrow="Progress"
          korean="진도"
          title="Streaks that reward consistency, not cramming"
          description="XP, level badges and skill breakdowns show exactly where reading is racing ahead of speaking — and what to do about it."
        />
        <Reveal delay={100}>
          <StreakStrip />
          <Button asChild variant="outline" className="mt-4 min-h-11 w-full sm:w-auto">
            <Link to="/progress">Open dashboard</Link>
          </Button>
        </Reveal>
      </div>
    </Section>
  );
}

function ProcessSection() {
  const steps = [
    { t: "Diagnose", b: "Six-minute placement test finds your true starting level." },
    { t: "Plan", b: "A daily 20-minute plan is generated around your target date." },
    { t: "Practice", b: "Lessons, drills and AI role-play stack into short sessions." },
    { t: "Prove", b: "Monthly checkpoints and mock exams confirm real progress." },
  ];
  return (
    <Section tone="muted">
      <SectionHeading
        eyebrow="How it works"
        korean="학습 과정"
        title="Four steps, repeated until Korean feels ordinary"
      />
      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.t} delay={i * 80} className="surface-card p-6">
            <span className="grid size-9 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function TestimonialSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Learner stories"
        korean="후기"
        title="Results from people who started exactly where you are"
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 80} className="surface-card hover-lift p-6">
            <div className="flex gap-1" aria-label="Rated 5 out of 5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="size-4 fill-gold text-gold" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed">“{t.quote}”</blockquote>
            <footer className="mt-4">
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </footer>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function FaqSection() {
  return (
    <Section id="faq" tone="muted">
      <SectionHeading eyebrow="FAQ" korean="자주 묻는 질문" title="Questions before you start" />
      <Reveal className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="surface-card px-5">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section>
      <Reveal className="surface-card hero-gradient overflow-hidden p-8 text-center sm:p-14">
        <p className="font-kr text-base text-primary">시작해 볼까요?</p>
        <h2 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">
          Your first Korean lesson takes twenty minutes
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Start free with Hangul, the placement test and daily practice. Upgrade only when you are
          ready for the full TOPIK track.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-h-12">
            <Link to="/learn">
              Start Learning <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-h-12">
            <Link to="/topik">Take Placement Test</Link>
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
