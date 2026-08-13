import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import {
  Languages,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Square,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PronunciationReport } from "@/components/app/PronunciationReport";
import { RealisticAITutor, type TutorPersona } from "@/components/app/RealisticAITutor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMicLevel, useSpeechRecognition, useTutorVoice } from "@/hooks/use-voice";
import { SPEECH_SPEEDS, type PronunciationResult, type TutorState, type TutorTurn } from "@/lib/ai/types";
import {
  analyzeAttempt,
  emergencyHelp,
  endConversation,
  sendTurn,
  startConversation,
} from "@/lib/learning.functions";
import { cn } from "@/lib/utils";

type Msg = {
  role: "tutor" | "user";
  ko: string;
  en?: string;
  romanization?: string;
  breakdown?: TutorTurn["breakdown"];
};

export function VoiceConversation({
  kind,
  scenarioId,
  lessonId,
  tutorId,
  topic,
  tutor,
  title,
}: {
  kind: "scenario" | "free_talk" | "lesson" | "shadowing";
  scenarioId?: string | null;
  lessonId?: string | null;
  tutorId?: string | null;
  topic?: string;
  tutor: TutorPersona;
  title: string;
}) {
  const start = useServerFn(startConversation);
  const turn = useServerFn(sendTurn);
  const analyze = useServerFn(analyzeAttempt);
  const finish = useServerFn(endConversation);
  const help = useServerFn(emergencyHelp);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [state, setState] = useState<TutorState>("idle");
  const [speed, setSpeed] = useState("normal");
  const [busy, setBusy] = useState(false);
  const [limited, setLimited] = useState(false);
  const [demo, setDemo] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [hints, setHints] = useState<{ ko: string; en: string; hi: string }>({ ko: "", en: "", hi: "" });
  const [showTranslation, setShowTranslation] = useState(true);
  const [typed, setTyped] = useState("");
  const [rescue, setRescue] = useState("");
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [ended, setEnded] = useState(false);

  const { speak, cancel, speaking } = useTutorVoice();
  const stt = useSpeechRecognition();
  const { bars, level, denied } = useMicLevel(stt.listening);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const lastTutor = [...messages].reverse().find((m) => m.role === "tutor");

  useEffect(() => {
    if (!sessionId || ended) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [sessionId, ended]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (speaking) setState("speaking");
    else if (stt.listening) setState("listening");
    else if (busy) setState("thinking");
    else setState((s) => (s === "celebrating" ? s : "idle"));
  }, [speaking, stt.listening, busy]);

  const begin = useCallback(async () => {
    setBusy(true);
    try {
      const res = await start({
        data: {
          kind,
          scenarioId: scenarioId ?? null,
          lessonId: lessonId ?? null,
          tutorId: tutorId ?? null,
          topic: topic ?? "",
          speechSpeed: speed,
        },
      });
      if (res.error === "limit_reached") {
        setLimited(true);
        return;
      }
      setSessionId(res.session?.id ?? null);
      setDemo(Boolean(res.opening?.demoMode));
      if (res.opening) {
        setMessages([
          {
            role: "tutor",
            ko: res.opening.contentKo,
            en: res.opening.contentEn,
            romanization: res.opening.romanization,
            breakdown: res.opening.breakdown,
          },
        ]);
        speak(res.opening.contentKo, speed);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not start the conversation. Please try again.");
    } finally {
      setBusy(false);
    }
  }, [start, kind, scenarioId, lessonId, tutorId, topic, speed, speak]);

  const submit = useCallback(
    async (text: string) => {
      if (!sessionId || !text.trim()) return;
      const target = lastTutor?.ko ?? "";
      setMessages((m) => [...m, { role: "user", ko: text }]);
      setTyped("");
      stt.setTranscript("");
      setHintLevel(0);
      setBusy(true);
      setState("thinking");
      try {
        const [reply, scored] = await Promise.all([
          turn({ data: { sessionId, userText: text } }),
          analyze({
            data: {
              sessionId,
              lessonId: lessonId ?? null,
              targetText: target || text,
              transcript: text,
              mode: kind === "shadowing" ? ("shadowing" as const) : ("free" as const),
            },
          }),
        ]);
        setResult(scored);
        setDemo(reply.demoMode);
        setHints({ ko: reply.hintKo, en: reply.hintEn, hi: reply.hintHi });
        setMessages((m) => [
          ...m,
          {
            role: "tutor",
            ko: reply.contentKo,
            en: reply.contentEn,
            romanization: reply.romanization,
            breakdown: reply.breakdown,
          },
        ]);
        speak(reply.contentKo, speed);
        if (scored.overall >= 85) {
          setState("celebrating");
          setTimeout(() => setState("idle"), 2200);
        }
      } catch (error) {
        console.error(error);
        toast.error("The tutor could not reply. Please try again.");
      } finally {
        setBusy(false);
      }
    },
    [sessionId, lastTutor, turn, analyze, lessonId, kind, speak, speed, stt],
  );

  const toggleMic = useCallback(() => {
    if (stt.listening) {
      stt.stop();
      const text = stt.transcript.trim();
      if (text) void submit(text);
      return;
    }
    cancel();
    stt.start();
  }, [stt, submit, cancel]);

  const end = useCallback(async () => {
    if (!sessionId) return;
    setBusy(true);
    try {
      await finish({ data: { sessionId, seconds } });
      setEnded(true);
      toast.success("Session saved to your conversation history.");
    } finally {
      setBusy(false);
    }
  }, [sessionId, seconds, finish]);

  const askRescue = useCallback(async () => {
    if (!rescue.trim()) return;
    setBusy(true);
    try {
      const res = await help({ data: { intent: rescue, speechSpeed: speed } });
      setHints({ ko: res.ko, en: res.en, hi: res.en });
      setHintLevel(1);
      setRescue("");
      speak(res.ko, speed);
      toast.success("Try saying this out loud.");
    } finally {
      setBusy(false);
    }
  }, [rescue, help, speed, speak]);

  if (limited) {
    return (
      <div className="surface-card p-8 text-center">
        <h2 className="font-display text-xl font-semibold">Daily conversation key used</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Free learners get 1 AI conversation per day. Every lesson, vocabulary drill, grammar
          topic and TOPIK practice stays free — or go Premium for unlimited speaking.
        </p>
        <Button asChild className="mt-5">
          <Link to="/app/pricing">See Premium</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <RealisticAITutor persona={tutor} state={state} amplitude={level} />

        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Speaking speed
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SPEECH_SPEEDS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSpeed(s.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  speed === s.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="mt-4 flex items-center justify-between text-xs font-medium">
            Show English translation
            <input
              type="checkbox"
              checked={showTranslation}
              onChange={(e) => setShowTranslation(e.target.checked)}
              className="size-4 accent-[var(--primary)]"
            />
          </label>
        </div>

        <div className="surface-card p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            I don't know how to say this
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Type it in English or Hindi — you'll get natural Korean to speak.
          </p>
          <div className="mt-2 flex gap-2">
            <Input
              value={rescue}
              onChange={(e) => setRescue(e.target.value)}
              placeholder="I want to order an iced coffee"
              aria-label="Emergency help"
            />
            <Button size="icon" variant="outline" onClick={askRescue} disabled={busy}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="surface-card flex min-h-[560px] flex-col p-4">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
          <div>
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">
              {sessionId
                ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} · ${messages.filter((m) => m.role === "user").length} turns`
                : "Press start when you're ready to speak"}
              {demo ? " · demo mode" : ""}
            </p>
          </div>
          {sessionId && !ended ? (
            <Button variant="outline" size="sm" onClick={end} disabled={busy}>
              <Square className="size-4" /> End & save
            </Button>
          ) : null}
        </header>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto py-4">
          {!sessionId ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="max-w-sm text-sm text-muted-foreground">
                Your tutor will greet you in Korean, wait for your voice, then correct your
                pronunciation after every line.
              </p>
              <Button size="lg" onClick={begin} disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Mic className="size-4" />}
                Start speaking
              </Button>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                m.role === "tutor"
                  ? "bg-secondary"
                  : "ml-auto bg-primary text-primary-foreground",
              )}
            >
              <p className="font-kr text-base leading-relaxed">{m.ko}</p>
              {m.romanization ? (
                <p className={cn("text-xs", m.role === "tutor" ? "text-muted-foreground" : "opacity-80")}>
                  {m.romanization}
                </p>
              ) : null}
              {showTranslation && m.en ? (
                <p className={cn("mt-1 text-xs", m.role === "tutor" ? "text-muted-foreground" : "opacity-80")}>
                  {m.en}
                </p>
              ) : null}
              {m.role === "tutor" ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speak(m.ko, speed)}
                    className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-medium"
                  >
                    <Volume2 className="size-3" /> Replay
                  </button>
                  {m.breakdown?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {m.breakdown.map((t, j) => (
                        <span
                          key={`${t.ko}-${j}`}
                          title={`${t.romanization} · ${t.meaning} · ${t.role}${t.hindi ? ` · ${t.hindi}` : ""}`}
                          className="cursor-help rounded-md bg-background/70 px-1.5 py-0.5 font-kr text-[11px]"
                        >
                          {t.ko}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}

          {busy && sessionId ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> Tutor is thinking…
            </div>
          ) : null}
        </div>

        {hintLevel > 0 ? (
          <div className="mb-3 rounded-xl bg-gold/15 p-3 text-sm">
            <p className="font-kr">{hints.ko || "…"}</p>
            {hintLevel > 1 ? <p className="mt-1 text-xs text-muted-foreground">{hints.en}</p> : null}
            {hintLevel > 2 ? <p className="mt-1 text-xs text-muted-foreground">{hints.hi}</p> : null}
          </div>
        ) : null}

        {sessionId && !ended ? (
          <div className="space-y-3 border-t border-border/70 pt-3">
            <div className="flex h-12 items-end justify-center gap-[3px]" aria-hidden>
              {bars.map((b, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-[3px] rounded-full transition-[height] duration-75",
                    stt.listening ? "bg-primary" : "bg-border",
                  )}
                  style={{ height: `${Math.max(4, b * 46)}px` }}
                />
              ))}
            </div>

            {stt.listening ? (
              <p className="text-center font-kr text-sm text-muted-foreground">
                {stt.transcript || "…"}
              </p>
            ) : null}

            {denied || stt.error === "unsupported" ? (
              <p className="text-center text-xs text-destructive">
                Microphone unavailable in this browser — type your answer instead.
              </p>
            ) : null}

            <div className="flex items-center gap-2">
              <Button
                size="lg"
                onClick={toggleMic}
                className={cn("flex-1", stt.listening && "bg-destructive hover:bg-destructive/90")}
                disabled={busy}
              >
                {stt.listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                {stt.listening ? "Stop & send" : "Hold the mic and speak"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Hint"
                onClick={() => setHintLevel((h) => (h + 1) % 4)}
              >
                <Lightbulb className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Toggle translation"
                onClick={() => setShowTranslation((v) => !v)}
              >
                <Languages className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Repeat tutor line"
                onClick={() => lastTutor && speak(lastTutor.ko, speed)}
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>

            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void submit(typed);
              }}
            >
              <Input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="…or type your Korean answer"
                className="font-kr"
                aria-label="Type your answer"
              />
              <Button type="submit" variant="secondary" disabled={busy || !typed.trim()}>
                Send
              </Button>
            </form>
          </div>
        ) : null}

        {ended ? (
          <div className="border-t border-border/70 pt-4 text-center">
            <p className="text-sm font-medium">Session saved.</p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link to="/app/history">View conversation report</Link>
            </Button>
          </div>
        ) : null}
      </div>

      {result ? (
        <div className="lg:col-span-2">
          <PronunciationReport
            result={result}
            target={lastTutor?.ko ?? ""}
            onRetry={() => {
              setResult(null);
              stt.start();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
