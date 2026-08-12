import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import { analyzePronunciation, awardProgress, generateTutorTurn, FREE_DAILY_AI_CONVERSATIONS } from "./ai.server";
import { demoTurn, romanize } from "./ai/demo";

type Db = SupabaseClient<Database>;

const today = () => new Date().toISOString().slice(0, 10);

export async function getEntitlementFor(db: Db, userId: string) {
  const { data: sub } = await db
    .from("subscriptions")
    .select("plan, status, billing_period, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();
  const { data: usage } = await db
    .from("ai_usage")
    .select("conversations_started")
    .eq("user_id", userId)
    .eq("usage_date", today())
    .maybeSingle();

  const premium = sub?.plan === "premium" && sub?.status === "active";
  const used = usage?.conversations_started ?? 0;
  return {
    plan: premium ? "premium" : "free",
    status: sub?.status ?? "none",
    billingPeriod: sub?.billing_period ?? "monthly",
    currentPeriodEnd: sub?.current_period_end ?? null,
    conversationsUsedToday: used,
    dailyLimit: premium ? null : FREE_DAILY_AI_CONVERSATIONS,
    canStartConversation: premium || used < FREE_DAILY_AI_CONVERSATIONS,
    aiConnected: Boolean(process.env["LOVABLE_API_KEY"]),
  };
}

export async function createSession(
  db: Db,
  userId: string,
  input: {
    kind: "scenario" | "free_talk" | "lesson" | "shadowing";
    scenarioId?: string | null | undefined;
    lessonId?: string | null | undefined;
    tutorId?: string | null | undefined;
    topic: string;
    speechSpeed: string;
  },
) {
  const entitlement = await getEntitlementFor(db, userId);
  if (!entitlement.canStartConversation) {
    return { error: "limit_reached" as const, entitlement, session: null, opening: null };
  }

  const { data: scenario } = input.scenarioId
    ? await db.from("scenarios").select("*").eq("id", input.scenarioId).maybeSingle()
    : { data: null };

  const { data: session, error } = await db
    .from("conversation_sessions")
    .insert({
      user_id: userId,
      kind: input.kind,
      scenario_id: input.scenarioId ?? null,
      lesson_id: input.lessonId ?? null,
      tutor_id: input.tutorId ?? null,
      topic: input.topic || scenario?.title || "",
      speech_speed: input.speechSpeed,
      demo_mode: !entitlement.aiConnected,
    })
    .select("*")
    .single();
  if (error || !session) throw new Error(error?.message ?? "Could not start the conversation");

  const openingKo = scenario?.opening_line_ko || "안녕하세요! 오늘 기분 어때요?";
  const openingEn = scenario?.opening_line_en || "Hello! How are you feeling today?";
  const opening = {
    ...demoTurn("", openingKo),
    contentEn: openingEn,
    demoMode: !entitlement.aiConnected,
  };

  await db.from("conversation_messages").insert({
    session_id: session.id,
    user_id: userId,
    role: "tutor",
    content_ko: opening.contentKo,
    content_en: opening.contentEn,
    romanization: opening.romanization,
    breakdown: opening.breakdown,
  });

  const { data: usage } = await db
    .from("ai_usage")
    .select("conversations_started")
    .eq("user_id", userId)
    .eq("usage_date", today())
    .maybeSingle();
  await db.from("ai_usage").upsert(
    {
      user_id: userId,
      usage_date: today(),
      conversations_started: (usage?.conversations_started ?? 0) + 1,
    },
    { onConflict: "user_id,usage_date" },
  );

  return { error: null, entitlement, session, opening };
}

export async function respondToTurn(db: Db, userId: string, sessionId: string, userText: string) {
  const { data: session } = await db
    .from("conversation_sessions")
    .select("*, scenarios(*), tutors(*)")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session) throw new Error("Conversation not found");

  if (userText.trim()) {
    await db.from("conversation_messages").insert({
      session_id: sessionId,
      user_id: userId,
      role: "user",
      content_ko: userText,
      romanization: romanize(userText),
    });
  }

  const { data: history } = await db
    .from("conversation_messages")
    .select("role, content_ko")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(20);

  const { data: profile } = await db
    .from("profiles")
    .select("level")
    .eq("id", userId)
    .maybeSingle();
  const { data: mistakes } = await db
    .from("mistakes")
    .select("original, correction")
    .eq("user_id", userId)
    .eq("resolved", false)
    .order("created_at", { ascending: false })
    .limit(5);

  const scenario = session.scenarios;
  const tutor = session.tutors;
  const turn = await generateTutorTurn(userText, {
    tutorName: tutor?.name ?? "Seo-yeon",
    personality: tutor?.personality ?? "friendly teacher",
    scenario: scenario
      ? {
          title: scenario.title,
          learnerRole: scenario.learner_role,
          tutorRole: scenario.tutor_role,
          objective: scenario.objective,
        }
      : null,
    topic: session.topic,
    speechSpeed: session.speech_speed,
    level: profile?.level ?? "beginner",
    history: (history ?? []).map((m) => ({ role: m.role, content: m.content_ko })),
    weaknesses: (mistakes ?? []).map((m) => `${m.original} → ${m.correction}`),
  });

  await db.from("conversation_messages").insert({
    session_id: sessionId,
    user_id: userId,
    role: "tutor",
    content_ko: turn.contentKo,
    content_en: turn.contentEn,
    romanization: turn.romanization,
    breakdown: turn.breakdown,
  });

  await db
    .from("conversation_sessions")
    .update({ turns: (session.turns ?? 0) + 1, demo_mode: turn.demoMode })
    .eq("id", sessionId);

  return turn;
}

export async function scoreAttempt(
  db: Db,
  userId: string,
  input: {
    sessionId?: string | null | undefined;
    lessonId?: string | null | undefined;
    targetText: string;
    transcript: string;
    mode: "repeat" | "free" | "shadowing";
  },
) {
  const result = await analyzePronunciation(input.targetText, input.transcript);

  const { data: attempt } = await db
    .from("speaking_attempts")
    .insert({
      user_id: userId,
      session_id: input.sessionId ?? null,
      lesson_id: input.lessonId ?? null,
      target_text: input.targetText,
      transcript: input.transcript,
      mode: input.mode,
      demo_mode: result.demoMode,
    })
    .select("id")
    .single();

  if (attempt) {
    await db.from("pronunciation_feedback").insert({
      attempt_id: attempt.id,
      user_id: userId,
      pronunciation: result.pronunciation,
      grammar: result.grammar,
      vocabulary: result.vocabulary,
      fluency: result.fluency,
      naturalness: result.naturalness,
      confidence: result.confidence,
      overall: result.overall,
      problem_tokens: result.problemTokens,
      correction_ko: result.correctionKo,
      coaching_note: result.coachingNote,
      demo_mode: result.demoMode,
    });
  }

  for (const token of result.problemTokens.slice(0, 2)) {
    await db.from("mistakes").insert({
      user_id: userId,
      kind: "pronunciation",
      original: token.token,
      correction: input.targetText,
      explanation: token.tip,
    });
  }

  await awardProgress(db, userId, { xp: 10, attempts: 1, minutes: 1 });
  return result;
}

export async function finishSession(db: Db, userId: string, sessionId: string, seconds: number) {
  const { data: feedback } = await db
    .from("pronunciation_feedback")
    .select("overall")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);
  const overall = feedback?.length
    ? Math.round(feedback.reduce((sum, f) => sum + (f.overall ?? 0), 0) / feedback.length)
    : null;

  const { data: session } = await db
    .from("conversation_sessions")
    .update({
      ended_at: new Date().toISOString(),
      seconds_spent: seconds,
      overall_score: overall,
      summary: overall
        ? `Average speaking score ${overall}. Keep practising the highlighted syllables.`
        : "Conversation completed.",
    })
    .eq("id", sessionId)
    .select("turns")
    .maybeSingle();

  await awardProgress(db, userId, {
    xp: 40 + (session?.turns ?? 0) * 5,
    coins: 10,
    minutes: Math.max(1, Math.round(seconds / 60)),
  });
  await rebuildRecommendations(db, userId);
  return { overall };
}

export async function markLessonComplete(
  db: Db,
  userId: string,
  input: { lessonId: string; score: number; seconds: number },
) {
  const { data: lesson } = await db
    .from("lessons")
    .select("xp_reward, coin_reward")
    .eq("id", input.lessonId)
    .maybeSingle();

  await db.from("user_progress").upsert(
    {
      user_id: userId,
      lesson_id: input.lessonId,
      status: "completed",
      score: input.score,
      seconds_spent: input.seconds,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );

  await awardProgress(db, userId, {
    xp: lesson?.xp_reward ?? 40,
    coins: lesson?.coin_reward ?? 10,
    lessons: 1,
    minutes: Math.max(1, Math.round(input.seconds / 60)),
  });
  await rebuildRecommendations(db, userId);
  return { ok: true, xp: lesson?.xp_reward ?? 40, coins: lesson?.coin_reward ?? 10 };
}

export async function upsertLessonStep(db: Db, userId: string, lessonId: string, step: number) {
  await db.from("user_progress").upsert(
    { user_id: userId, lesson_id: lessonId, status: "in_progress", current_step: step },
    { onConflict: "user_id,lesson_id" },
  );
  return { ok: true };
}

/** Spaced review: mastered words move further out, forgotten words come back fast. */
export async function applyReview(db: Db, userId: string, id: string, correct: boolean) {
  const { data: row } = await db
    .from("user_vocabulary")
    .select("mastery, review_count, correct_count")
    .eq("id", id)
    .maybeSingle();
  if (!row) return { ok: false };

  const mastery = Math.max(0, Math.min(5, (row.mastery ?? 0) + (correct ? 1 : -1)));
  const intervals = [0.25, 1, 3, 7, 16, 35];
  const days = intervals[mastery] ?? 1;
  await db
    .from("user_vocabulary")
    .update({
      mastery,
      review_count: (row.review_count ?? 0) + 1,
      correct_count: (row.correct_count ?? 0) + (correct ? 1 : 0),
      last_reviewed_at: new Date().toISOString(),
      due_at: new Date(Date.now() + days * 86400000).toISOString(),
    })
    .eq("id", id);

  await awardProgress(db, userId, { xp: correct ? 5 : 2, words: 1 });
  return { ok: true, mastery };
}

export async function beginCheckout(
  db: Db,
  userId: string,
  plan: "premium",
  billingPeriod: "monthly" | "yearly",
) {
  await db.from("subscriptions").upsert(
    {
      user_id: userId,
      plan,
      billing_period: billingPeriod,
      status: "checkout",
      provider: "none",
    },
    { onConflict: "user_id" },
  );
  // No payment provider is connected yet: we record the intent and surface a
  // clear "awaiting payment provider" state instead of faking a success.
  return {
    status: "checkout" as const,
    providerConnected: false,
    message:
      "Checkout recorded. Connect a payment provider to complete the purchase — no charge has been made.",
  };
}

export async function cancelPlan(db: Db, userId: string) {
  await db.from("subscriptions").update({ status: "cancelled" }).eq("user_id", userId);
  return { status: "cancelled" as const };
}

export async function rebuildRecommendations(db: Db, userId: string) {
  const { data: profile } = await db.from("profiles").select("level").eq("id", userId).maybeSingle();
  const { data: done } = await db
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("status", "completed");
  const completed = new Set((done ?? []).map((d) => d.lesson_id));

  const { data: lessons } = await db
    .from("lessons")
    .select("id, title, level, summary")
    .order("sort_order", { ascending: true })
    .limit(30);
  const next = (lessons ?? []).filter((l) => !completed.has(l.id)).slice(0, 3);

  const { data: mistakes } = await db
    .from("mistakes")
    .select("kind")
    .eq("user_id", userId)
    .eq("resolved", false)
    .limit(20);
  const weakest = (mistakes ?? []).reduce<Record<string, number>>((acc, m) => {
    acc[m.kind] = (acc[m.kind] ?? 0) + 1;
    return acc;
  }, {});
  const focus = Object.entries(weakest).sort((a, b) => b[1] - a[1])[0]?.[0];

  await db.from("recommendations").delete().eq("user_id", userId).eq("dismissed", false);
  if (next.length) {
    await db.from("recommendations").insert(
      next.map((l) => ({
        user_id: userId,
        kind: "lesson",
        lesson_id: l.id,
        title: l.title,
        reason: focus
          ? `Recommended next — it also drills your weakest area right now: ${focus}.`
          : `Next step for your ${profile?.level ?? "beginner"} level.`,
      })),
    );
  }
  return { created: next.length, focus: focus ?? null };
}
