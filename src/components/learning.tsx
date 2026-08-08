import { useState } from "react";
import { Volume2, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useKoreanSpeech } from "@/hooks/use-korean-speech";
import { cn } from "@/lib/utils";
import type { QuizQuestion, Word } from "@/lib/content";

export function WordCard({ word }: { word: Word }) {
  const { speak, speaking } = useKoreanSpeech();
  return (
    <article className="surface-card hover-lift p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="font-kr text-2xl leading-tight font-semibold">{word.hangul}</p>
          <p className="mt-1 text-sm text-muted-foreground">{word.romanization}</p>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="size-11 shrink-0 rounded-full"
          aria-label={`Play pronunciation of ${word.hangul}`}
          onClick={() => speak(word.hangul)}
        >
          <Volume2 className={cn("size-5", speaking && "animate-pulse")} />
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary">EN · {word.english}</Badge>
        <Badge variant="outline" className="font-normal">
          HI · {word.hindi}
        </Badge>
      </div>
      <div className="mt-4 rounded-xl bg-secondary/70 p-3">
        <p className="font-kr text-sm">{word.example}</p>
        <p className="mt-1 text-xs text-muted-foreground">{word.exampleEnglish}</p>
      </div>
    </article>
  );
}

export function Flashcard({ word }: { word: Word }) {
  const [flipped, setFlipped] = useState(false);
  const { speak } = useKoreanSpeech();

  return (
    <div className="surface-card p-6 text-center">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-label={flipped ? "Show Korean side" : "Show meaning side"}
        className="flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-xl transition-transform hover:scale-[1.01]"
      >
        {flipped ? (
          <>
            <p className="text-xl font-semibold">{word.english}</p>
            <p className="text-sm text-muted-foreground">{word.hindi}</p>
            <p className="mt-2 text-xs text-muted-foreground">{word.exampleEnglish}</p>
          </>
        ) : (
          <>
            <p className="font-kr text-4xl font-semibold">{word.hangul}</p>
            <p className="text-sm text-muted-foreground">{word.romanization}</p>
          </>
        )}
      </button>
      <div className="mt-4 flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setFlipped((v) => !v)}>
          <RotateCcw className="size-4" />
          Flip
        </Button>
        <Button variant="secondary" size="sm" onClick={() => speak(word.hangul)}>
          <Volume2 className="size-4" />
          Listen
        </Button>
      </div>
    </div>
  );
}

export function QuizBlock({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete?: (score: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[index]!;
  const correct = choice.trim().toLowerCase() === question.answer.toLowerCase();
  const isLast = index === questions.length - 1;

  function check() {
    if (!choice.trim()) return;
    setChecked(true);
    if (correct) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) {
      onComplete?.(correct ? score + 0 : score);
      return;
    }
    setIndex((i) => i + 1);
    setChoice("");
    setChecked(false);
  }

  return (
    <div className="surface-card p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Question {index + 1} of {questions.length}
        </p>
        <Badge variant="secondary">{score} correct</Badge>
      </div>
      <Progress
        className="mt-3 h-2"
        value={((index + (checked ? 1 : 0)) / questions.length) * 100}
      />

      <h3 className="mt-6 text-lg font-semibold">{question.prompt}</h3>
      {question.korean ? (
        <p className="mt-2 font-kr text-3xl font-semibold text-primary">{question.korean}</p>
      ) : null}

      {question.type === "mcq" ? (
        <div role="radiogroup" aria-label={question.prompt} className="mt-5 grid gap-2">
          {question.options?.map((option) => {
            const selected = choice === option;
            const state =
              checked && option === question.answer
                ? "correct"
                : checked && selected
                  ? "wrong"
                  : "idle";
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={checked}
                onClick={() => setChoice(option)}
                className={cn(
                  "flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                  selected ? "border-primary bg-primary-soft" : "border-border bg-card",
                  state === "correct" && "border-success bg-success/10",
                  state === "wrong" && "border-destructive bg-destructive/10",
                )}
              >
                <span className="font-kr">{option}</span>
                {state === "correct" ? <Check className="size-4 text-success" /> : null}
                {state === "wrong" ? <X className="size-4 text-destructive" /> : null}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5">
          <label htmlFor={`answer-${question.id}`} className="text-sm font-medium">
            Your answer
          </label>
          <Input
            id={`answer-${question.id}`}
            value={choice}
            disabled={checked}
            onChange={(e) => setChoice(e.target.value)}
            placeholder="Type in Korean"
            className="mt-2 h-12 font-kr"
          />
        </div>
      )}

      {checked ? (
        <p
          role="status"
          className={cn(
            "mt-4 rounded-xl p-3 text-sm",
            correct ? "bg-success/10 text-foreground" : "bg-destructive/10 text-foreground",
          )}
        >
          <strong>{correct ? "Correct." : `Answer: ${question.answer}.`}</strong>{" "}
          {question.explanation}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {!checked ? (
          <Button onClick={check} disabled={!choice.trim()} className="min-h-11">
            Check answer
          </Button>
        ) : (
          <Button onClick={next} className="min-h-11">
            {isLast ? "Finish" : "Next question"}
          </Button>
        )}
      </div>
    </div>
  );
}
