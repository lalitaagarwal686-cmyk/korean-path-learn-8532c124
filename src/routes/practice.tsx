import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Mic, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/Reveal";
import { Flashcard, QuizBlock } from "@/components/learning";
import { useKoreanSpeech } from "@/hooks/use-korean-speech";
import { quiz, words } from "@/lib/content";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Korean Practice Hub — Flashcards, Quizzes & Speaking | Hanji" },
      {
        name: "description",
        content:
          "Daily Korean practice: spaced-repetition flashcards, multiple choice and fill-in-the-blank quizzes, plus listening and speaking drills.",
      },
      { property: "og:title", content: "Korean Practice Hub — Flashcards, Quizzes & Speaking" },
      {
        property: "og:description",
        content: "Flashcards, quizzes and speaking drills for daily Korean practice.",
      },
    ],
  }),
  component: PracticePage,
});

function PracticePage() {
  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="text-2xl font-semibold sm:text-3xl">Practice hub</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Twenty minutes, four modes. Review words you are about to forget, then push into
        production.
      </p>

      <Tabs defaultValue="flashcards" className="mt-8">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="flashcards" className="min-h-10">
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="quiz" className="min-h-10">
            Quiz
          </TabsTrigger>
          <TabsTrigger value="listening" className="min-h-10">
            Listening
          </TabsTrigger>
          <TabsTrigger value="speaking" className="min-h-10">
            Speaking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="mt-8">
          <FlashcardDeck />
        </TabsContent>
        <TabsContent value="quiz" className="mt-8">
          <div className="mx-auto max-w-2xl">
            <QuizBlock questions={quiz} />
          </div>
        </TabsContent>
        <TabsContent value="listening" className="mt-8">
          <ListeningDrill />
        </TabsContent>
        <TabsContent value="speaking" className="mt-8">
          <SpeakingDrill />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FlashcardDeck() {
  const [index, setIndex] = useState(0);
  const word = words[index]!;
  return (
    <Reveal className="mx-auto max-w-md">
      <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground">
        Card {index + 1} of {words.length}
      </p>
      <div className="mt-3">
        <Flashcard word={word} />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          className="min-h-11"
          onClick={() => setIndex((i) => (i - 1 + words.length) % words.length)}
        >
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <Button className="min-h-11" onClick={() => setIndex((i) => (i + 1) % words.length)}>
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </Reveal>
  );
}

function ListeningDrill() {
  const { speak } = useKoreanSpeech();
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {words.slice(0, 4).map((word, i) => (
        <Reveal key={word.hangul} delay={i * 60} className="surface-card p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <p className="min-w-0 text-sm text-muted-foreground">
              Listen and identify the sentence.
            </p>
            <Button
              size="icon"
              className="size-12 shrink-0 rounded-full"
              aria-label={`Play audio clip ${i + 1}`}
              onClick={() => speak(word.example)}
            >
              <Volume2 className="size-5" />
            </Button>
          </div>
          <details className="mt-4 rounded-xl bg-secondary/70 p-4">
            <summary className="cursor-pointer text-sm font-medium">Show transcript</summary>
            <p className="mt-2 font-kr text-sm">{word.example}</p>
            <p className="mt-1 text-xs text-muted-foreground">{word.exampleEnglish}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

function SpeakingDrill() {
  const { speak } = useKoreanSpeech();
  const [recording, setRecording] = useState(false);
  return (
    <div className="mx-auto max-w-2xl">
      <Reveal className="surface-card p-6 sm:p-8">
        <Badge variant="secondary">Shadowing drill</Badge>
        <p className="mt-4 font-kr text-3xl font-semibold">저는 인도에서 왔어요.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          jeoneun indo-eseo wasseoyo · I came from India.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            className="min-h-11"
            onClick={() => speak("저는 인도에서 왔어요.")}
          >
            <Volume2 className="size-4" /> Hear model
          </Button>
          <Button
            className="min-h-11"
            aria-pressed={recording}
            onClick={() => setRecording((v) => !v)}
          >
            <Mic className="size-4" /> {recording ? "Stop recording" : "Record yourself"}
          </Button>
        </div>
        {recording ? (
          <p role="status" className="mt-4 text-sm text-muted-foreground">
            Listening… speak the sentence at a natural pace.
          </p>
        ) : null}
      </Reveal>
    </div>
  );
}
