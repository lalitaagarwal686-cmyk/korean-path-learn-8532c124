import type { PronunciationResult, TutorTurn, WordBreakdownToken } from "./types";

/**
 * Deterministic offline generators used when no AI credentials are connected.
 * Everything produced here is clearly labelled `demoMode: true` in the UI —
 * we never present it as real analysis.
 */

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 100000;
  return h;
}

function clamp(n: number, min = 52, max = 98) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

const PARTICLES: Record<string, { meaning: string; role: string; hindi: string }> = {
  는: { meaning: "topic marker", role: "particle", hindi: "विषय चिह्न" },
  은: { meaning: "topic marker", role: "particle", hindi: "विषय चिह्न" },
  가: { meaning: "subject marker", role: "particle", hindi: "कर्ता चिह्न" },
  이: { meaning: "subject marker", role: "particle", hindi: "कर्ता चिह्न" },
  를: { meaning: "object marker", role: "particle", hindi: "कर्म चिह्न" },
  을: { meaning: "object marker", role: "particle", hindi: "कर्म चिह्न" },
  에: { meaning: "to / at", role: "particle", hindi: "में / को" },
  에서: { meaning: "at / from", role: "particle", hindi: "से / में" },
};

const KNOWN: Record<string, { rom: string; meaning: string; role: string; hindi: string }> = {
  안녕하세요: { rom: "annyeonghaseyo", meaning: "hello", role: "greeting", hindi: "नमस्ते" },
  감사합니다: { rom: "gamsahamnida", meaning: "thank you", role: "phrase", hindi: "धन्यवाद" },
  주세요: { rom: "juseyo", meaning: "please give me", role: "verb", hindi: "दीजिए" },
  커피: { rom: "keopi", meaning: "coffee", role: "noun", hindi: "कॉफ़ी" },
  물: { rom: "mul", meaning: "water", role: "noun", hindi: "पानी" },
  저: { rom: "jeo", meaning: "I (humble)", role: "pronoun", hindi: "मैं" },
  한국어: { rom: "hangugeo", meaning: "Korean language", role: "noun", hindi: "कोरियाई" },
  친구: { rom: "chingu", meaning: "friend", role: "noun", hindi: "दोस्त" },
  네: { rom: "ne", meaning: "yes", role: "interjection", hindi: "हाँ" },
  좋아요: { rom: "joayo", meaning: "it's good / I like it", role: "adjective", hindi: "अच्छा है" },
};

export function breakdownSentence(sentence: string): WordBreakdownToken[] {
  return sentence
    .replace(/[.?!,]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const known = KNOWN[word];
      if (known) {
        return {
          ko: word,
          romanization: known.rom,
          meaning: known.meaning,
          role: known.role,
          hindi: known.hindi,
        };
      }
      const tail = word.slice(-1);
      const particle = PARTICLES[tail];
      const stem = word.slice(0, -1);
      const stemKnown = KNOWN[stem];
      if (particle && stemKnown) {
        return {
          ko: word,
          romanization: `${stemKnown.rom}-${tail}`,
          meaning: `${stemKnown.meaning} (${particle.meaning})`,
          role: `${stemKnown.role} + ${particle.role}`,
          hindi: `${stemKnown.hindi} (${particle.hindi})`,
        };
      }
      return {
        ko: word,
        romanization: romanize(word),
        meaning: "see dictionary",
        role: "word",
        hindi: "शब्दकोश देखें",
      };
    });
}

const JAMO_ROM: Record<string, string> = {
  ㄱ: "g",
  ㄲ: "kk",
  ㄴ: "n",
  ㄷ: "d",
  ㄸ: "tt",
  ㄹ: "r",
  ㅁ: "m",
  ㅂ: "b",
  ㅃ: "pp",
  ㅅ: "s",
  ㅆ: "ss",
  ㅇ: "",
  ㅈ: "j",
  ㅉ: "jj",
  ㅊ: "ch",
  ㅋ: "k",
  ㅌ: "t",
  ㅍ: "p",
  ㅎ: "h",
};
const LEADS = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ".split("");
const VOWELS = [
  "a",
  "ae",
  "ya",
  "yae",
  "eo",
  "e",
  "yeo",
  "ye",
  "o",
  "wa",
  "wae",
  "oe",
  "yo",
  "u",
  "wo",
  "we",
  "wi",
  "yu",
  "eu",
  "ui",
  "i",
];
const TAILS = [
  "",
  "k",
  "k",
  "k",
  "n",
  "n",
  "n",
  "t",
  "l",
  "l",
  "l",
  "l",
  "l",
  "l",
  "l",
  "l",
  "m",
  "p",
  "p",
  "t",
  "t",
  "ng",
  "t",
  "t",
  "k",
  "t",
  "p",
  "t",
];

/** Lightweight Revised-Romanization approximation for demo output. */
export function romanize(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) {
      out += ch;
      continue;
    }
    const lead = Math.floor(code / 588);
    const vowel = Math.floor((code % 588) / 28);
    const tail = code % 28;
    out += (JAMO_ROM[LEADS[lead] as string] ?? "") + (VOWELS[vowel] ?? "") + (TAILS[tail] ?? "");
  }
  return out;
}

export function demoPronunciation(target: string, transcript: string): PronunciationResult {
  const seed = hash(target + transcript);
  const closeness =
    transcript.trim().length === 0
      ? 0.55
      : Math.min(1, transcript.trim().length / Math.max(4, target.trim().length));
  const base = 60 + closeness * 30;
  const scores = {
    pronunciation: clamp(base + (seed % 9) - 4),
    grammar: clamp(base + ((seed >> 2) % 11) - 5),
    vocabulary: clamp(base + ((seed >> 3) % 10) - 3),
    fluency: clamp(base + ((seed >> 4) % 13) - 7),
    naturalness: clamp(base + ((seed >> 5) % 12) - 6),
    confidence: clamp(base + ((seed >> 6) % 14) - 7),
  };
  const overall = clamp(
    (scores.pronunciation * 2 +
      scores.grammar +
      scores.vocabulary +
      scores.fluency +
      scores.naturalness +
      scores.confidence) /
      7,
  );
  const words = target.replace(/[.?!,]/g, "").split(/\s+/).filter(Boolean);
  const problem = words
    .filter((_, i) => (seed >> i) % 3 === 0)
    .slice(0, 2)
    .map((token) => ({
      token,
      score: clamp(45 + (hash(token) % 30), 40, 79),
      tip: `Hold the vowel in ${token} a beat longer and soften the final consonant.`,
    }));
  return {
    ...scores,
    overall,
    problemTokens: problem,
    correctionKo: target,
    coachingNote:
      overall >= 85
        ? "Very close to native rhythm. Keep the ending intonation flat rather than rising."
        : "Slow down slightly and keep each syllable equal in length — Korean is syllable-timed.",
    demoMode: true,
  };
}

const DEMO_REPLIES: { ko: string; en: string }[] = [
  { ko: "네, 좋아요! 조금 더 말해 주세요.", en: "Yes, good! Tell me a little more." },
  { ko: "아, 그렇군요. 왜 그렇게 생각해요?", en: "Ah, I see. Why do you think so?" },
  { ko: "잘했어요! 다시 한 번 천천히 해 볼까요?", en: "Well done! Shall we try once more slowly?" },
  { ko: "그럼 오늘은 뭐 하고 싶어요?", en: "So what would you like to do today?" },
  { ko: "맞아요. 저도 그렇게 생각해요.", en: "Right. I think so too." },
  { ko: "한국어 정말 늘었네요. 계속해요!", en: "Your Korean has really improved. Keep going!" },
];

export function demoTurn(userText: string, opening?: string): TutorTurn {
  const pick = opening
    ? { ko: opening, en: "" }
    : (DEMO_REPLIES[hash(userText) % DEMO_REPLIES.length] as { ko: string; en: string });
  return {
    contentKo: pick.ko,
    contentEn: pick.en || "(demo reply)",
    romanization: romanize(pick.ko),
    breakdown: breakdownSentence(pick.ko),
    hintKo: "네, 맞아요.",
    hintEn: "Try answering with a full sentence, not just yes or no.",
    hintHi: "पूरा वाक्य बोलने की कोशिश कीजिए।",
    demoMode: true,
  };
}
