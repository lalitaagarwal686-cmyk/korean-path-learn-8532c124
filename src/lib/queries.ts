import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

const today = () => new Date().toISOString().slice(0, 10);

export const curriculumQueries = {
  tutors: () =>
    queryOptions({
      queryKey: ["tutors"],
      queryFn: async () => {
        const { data, error } = await supabase.from("tutors").select("*").order("sort_order");
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60_000,
    }),
  lessons: () =>
    queryOptions({
      queryKey: ["lessons"],
      queryFn: async () => {
        const { data, error } = await supabase.from("lessons").select("*").order("sort_order");
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60_000,
    }),
  lesson: (slug: string) =>
    queryOptions({
      queryKey: ["lesson", slug],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("lessons")
          .select("*, lesson_steps(*)")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        return data;
      },
    }),
  scenarios: () =>
    queryOptions({
      queryKey: ["scenarios"],
      queryFn: async () => {
        const { data, error } = await supabase.from("scenarios").select("*").order("sort_order");
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60_000,
    }),
  scenario: (slug: string) =>
    queryOptions({
      queryKey: ["scenario", slug],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("scenarios")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw error;
        return data;
      },
    }),
  vocabulary: () =>
    queryOptions({
      queryKey: ["vocabulary"],
      queryFn: async () => {
        const { data, error } = await supabase.from("vocabulary").select("*").order("hangul");
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60_000,
    }),
  grammar: () =>
    queryOptions({
      queryKey: ["grammar"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("grammar_topics")
          .select("*")
          .order("sort_order");
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60_000,
    }),
  topik: () =>
    queryOptions({
      queryKey: ["topik-categories"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("topik_categories")
          .select("*")
          .order("sort_order");
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60_000,
    }),
  badges: () =>
    queryOptions({
      queryKey: ["badges"],
      queryFn: async () => {
        const { data, error } = await supabase.from("badges").select("*").order("sort_order");
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60_000,
    }),
  missions: () =>
    queryOptions({
      queryKey: ["mission-templates"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("mission_templates")
          .select("*")
          .order("sort_order");
        if (error) throw error;
        return data;
      },
      staleTime: 5 * 60_000,
    }),
  leaderboard: () =>
    queryOptions({
      queryKey: ["leaderboard"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("leaderboard_entries")
          .select("*")
          .order("xp", { ascending: false })
          .limit(25);
        if (error) throw error;
        return data;
      },
      staleTime: 60_000,
    }),
};

export const learnerQueries = {
  profile: (userId: string) =>
    queryOptions({
      queryKey: ["profile", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
        if (error) throw error;
        return data;
      },
    }),
  progress: (userId: string) =>
    queryOptions({
      queryKey: ["user-progress", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", userId);
        if (error) throw error;
        return data;
      },
    }),
  days: (userId: string) =>
    queryOptions({
      queryKey: ["learning-days", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("learning_days")
          .select("*")
          .eq("user_id", userId)
          .order("day", { ascending: false })
          .limit(60);
        if (error) throw error;
        return data;
      },
    }),
  mistakes: (userId: string) =>
    queryOptions({
      queryKey: ["mistakes", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("mistakes")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);
        if (error) throw error;
        return data;
      },
    }),
  recommendations: (userId: string) =>
    queryOptions({
      queryKey: ["recommendations", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("recommendations")
          .select("*")
          .eq("user_id", userId)
          .eq("dismissed", false)
          .limit(5);
        if (error) throw error;
        return data;
      },
    }),
  savedWords: (userId: string) =>
    queryOptions({
      queryKey: ["user-vocabulary", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("user_vocabulary")
          .select("*, vocabulary(*)")
          .eq("user_id", userId)
          .order("due_at");
        if (error) throw error;
        return data;
      },
    }),
  sessions: (userId: string) =>
    queryOptions({
      queryKey: ["sessions", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("conversation_sessions")
          .select("*, scenarios(title)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(30);
        if (error) throw error;
        return data;
      },
    }),
  feedback: (userId: string) =>
    queryOptions({
      queryKey: ["feedback", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("pronunciation_feedback")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);
        if (error) throw error;
        return data;
      },
    }),
  badges: (userId: string) =>
    queryOptions({
      queryKey: ["user-badges", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("user_badges")
          .select("*, badges(*)")
          .eq("user_id", userId);
        if (error) throw error;
        return data;
      },
    }),
  missions: (userId: string) =>
    queryOptions({
      queryKey: ["user-missions", userId, today()],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("user_missions")
          .select("*, mission_templates(*)")
          .eq("user_id", userId)
          .eq("mission_date", today());
        if (error) throw error;
        return data;
      },
    }),
  topik: (userId: string) =>
    queryOptions({
      queryKey: ["topik-progress", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("topik_progress")
          .select("*")
          .eq("user_id", userId);
        if (error) throw error;
        return data;
      },
    }),
  subscription: (userId: string) =>
    queryOptions({
      queryKey: ["subscription", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        if (error) throw error;
        return data;
      },
    }),
};
