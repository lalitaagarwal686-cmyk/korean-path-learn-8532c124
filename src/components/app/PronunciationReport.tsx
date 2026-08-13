import { RotateCcw, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useKoreanSpeech } from "@/hooks/use-korean-speech";
import type { PronunciationResult } from "@/lib/ai/types";
import { cn } from "@/lib/utils";

const METRICS: { key: keyof PronunciationResult; label: string }[] = [
  { key: "pronunciation", label: "Pronunciation" },
  { key: "grammar", label: "Grammar" },
  { key: "vocabulary", label: "Vocabulary" },
  { key: "fluency", label: "Fluency" },
  { key: "naturalness", label: "Naturalness" },
  { key: "confidence", label: "Confidence" },
];

export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700",
            value >= 85 ? "bg-success" : value >= 70 ? "bg-primary" : "bg-accent",
          )}
          style={{ width: `${Math.max(4, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export function PronunciationReport({
  result,
  target,
  onRetry,
}: {
  result: PronunciationResult;
  target: string;
  onRetry?: () => void;
}) {
  const { speak } = useKoreanSpeech();

  return (
    <section className="surface-card p-5" aria-label="Pronunciation analysis">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold">Speaking analysis</h3>
          <p className="text-xs text-muted-foreground">
            {result.demoMode
              ? "Demo analysis — heuristic scoring, not a real pronunciation model."
              : "Scored by the AI speaking coach."}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-bold text-primary tabular-nums">
            {result.overall}%
          </p>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Overall</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {METRICS.map((m) => (
          <ScoreBar key={m.key} label={m.label} value={Number(result[m.key] ?? 0)} />
        ))}
      </div>

      {result.problemTokens.length ? (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sounds to fix
          </p>
          <ul className="mt-2 grid gap-2">
            {result.problemTokens.map((t) => (
              <li
                key={t.token}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/40 p-3"
              >
                <button
                  type="button"
                  onClick={() => speak(t.token)}
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                  aria-label={`Play ${t.token}`}
                >
                  <Volume2 className="size-4" />
                </button>
                <div className="min-w-0">
                  <p className="font-kr text-base font-semibold">
                    {t.token} <span className="text-xs text-muted-foreground">{t.score}%</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{t.tip}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.coachingNote ? (
        <p className="mt-4 rounded-xl bg-primary/8 p-3 text-sm">{result.coachingNote}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => speak(result.correctionKo || target)}>
          <Volume2 className="size-4" /> Listen to the model answer
        </Button>
        {onRetry ? (
          <Button size="sm" onClick={onRetry}>
            <RotateCcw className="size-4" /> Repeat & retry
          </Button>
        ) : null}
      </div>
    </section>
  );
}
