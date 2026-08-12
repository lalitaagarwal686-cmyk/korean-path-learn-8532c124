export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          conversations_started: number
          created_at: string
          id: string
          updated_at: string
          usage_date: string
          user_id: string
        }
        Insert: {
          conversations_started?: number
          created_at?: string
          id?: string
          updated_at?: string
          usage_date?: string
          user_id: string
        }
        Update: {
          conversations_started?: number
          created_at?: string
          id?: string
          updated_at?: string
          usage_date?: string
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          description: string
          icon: string
          id: string
          name: string
          requirement: Json
          slug: string
          sort_order: number
          tier: string
        }
        Insert: {
          description: string
          icon?: string
          id?: string
          name: string
          requirement?: Json
          slug: string
          sort_order?: number
          tier?: string
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          name?: string
          requirement?: Json
          slug?: string
          sort_order?: number
          tier?: string
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          audio_url: string | null
          breakdown: Json
          content_en: string
          content_ko: string
          created_at: string
          id: string
          role: string
          romanization: string
          session_id: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          breakdown?: Json
          content_en?: string
          content_ko?: string
          created_at?: string
          id?: string
          role: string
          romanization?: string
          session_id: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          breakdown?: Json
          content_en?: string
          content_ko?: string
          created_at?: string
          id?: string
          role?: string
          romanization?: string
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_sessions: {
        Row: {
          created_at: string
          demo_mode: boolean
          ended_at: string | null
          id: string
          kind: Database["public"]["Enums"]["session_kind"]
          lesson_id: string | null
          overall_score: number | null
          scenario_id: string | null
          seconds_spent: number
          speech_speed: string
          summary: string
          topic: string
          turns: number
          tutor_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          demo_mode?: boolean
          ended_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["session_kind"]
          lesson_id?: string | null
          overall_score?: number | null
          scenario_id?: string | null
          seconds_spent?: number
          speech_speed?: string
          summary?: string
          topic?: string
          turns?: number
          tutor_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          demo_mode?: boolean
          ended_at?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["session_kind"]
          lesson_id?: string | null
          overall_score?: number | null
          scenario_id?: string | null
          seconds_spent?: number
          speech_speed?: string
          summary?: string
          topic?: string
          turns?: number
          tutor_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_sessions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_sessions_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_sessions_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_topics: {
        Row: {
          created_at: string
          example_en: string
          example_ko: string
          example_romanization: string
          explanation_en: string
          explanation_hi: string
          id: string
          level: Database["public"]["Enums"]["korean_level"]
          meaning: string
          pattern: string
          slug: string
          sort_order: number
          speech_level: Database["public"]["Enums"]["speech_level"]
        }
        Insert: {
          created_at?: string
          example_en: string
          example_ko: string
          example_romanization?: string
          explanation_en: string
          explanation_hi: string
          id?: string
          level?: Database["public"]["Enums"]["korean_level"]
          meaning: string
          pattern: string
          slug: string
          sort_order?: number
          speech_level?: Database["public"]["Enums"]["speech_level"]
        }
        Update: {
          created_at?: string
          example_en?: string
          example_ko?: string
          example_romanization?: string
          explanation_en?: string
          explanation_hi?: string
          id?: string
          level?: Database["public"]["Enums"]["korean_level"]
          meaning?: string
          pattern?: string
          slug?: string
          sort_order?: number
          speech_level?: Database["public"]["Enums"]["speech_level"]
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          avatar_url: string | null
          display_name: string
          level: Database["public"]["Enums"]["korean_level"]
          streak_days: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string
          level?: Database["public"]["Enums"]["korean_level"]
          streak_days?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          display_name?: string
          level?: Database["public"]["Enums"]["korean_level"]
          streak_days?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      learning_days: {
        Row: {
          created_at: string
          day: string
          id: string
          lessons_completed: number
          minutes: number
          speaking_attempts: number
          updated_at: string
          user_id: string
          words_reviewed: number
          xp: number
        }
        Insert: {
          created_at?: string
          day: string
          id?: string
          lessons_completed?: number
          minutes?: number
          speaking_attempts?: number
          updated_at?: string
          user_id: string
          words_reviewed?: number
          xp?: number
        }
        Update: {
          created_at?: string
          day?: string
          id?: string
          lessons_completed?: number
          minutes?: number
          speaking_attempts?: number
          updated_at?: string
          user_id?: string
          words_reviewed?: number
          xp?: number
        }
        Relationships: []
      }
      lesson_steps: {
        Row: {
          created_at: string
          id: string
          kind: string
          lesson_id: string
          payload: Json
          prompt_en: string
          prompt_hi: string
          prompt_ko: string
          romanization: string
          step_index: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          lesson_id: string
          payload?: Json
          prompt_en?: string
          prompt_hi?: string
          prompt_ko?: string
          romanization?: string
          step_index: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          lesson_id?: string
          payload?: Json
          prompt_en?: string
          prompt_hi?: string
          prompt_ko?: string
          romanization?: string
          step_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_steps_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          coin_reward: number
          created_at: string
          id: string
          is_free: boolean
          korean_title: string
          level: Database["public"]["Enums"]["korean_level"]
          minutes: number
          objective: string
          slug: string
          sort_order: number
          summary: string
          title: string
          track: string
          xp_reward: number
        }
        Insert: {
          coin_reward?: number
          created_at?: string
          id?: string
          is_free?: boolean
          korean_title: string
          level?: Database["public"]["Enums"]["korean_level"]
          minutes?: number
          objective: string
          slug: string
          sort_order?: number
          summary: string
          title: string
          track?: string
          xp_reward?: number
        }
        Update: {
          coin_reward?: number
          created_at?: string
          id?: string
          is_free?: boolean
          korean_title?: string
          level?: Database["public"]["Enums"]["korean_level"]
          minutes?: number
          objective?: string
          slug?: string
          sort_order?: number
          summary?: string
          title?: string
          track?: string
          xp_reward?: number
        }
        Relationships: []
      }
      mission_templates: {
        Row: {
          coin_reward: number
          description: string
          goal_count: number
          goal_type: string
          id: string
          slug: string
          sort_order: number
          title: string
          xp_reward: number
        }
        Insert: {
          coin_reward?: number
          description: string
          goal_count?: number
          goal_type: string
          id?: string
          slug: string
          sort_order?: number
          title: string
          xp_reward?: number
        }
        Update: {
          coin_reward?: number
          description?: string
          goal_count?: number
          goal_type?: string
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      mistakes: {
        Row: {
          correction: string
          created_at: string
          explanation: string
          id: string
          kind: Database["public"]["Enums"]["mistake_kind"]
          original: string
          resolved: boolean
          times_seen: number
          updated_at: string
          user_id: string
        }
        Insert: {
          correction?: string
          created_at?: string
          explanation?: string
          id?: string
          kind?: Database["public"]["Enums"]["mistake_kind"]
          original: string
          resolved?: boolean
          times_seen?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          correction?: string
          created_at?: string
          explanation?: string
          id?: string
          kind?: Database["public"]["Enums"]["mistake_kind"]
          original?: string
          resolved?: boolean
          times_seen?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coins: number
          created_at: string
          daily_goal_minutes: number
          display_name: string
          explanation_language: string
          hints_enabled: boolean
          id: string
          last_active_date: string | null
          level: Database["public"]["Enums"]["korean_level"]
          listening_score: number
          longest_streak: number
          notifications_enabled: boolean
          onboarded: boolean
          preferred_tutor_id: string | null
          reminder_time: string
          speaking_score: number
          speech_speed: string
          streak_days: number
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          daily_goal_minutes?: number
          display_name?: string
          explanation_language?: string
          hints_enabled?: boolean
          id: string
          last_active_date?: string | null
          level?: Database["public"]["Enums"]["korean_level"]
          listening_score?: number
          longest_streak?: number
          notifications_enabled?: boolean
          onboarded?: boolean
          preferred_tutor_id?: string | null
          reminder_time?: string
          speaking_score?: number
          speech_speed?: string
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          coins?: number
          created_at?: string
          daily_goal_minutes?: number
          display_name?: string
          explanation_language?: string
          hints_enabled?: boolean
          id?: string
          last_active_date?: string | null
          level?: Database["public"]["Enums"]["korean_level"]
          listening_score?: number
          longest_streak?: number
          notifications_enabled?: boolean
          onboarded?: boolean
          preferred_tutor_id?: string | null
          reminder_time?: string
          speaking_score?: number
          speech_speed?: string
          streak_days?: number
          updated_at?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_preferred_tutor_id_fkey"
            columns: ["preferred_tutor_id"]
            isOneToOne: false
            referencedRelation: "tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      pronunciation_feedback: {
        Row: {
          attempt_id: string
          coaching_note: string
          confidence: number
          correction_ko: string
          created_at: string
          demo_mode: boolean
          fluency: number
          grammar: number
          id: string
          naturalness: number
          overall: number
          problem_tokens: Json
          pronunciation: number
          user_id: string
          vocabulary: number
        }
        Insert: {
          attempt_id: string
          coaching_note?: string
          confidence?: number
          correction_ko?: string
          created_at?: string
          demo_mode?: boolean
          fluency?: number
          grammar?: number
          id?: string
          naturalness?: number
          overall?: number
          problem_tokens?: Json
          pronunciation?: number
          user_id: string
          vocabulary?: number
        }
        Update: {
          attempt_id?: string
          coaching_note?: string
          confidence?: number
          correction_ko?: string
          created_at?: string
          demo_mode?: boolean
          fluency?: number
          grammar?: number
          id?: string
          naturalness?: number
          overall?: number
          problem_tokens?: Json
          pronunciation?: number
          user_id?: string
          vocabulary?: number
        }
        Relationships: [
          {
            foreignKeyName: "pronunciation_feedback_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "speaking_attempts"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          created_at: string
          dismissed: boolean
          id: string
          kind: string
          lesson_id: string | null
          reason: string
          scenario_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dismissed?: boolean
          id?: string
          kind?: string
          lesson_id?: string | null
          reason?: string
          scenario_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          dismissed?: boolean
          id?: string
          kind?: string
          lesson_id?: string | null
          reason?: string
          scenario_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_phrases: {
        Row: {
          created_at: string
          english: string
          hangul: string
          hindi: string
          id: string
          note: string
          romanization: string
          user_id: string
        }
        Insert: {
          created_at?: string
          english?: string
          hangul: string
          hindi?: string
          id?: string
          note?: string
          romanization?: string
          user_id: string
        }
        Update: {
          created_at?: string
          english?: string
          hangul?: string
          hindi?: string
          id?: string
          note?: string
          romanization?: string
          user_id?: string
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          category: string
          created_at: string
          difficulty: Database["public"]["Enums"]["korean_level"]
          emoji: string
          id: string
          is_free: boolean
          korean_title: string
          learner_role: string
          objective: string
          opening_line_en: string
          opening_line_ko: string
          slug: string
          sort_order: number
          target_grammar: string[]
          target_vocabulary: string[]
          title: string
          tutor_role: string
        }
        Insert: {
          category?: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["korean_level"]
          emoji?: string
          id?: string
          is_free?: boolean
          korean_title: string
          learner_role: string
          objective: string
          opening_line_en?: string
          opening_line_ko?: string
          slug: string
          sort_order?: number
          target_grammar?: string[]
          target_vocabulary?: string[]
          title: string
          tutor_role: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: Database["public"]["Enums"]["korean_level"]
          emoji?: string
          id?: string
          is_free?: boolean
          korean_title?: string
          learner_role?: string
          objective?: string
          opening_line_en?: string
          opening_line_ko?: string
          slug?: string
          sort_order?: number
          target_grammar?: string[]
          target_vocabulary?: string[]
          title?: string
          tutor_role?: string
        }
        Relationships: []
      }
      speaking_attempts: {
        Row: {
          created_at: string
          demo_mode: boolean
          id: string
          lesson_id: string | null
          mode: string
          session_id: string | null
          target_text: string
          transcript: string
          user_id: string
        }
        Insert: {
          created_at?: string
          demo_mode?: boolean
          id?: string
          lesson_id?: string | null
          mode?: string
          session_id?: string | null
          target_text: string
          transcript?: string
          user_id: string
        }
        Update: {
          created_at?: string
          demo_mode?: boolean
          id?: string
          lesson_id?: string | null
          mode?: string
          session_id?: string | null
          target_text?: string
          transcript?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speaking_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speaking_attempts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_period: string
          created_at: string
          current_period_end: string | null
          id: string
          plan: string
          provider: string
          provider_customer_id: string | null
          provider_subscription_id: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_period?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan?: string
          provider?: string
          provider_customer_id?: string | null
          provider_subscription_id?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      topik_categories: {
        Row: {
          description: string
          exam: string
          id: string
          item_count: number
          skill: string
          slug: string
          sort_order: number
          title: string
        }
        Insert: {
          description: string
          exam: string
          id?: string
          item_count?: number
          skill: string
          slug: string
          sort_order?: number
          title: string
        }
        Update: {
          description?: string
          exam?: string
          id?: string
          item_count?: number
          skill?: string
          slug?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      topik_progress: {
        Row: {
          attempts: number
          best_score: number
          category_id: string
          completed_items: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempts?: number
          best_score?: number
          category_id: string
          completed_items?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempts?: number
          best_score?: number
          category_id?: string
          completed_items?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topik_progress_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "topik_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tutors: {
        Row: {
          accent_color: string
          age_range: string
          bio: string
          created_at: string
          gender: string
          id: string
          korean_name: string
          name: string
          personality: string
          slug: string
          sort_order: number
          speaks_hindi: boolean
          tagline: string
          voice_id: string
        }
        Insert: {
          accent_color?: string
          age_range: string
          bio: string
          created_at?: string
          gender: string
          id?: string
          korean_name: string
          name: string
          personality: string
          slug: string
          sort_order?: number
          speaks_hindi?: boolean
          tagline: string
          voice_id: string
        }
        Update: {
          accent_color?: string
          age_range?: string
          bio?: string
          created_at?: string
          gender?: string
          id?: string
          korean_name?: string
          name?: string
          personality?: string
          slug?: string
          sort_order?: number
          speaks_hindi?: boolean
          tagline?: string
          voice_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_missions: {
        Row: {
          completed: boolean
          created_at: string
          id: string
          mission_date: string
          mission_id: string
          progress: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          id?: string
          mission_date?: string
          mission_id: string
          progress?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          id?: string
          mission_date?: string
          mission_id?: string
          progress?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number
          id: string
          lesson_id: string
          score: number
          seconds_spent: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          lesson_id: string
          score?: number
          seconds_spent?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number
          id?: string
          lesson_id?: string
          score?: number
          seconds_spent?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_vocabulary: {
        Row: {
          correct_count: number
          created_at: string
          custom_english: string | null
          custom_hangul: string | null
          due_at: string
          id: string
          last_reviewed_at: string | null
          mastery: number
          review_count: number
          updated_at: string
          user_id: string
          vocabulary_id: string | null
        }
        Insert: {
          correct_count?: number
          created_at?: string
          custom_english?: string | null
          custom_hangul?: string | null
          due_at?: string
          id?: string
          last_reviewed_at?: string | null
          mastery?: number
          review_count?: number
          updated_at?: string
          user_id: string
          vocabulary_id?: string | null
        }
        Update: {
          correct_count?: number
          created_at?: string
          custom_english?: string | null
          custom_hangul?: string | null
          due_at?: string
          id?: string
          last_reviewed_at?: string | null
          mastery?: number
          review_count?: number
          updated_at?: string
          user_id?: string
          vocabulary_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          category: string
          created_at: string
          english: string
          example_en: string
          example_hi: string
          example_ko: string
          hangul: string
          hindi: string
          id: string
          level: Database["public"]["Enums"]["korean_level"]
          part_of_speech: string
          romanization: string
        }
        Insert: {
          category?: string
          created_at?: string
          english: string
          example_en?: string
          example_hi?: string
          example_ko?: string
          hangul: string
          hindi: string
          id?: string
          level?: Database["public"]["Enums"]["korean_level"]
          part_of_speech?: string
          romanization: string
        }
        Update: {
          category?: string
          created_at?: string
          english?: string
          example_en?: string
          example_hi?: string
          example_ko?: string
          hangul?: string
          hindi?: string
          id?: string
          level?: Database["public"]["Enums"]["korean_level"]
          part_of_speech?: string
          romanization?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      korean_level:
        | "beginner"
        | "topik_i"
        | "intermediate"
        | "topik_ii"
        | "advanced"
      mistake_kind:
        | "pronunciation"
        | "grammar"
        | "vocabulary"
        | "fluency"
        | "naturalness"
      session_kind: "scenario" | "free_talk" | "lesson" | "shadowing"
      speech_level: "banmal" | "haeyoche" | "hamnidache" | "jondaenmal"
      subscription_status:
        | "none"
        | "checkout"
        | "active"
        | "cancelled"
        | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      korean_level: [
        "beginner",
        "topik_i",
        "intermediate",
        "topik_ii",
        "advanced",
      ],
      mistake_kind: [
        "pronunciation",
        "grammar",
        "vocabulary",
        "fluency",
        "naturalness",
      ],
      session_kind: ["scenario", "free_talk", "lesson", "shadowing"],
      speech_level: ["banmal", "haeyoche", "hamnidache", "jondaenmal"],
      subscription_status: [
        "none",
        "checkout",
        "active",
        "cancelled",
        "expired",
      ],
    },
  },
} as const
