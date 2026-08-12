import type { SupabaseClient } from "@supabase/supabase-js";
import { generateText } from "ai";

import type { Database } from "@/integrations/supabase/types";
import { createLovableAiGatewayProvider, TUTOR_MODEL } from "./ai-gateway.server";
import { breakdownSentence, demoPronunciation, demoTurn, romanize } from "./ai/demo";
import type { PronunciationResult, TutorTurn } from "./ai/types";

type Db = SupabaseClient<Database>;

export const FREE_DAILY_AI_CONVERSATIONS = 1;

const SPEED_HINT: Record<string, string> = {
  very_slow: "Speak in very short, simple sentences (max 6 words).",
  slow: "Use short sentences (max 8 words) and common words only.",
  normal: "Use natural but clear beginner-friendly sentences.",
  fast: "Use natural conversational Korean at normal native pace.",
  native: "Use fully natural native Korean including contractions.",
};

function apiKey(): string | null {
  return process.env["LOVABLE_API_KEY"] ?? null;
}

function parseJson<T>(text: string): T | null {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export type TurnContext = {
  tutorName: string;
  personality: string;
  scenario?: { title: string; learnerRole: string; tutorRole: string; objective: string } | null;
  topic?: string;
  speechSpeed: string;
  level: string;
  history: { role: string; content: string }[];
  weaknesses: string[];
};

/** Generates the tutor's next line. Falls back to demo mode without credentials. */
export async function generateTutorTurn(userText: string, ctx: TurnContext): Promise<TutorTurn> {
  const key = apiKey();
  if (!key) return demoTurn(userText);

  const system = [
    `You are ${ctx.tutorName}, a Korean language tutor with a ${ctx.personality} personality.`,
    `The learner's level is ${ctx.level}. ${SPEED_HINT[ctx.speechSpeed] ?? SPEED_HINT["normal"]}`,
    ctx.scenario
      ? `Roleplay: you are the ${ctx.scenario.tutorRole}, the learner is the ${ctx.scenario.learnerRole}. Scene: ${ctx.scenario.title}. Objective: ${ctx.scenario.objective}. Stay in character and accept multiple valid learner answers.`
      : `Free conversation about: ${ctx.topic || "the learner's day"}.`,
    ctx.weaknesses.length
      ? `Gently recycle these known weak points when natural: ${ctx.weaknesses.join(", ")}.`
      : "",
    "Always answer with ONE short Korean line the learner can respond to.",
    'Reply with strict JSON only: {"ko":"","en":"","romanization":"","hintKo":"","hintEn":"","hintHi":"","breakdown":[{"ko":"","romanization":"","meaning":"","role":"","hindi":""}]}',
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(TUTOR_MODEL),
      system,
      messages: [
        ...ctx.history.slice(-12).map((m) => ({
          role: m.role === "tutor" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        })),
        { role: "user" as const, content: userText || "(the learner has not spoken yet)" },
      ],
    });
    const parsed = parseJson<{
      ko?: string;
      en?: string;
      romanization?: string;
      hintKo?: string;
      hintEn?: string;
      hintHi?: string;
      breakdown?: TutorTurn["breakdown"];
    }>(text);
    if (!parsed?.ko) return demoTurn(userText);
    return {
      contentKo: parsed.ko,
      contentEn: parsed.en ?? "",
      romanization: parsed.romanization || romanize(parsed.ko),
      breakdown: parsed.breakdown?.length ? parsed.breakdown : breakdownSentence(parsed.ko),
      hintKo: parsed.hintKo ?? "",
      hintEn: parsed.hintEn ?? "",
      hintHi: parsed.hintHi ?? "",
      demoMode: false,
    };
  } catch (error) {
    console.error("tutor turn failed", error);
    return demoTurn(userText);
  }
}

/** Scores a speaking attempt. Uses demo analysis when no credentials exist. */
export async function analyzePronunciation(
  target: string,
  transcript: string,
): Promise<PronunciationResult> {
  const key = apiKey();
  if (!key || !transcript.trim()) return demoPronunciation(target, transcript);
  try {
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(TUTOR_MODEL),
      system:
        "You evaluate a Korean learner's spoken sentence from its transcript. Score 0-100 for pronunciation, grammar, vocabulary, fluency, naturalness, confidence and overall. " +
        'Reply with strict JSON only: {"pronunciation":0,"grammar":0,"vocabulary":0,"fluency":0,"naturalness":0,"confidence":0,"overall":0,"problemTokens":[{"token":"","score":0,"tip":""}],"correctionKo":"","coachingNote":""}',
      prompt: `Target sentence: ${target}\nLearner transcript: ${transcript}`,
    });
    const parsed = parseJson<PronunciationResult>(text);
    if (!parsed || typeof parsed.overall !== "number") return demoPronunciation(target, transcript);
    return { ...parsed, problemTokens: parsed.problemTokens ?? [], demoMode: false };
  } catch (error) {
    console.error("pronunciation analysis failed", error);
    return demoPronunciation(target, transcript);
  }
}

/** Turns an English/Hindi intent into a natural Korean sentence (emergency help). */
export async function translateIntent(
  intent: string,
  speechSpeed: string,
): Promise<{ ko: string; romanization: string; en: string; demoMode: boolean }> {
  const key = apiKey();
  if (!key) {
    const ko = "그건 한국어로 어떻게 말해요?";
    return { ko, romanization: romanize(ko), en: "How do I say that in Korean?", demoMode: true };
  }
  try {
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway(TUTOR_MODEL),
      system: `Translate the learner's intent into ONE natural spoken Korean sentence. ${SPEECH_HINT_SAFE(speechSpeed)} Reply with strict JSON only: {"ko":"","romanization":"","en":""}`,
      prompt: intent,
    });
    const parsed = parseJson<{ ko?: string; romanization?: string; en?: string }>(text);
    if (!parsed?.ko) throw new Error("no translation");
    return {
      ko: parsed.ko,
      romanization: parsed.romanization || romanize(parsed.ko),
      en: parsed.en ?? intent,
      demoMode: false,
    };
  } catch (error) {
    console.error("translate intent failed", error);
    const ko = "그건 한국어로 어떻게 말해요?";
    return { ko, romanization: romanize(ko), en: intent, demoMode: true };
  }
}

function SPEECH_HINT_SAFE(speed: string) {
  return SPEED_HINT[speed] ?? SPEED_HINT["normal"];
}

/** Adds XP/coins, updates the streak and writes the learning-calendar row. */
export async function awardProgress(
  db: Db,
  userId: string,
  input: { xp?: number; coins?: number; minutes?: number; lessons?: number; words?: number; attempts?: number },
) {
  const today = new Date().toISOString().slice(0, 10);
  const { data: profile } = await db
    .from("profiles")
    .select("xp, coins, streak_days, longest_streak, last_active_date")
    .eq("id", userId)
    .maybeSingle();

  if (profile) {
    const last = profile.last_active_date as string | null;
    let streak = profile.streak_days ?? 0;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      streak = last === yesterday ? streak + 1 : 1;
    }
    await db
      .from("profiles")
      .update({
        xp: (profile.xp ?? 0) + (input.xp ?? 0),
        coins: (profile.coins ?? 0) + (input.coins ?? 0),
        streak_days: streak,
        longest_streak: Math.max(profile.longest_streak ?? 0, streak),
        last_active_date: today,
      })
      .eq("id", userId);
  }

  const { data: day } = await db
    .from("learning_days")
    .select("*")
    .eq("user_id", userId)
    .eq("day", today)
    .maybeSingle();

  const row = {
    user_id: userId,
    day: today,
    minutes: (day?.minutes ?? 0) + (input.minutes ?? 0),
    xp: (day?.xp ?? 0) + (input.xp ?? 0),
    lessons_completed: (day?.lessons_completed ?? 0) + (input.lessons ?? 0),
    words_reviewed: (day?.words_reviewed ?? 0) + (input.words ?? 0),
    speaking_attempts: (day?.speaking_attempts ?? 0) + (input.attempts ?? 0),
  };
  await db.from("learning_days").upsert(row, { onConflict: "user_id,day" });
}
