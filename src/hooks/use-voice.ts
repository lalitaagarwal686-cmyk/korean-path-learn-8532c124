import { useCallback, useEffect, useRef, useState } from "react";

import { rateFor } from "@/lib/ai/types";

type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

function recognitionCtor(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"]) as (new () => RecognitionLike) | null;
}

/**
 * Browser speech-to-text adapter. Swapping to a streaming cloud STT provider
 * means replacing this hook's internals only — the UI contract stays the same.
 */
export function useSpeechRecognition(lang = "ko-KR") {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<RecognitionLike | null>(null);

  useEffect(() => {
    setSupported(Boolean(recognitionCtor()));
  }, []);

  const start = useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor) {
      setError("unsupported");
      return;
    }
    setError(null);
    setTranscript("");
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i]?.[0]?.transcript ?? "";
      }
      setTranscript(text.trim());
    };
    rec.onerror = (event) => setError(event.error ?? "error");
    rec.onend = () => setListening(false);
    ref.current = rec;
    rec.start();
    setListening(true);
  }, [lang]);

  const stop = useCallback(() => {
    ref.current?.stop();
    ref.current = null;
    setListening(false);
  }, []);

  useEffect(() => () => ref.current?.stop(), []);

  return { supported, listening, transcript, error, start, stop, setTranscript };
}

/** Live microphone amplitude (0–1) for the waveform visualisation. */
export function useMicLevel(active: boolean) {
  const [level, setLevel] = useState(0);
  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 28 }, () => 0.06));
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!active || typeof window === "undefined") {
      setLevel(0);
      return;
    }
    let stream: MediaStream | null = null;
    let ctx: AudioContext | null = null;
    let raf = 0;
    let cancelled = false;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) return;
        ctx = new AudioContext();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (const v of data) sum += (v - 128) ** 2;
          const rms = Math.sqrt(sum / data.length) / 128;
          const next = Math.min(1, rms * 3.2);
          setLevel(next);
          setBars((prev) => [...prev.slice(1), Math.max(0.06, next)]);
          raf = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setDenied(true);
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      void ctx?.close();
    };
  }, [active]);

  return { level, bars, denied };
}

/** Browser text-to-speech adapter with learner speed control. */
export function useTutorVoice() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text: string, speed = "normal") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    u.rate = rateFor(speed);
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  return { speak, cancel, speaking };
}
