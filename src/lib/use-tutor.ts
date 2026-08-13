import { useQuery } from "@tanstack/react-query";

import type { TutorPersona } from "@/components/app/RealisticAITutor";
import { useAuth } from "@/lib/auth";
import { curriculumQueries, learnerQueries } from "@/lib/queries";

/** Resolves the learner's selected tutor (falls back to the first seeded tutor). */
export function useActiveTutor(): { tutorId: string | null; persona: TutorPersona } {
  const { user } = useAuth();
  const { data: tutors } = useQuery(curriculumQueries.tutors());
  const { data: profile } = useQuery({
    ...learnerQueries.profile(user?.id ?? ""),
    enabled: Boolean(user?.id),
  });

  const tutor =
    tutors?.find((t) => t.id === profile?.preferred_tutor_id) ?? tutors?.[0] ?? null;

  return {
    tutorId: tutor?.id ?? null,
    persona: {
      name: tutor?.name ?? "Seo-yeon",
      koreanName: tutor?.korean_name ?? "서연",
      personality: tutor?.personality ?? "friendly teacher",
      accentColor: tutor?.accent_color ?? null,
      gender: tutor?.gender ?? null,
    },
  };
}
