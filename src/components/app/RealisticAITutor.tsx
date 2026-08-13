import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { TutorState } from "@/lib/ai/types";

/**
 * Reusable tutor stage.
 *
 * Production intent: a photoreal Korean teacher with blinking, gaze, lip-sync,
 * expressions and gestures streamed from an avatar provider. The provider is
 * isolated behind `streamUrl` — when a real provider is connected the stage
 * renders its live stream and nothing else in the app changes. Until then we
 * render an ORIGINAL animated stage (clearly labelled a demo avatar) that is
 * driven by the same state machine the real avatar will consume.
 */
export type TutorPersona = {
  name: string;
  koreanName?: string | null;
  personality?: string | null;
  accentColor?: string | null;
  gender?: string | null;
};

const STATE_COPY: Record<TutorState, string> = {
  idle: "Ready when you are",
  listening: "Listening to you…",
  thinking: "Thinking…",
  speaking: "Speaking",
  celebrating: "Nice work!",
};

export function RealisticAITutor({
  persona,
  state,
  streamUrl = null,
  amplitude = 0,
  className,
  compact = false,
}: {
  persona: TutorPersona;
  state: TutorState;
  streamUrl?: string | null;
  /** 0–1 loudness, drives lip movement while speaking/listening. */
  amplitude?: number;
  className?: string;
  compact?: boolean;
}) {
  const [blink, setBlink] = useState(false);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        loop();
      }, 2200 + Math.random() * 2600);
    };
    loop();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setGaze({ x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 3 });
    }, 1900);
    return () => clearInterval(id);
  }, []);

  const accent = persona.accentColor || "hsl(var(--primary))";
  const mouthOpen =
    state === "speaking" ? 4 + amplitude * 16 : state === "celebrating" ? 8 : 2.5;
  const mouthWidth = state === "speaking" ? 26 - amplitude * 6 : 24;

  if (streamUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-3xl bg-black", className)}>
        <video src={streamUrl} autoPlay playsInline className="size-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 p-5 text-center shadow-lg",
        className,
      )}
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, ${accent} 22%, transparent), transparent 70%), hsl(var(--card))`,
      }}
      aria-label={`AI tutor ${persona.name}, ${STATE_COPY[state]}`}
      role="img"
    >
      {/* floating hangul particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-25">
        {["가", "나", "다", "한", "글"].map((ch, i) => (
          <span
            key={ch}
            className="absolute font-kr text-2xl animate-float-slow"
            style={{
              left: `${8 + i * 19}%`,
              top: `${12 + ((i * 27) % 60)}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      <div className="relative mx-auto" style={{ width: compact ? 120 : 168 }}>
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-xl transition-opacity",
            state === "listening" ? "opacity-70 animate-pulse" : "opacity-30",
          )}
          style={{ background: accent }}
          aria-hidden
        />
        <svg
          viewBox="0 0 120 140"
          className={cn(
            "relative w-full transition-transform duration-700",
            state === "speaking" && "animate-breathe",
            state === "celebrating" && "-rotate-2",
          )}
        >
          {/* shoulders */}
          <path d="M14 140 C18 108 40 98 60 98 C80 98 102 108 106 140 Z" fill={accent} opacity="0.85" />
          {/* neck */}
          <rect x="52" y="82" width="16" height="20" rx="8" fill="#f0c9ae" />
          {/* hair back */}
          <ellipse cx="60" cy="52" rx="34" ry="38" fill="#2b2118" />
          {/* face */}
          <ellipse cx="60" cy="56" rx="27" ry="31" fill="#f7d7bd" />
          {/* fringe */}
          <path d="M33 44 C38 24 82 24 87 44 C78 34 66 40 60 34 C52 42 40 36 33 44 Z" fill="#2b2118" />
          {/* eyes */}
          <g transform={`translate(${gaze.x} ${gaze.y})`}>
            {blink ? (
              <>
                <path d="M42 56 q7 4 14 0" stroke="#2b2118" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <path d="M64 56 q7 4 14 0" stroke="#2b2118" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="49" cy="56" rx="5" ry="5.6" fill="#fff" />
                <ellipse cx="71" cy="56" rx="5" ry="5.6" fill="#fff" />
                <circle cx="49" cy="56" r="3" fill="#2b2118" />
                <circle cx="71" cy="56" r="3" fill="#2b2118" />
                <circle cx="50.2" cy="54.6" r="1" fill="#fff" />
                <circle cx="72.2" cy="54.6" r="1" fill="#fff" />
              </>
            )}
          </g>
          {/* brows react to state */}
          <path
            d={state === "thinking" ? "M43 46 q6 -4 12 -1" : "M43 47 q6 -3 12 -1"}
            stroke="#2b2118"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M65 46 q6 -3 12 1" stroke="#2b2118" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* blush when celebrating */}
          {state === "celebrating" ? (
            <>
              <ellipse cx="42" cy="66" rx="5" ry="3" fill="#f09" opacity="0.18" />
              <ellipse cx="78" cy="66" rx="5" ry="3" fill="#f09" opacity="0.18" />
            </>
          ) : null}
          {/* mouth: lip-sync driven by amplitude */}
          {state === "speaking" ? (
            <ellipse cx="60" cy="74" rx={mouthWidth / 2.6} ry={mouthOpen / 2} fill="#8d3a3a" />
          ) : (
            <path
              d={
                state === "celebrating"
                  ? "M50 72 q10 10 20 0"
                  : state === "listening"
                    ? "M52 74 q8 4 16 0"
                    : "M52 74 q8 3 16 0"
              }
              stroke="#8d3a3a"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </svg>
      </div>

      <div className="relative mt-3">
        <p className="font-display text-lg font-semibold">
          {persona.name}
          {persona.koreanName ? (
            <span className="ml-2 font-kr text-sm text-muted-foreground">{persona.koreanName}</span>
          ) : null}
        </p>
        <p className="text-xs capitalize text-muted-foreground">
          {(persona.personality ?? "friendly teacher").replace(/_/g, " ")}
        </p>
        <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
          <span
            className={cn(
              "size-2 rounded-full",
              state === "listening" && "bg-rose-500 animate-pulse",
              state === "thinking" && "bg-amber-500 animate-pulse",
              state === "speaking" && "bg-emerald-500",
              state === "idle" && "bg-muted-foreground/50",
              state === "celebrating" && "bg-fuchsia-500",
            )}
          />
          {STATE_COPY[state]}
        </span>
        <p className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">
          Demo avatar — 3D provider not connected
        </p>
      </div>
    </div>
  );
}
