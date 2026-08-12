import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Daily AI-conversation entitlement for the signed-in learner. */
export const getEntitlement = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { getEntitlementFor } = await import("./learning.server");
    return getEntitlementFor(context.supabase, context.userId);
  });

export const startConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        kind: z.enum(["scenario", "free_talk", "lesson", "shadowing"]).default("free_talk"),
        scenarioId: z.string().uuid().nullish(),
        lessonId: z.string().uuid().nullish(),
        tutorId: z.string().uuid().nullish(),
        topic: z.string().max(120).default(""),
        speechSpeed: z.string().max(20).default("normal"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { createSession } = await import("./learning.server");
    return createSession(context.supabase, context.userId, data);
  });

export const sendTurn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        sessionId: z.string().uuid(),
        userText: z.string().max(600).default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { respondToTurn } = await import("./learning.server");
    return respondToTurn(context.supabase, context.userId, data.sessionId, data.userText);
  });

export const analyzeAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        sessionId: z.string().uuid().nullish(),
        lessonId: z.string().uuid().nullish(),
        targetText: z.string().min(1).max(400),
        transcript: z.string().max(600).default(""),
        mode: z.enum(["repeat", "free", "shadowing"]).default("repeat"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { scoreAttempt } = await import("./learning.server");
    return scoreAttempt(context.supabase, context.userId, data);
  });

export const emergencyHelp = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        intent: z.string().min(1).max(400),
        speechSpeed: z.string().max(20).default("normal"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { translateIntent } = await import("./ai.server");
    return translateIntent(data.intent, data.speechSpeed);
  });

export const endConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        sessionId: z.string().uuid(),
        seconds: z.number().int().min(0).max(36000).default(0),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { finishSession } = await import("./learning.server");
    return finishSession(context.supabase, context.userId, data.sessionId, data.seconds);
  });

export const completeLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        lessonId: z.string().uuid(),
        score: z.number().int().min(0).max(100).default(80),
        seconds: z.number().int().min(0).max(36000).default(240),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { markLessonComplete } = await import("./learning.server");
    return markLessonComplete(context.supabase, context.userId, data);
  });

export const saveLessonStep = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ lessonId: z.string().uuid(), step: z.number().int().min(0).max(50) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { upsertLessonStep } = await import("./learning.server");
    return upsertLessonStep(context.supabase, context.userId, data.lessonId, data.step);
  });

export const reviewWord = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ userVocabularyId: z.string().uuid(), correct: z.boolean() })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { applyReview } = await import("./learning.server");
    return applyReview(context.supabase, context.userId, data.userVocabularyId, data.correct);
  });

export const startCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ plan: z.enum(["premium"]), billingPeriod: z.enum(["monthly", "yearly"]) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { beginCheckout } = await import("./learning.server");
    return beginCheckout(context.supabase, context.userId, data.plan, data.billingPeriod);
  });

export const cancelSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { cancelPlan } = await import("./learning.server");
    return cancelPlan(context.supabase, context.userId);
  });

export const refreshRecommendations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { rebuildRecommendations } = await import("./learning.server");
    return rebuildRecommendations(context.supabase, context.userId);
  });
