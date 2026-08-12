/**
 * Provider-agnostic contracts for the AI layer.
 *
 * Every AI capability the product needs is expressed here as a narrow
 * interface. Swapping in a real vendor (realtime voice, STT, TTS,
 * pronunciation scoring, photoreal avatar) means implementing one of these
 * adapters — no UI rewrite required.
 */

export type SpeechSpeed = "very_slow" | "slow" | "normal" | "fast" | "native";

export const SPEECH_SPEEDS: { value: SpeechSpeed; label: string; rate: number }[] = [
  { value: "very_slow", label: "Very Slow", rate: 0.55 },
  { value: "slow", label: "Slow", rate: 0.75 },
  { value: "normal", label: "Normal", rate: 0.95 },
  { value: "fast", label: "Fast", rate: 1.15 },
  { value: "native", label: "Native", rate: 1.35 },
];

export function rateFor(speed: string): number {
  return SPEECH_SPEEDS.find((s) => s.value === speed)?.rate ?? 0.95;
}

export type TutorState = "idle" | "listening" | "thinking" | "speaking" | "celebrating";

export type WordBreakdownToken = {
  ko: string;
  romanization: string;
  meaning: string;
  role: string;
  hindi: string;
};

export type TutorTurn = {
  contentKo: string;
  contentEn: string;
  romanization: string;
  breakdown: WordBreakdownToken[];
  hintKo: string;
  hintEn: string;
  hintHi: string;
  demoMode: boolean;
};

export type PronunciationScores = {
  pronunciation: number;
  grammar: number;
  vocabulary: number;
  fluency: number;
  naturalness: number;
  confidence: number;
  overall: number;
};

export type ProblemToken = {
  token: string;
  score: number;
  tip: string;
};

export type PronunciationResult = PronunciationScores & {
  problemTokens: ProblemToken[];
  correctionKo: string;
  coachingNote: string;
  demoMode: boolean;
};

/** Speech-to-text adapter (browser Web Speech API by default). */
export interface SttAdapter {
  readonly id: string;
  supported: boolean;
  start(onResult: (transcript: string, isFinal: boolean) => void): Promise<void>;
  stop(): void;
}

/** Text-to-speech adapter (browser speech synthesis by default). */
export interface TtsAdapter {
  readonly id: string;
  supported: boolean;
  speak(text: string, opts?: { rate?: number; voiceId?: string }): Promise<void>;
  cancel(): void;
}

/** Realistic avatar adapter. Returns null when no provider is connected. */
export interface AvatarAdapter {
  readonly id: string;
  connected: boolean;
  /** URL of a live avatar stream, when a provider is wired up. */
  streamUrl(tutorSlug: string): string | null;
}
