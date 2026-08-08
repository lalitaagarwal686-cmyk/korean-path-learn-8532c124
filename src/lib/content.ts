/**
 * Sample Korean-learning content.
 * All content here is original and intentionally easy to edit.
 */

export type Level = "Beginner" | "Elementary" | "Intermediate" | "Upper-Int" | "Advanced";

export type Course = {
  id: string;
  title: string;
  koreanTitle: string;
  level: Level;
  summary: string;
  lessons: number;
  hours: number;
  topik: string;
  tags: string[];
};

export const courses: Course[] = [
  {
    id: "hangul-foundations",
    title: "Hangul Foundations",
    koreanTitle: "한글 기초",
    level: "Beginner",
    summary:
      "Read and write all 24 letters with stroke order, syllable blocks and sound drills built for Indian learners.",
    lessons: 18,
    hours: 9,
    topik: "Pre-TOPIK",
    tags: ["Reading", "Writing", "Pronunciation"],
  },
  {
    id: "survival-korean",
    title: "Survival Korean",
    koreanTitle: "생활 한국어",
    level: "Beginner",
    summary:
      "Greetings, numbers, ordering food, directions and polite speech you can use from week one.",
    lessons: 24,
    hours: 12,
    topik: "TOPIK I · Level 1",
    tags: ["Speaking", "Vocabulary"],
  },
  {
    id: "grammar-core",
    title: "Grammar Core A1–A2",
    koreanTitle: "핵심 문법",
    level: "Elementary",
    summary:
      "Particles, tenses and connectors explained with Hindi/English contrast so patterns finally stick.",
    lessons: 32,
    hours: 16,
    topik: "TOPIK I · Level 2",
    tags: ["Grammar", "Writing"],
  },
  {
    id: "conversation-lab",
    title: "Conversation Lab",
    koreanTitle: "회화 연습실",
    level: "Intermediate",
    summary:
      "Shadowing, role-play and AI speaking partners that score your pronunciation sentence by sentence.",
    lessons: 28,
    hours: 15,
    topik: "TOPIK II · Level 3",
    tags: ["Speaking", "Listening", "AI"],
  },
  {
    id: "topik-ii-sprint",
    title: "TOPIK II Sprint",
    koreanTitle: "토픽 II 집중",
    level: "Upper-Int",
    summary:
      "Timed mock tests, essay templates and listening strategy for a confident Level 4–5 attempt.",
    lessons: 22,
    hours: 20,
    topik: "TOPIK II · Level 4–5",
    tags: ["Exam", "Writing", "Listening"],
  },
  {
    id: "business-korean",
    title: "Business & Workplace Korean",
    koreanTitle: "비즈니스 한국어",
    level: "Advanced",
    summary:
      "Emails, honorifics, interviews and meeting language for careers with Korean companies in India.",
    lessons: 20,
    hours: 14,
    topik: "TOPIK II · Level 5–6",
    tags: ["Career", "Honorifics"],
  },
];

export type Word = {
  hangul: string;
  romanization: string;
  english: string;
  hindi: string;
  example: string;
  exampleEnglish: string;
};

export const words: Word[] = [
  {
    hangul: "안녕하세요",
    romanization: "annyeonghaseyo",
    english: "Hello (polite)",
    hindi: "नमस्ते",
    example: "안녕하세요, 만나서 반가워요.",
    exampleEnglish: "Hello, nice to meet you.",
  },
  {
    hangul: "감사합니다",
    romanization: "gamsahamnida",
    english: "Thank you (formal)",
    hindi: "धन्यवाद",
    example: "도와주셔서 감사합니다.",
    exampleEnglish: "Thank you for helping me.",
  },
  {
    hangul: "물",
    romanization: "mul",
    english: "Water",
    hindi: "पानी",
    example: "물 한 잔 주세요.",
    exampleEnglish: "Please give me a glass of water.",
  },
  {
    hangul: "학교",
    romanization: "hakgyo",
    english: "School",
    hindi: "स्कूल",
    example: "저는 학교에 가요.",
    exampleEnglish: "I go to school.",
  },
  {
    hangul: "친구",
    romanization: "chingu",
    english: "Friend",
    hindi: "दोस्त",
    example: "친구와 같이 공부해요.",
    exampleEnglish: "I study together with a friend.",
  },
  {
    hangul: "맛있어요",
    romanization: "masisseoyo",
    english: "It's delicious",
    hindi: "स्वादिष्ट है",
    example: "이 김치는 정말 맛있어요.",
    exampleEnglish: "This kimchi is really delicious.",
  },
];

export const hangulLetters = [
  { char: "ㄱ", sound: "g / k", tip: "Like 'g' in 'go'" },
  { char: "ㄴ", sound: "n", tip: "Like 'n' in 'now'" },
  { char: "ㄷ", sound: "d / t", tip: "Like 'd' in 'door'" },
  { char: "ㄹ", sound: "r / l", tip: "Between Hindi 'र' and 'ल'" },
  { char: "ㅁ", sound: "m", tip: "Like 'm' in 'moon'" },
  { char: "ㅂ", sound: "b / p", tip: "Like 'b' in 'book'" },
  { char: "ㅅ", sound: "s", tip: "Like 's' in 'sun'" },
  { char: "ㅇ", sound: "silent / ng", tip: "Silent at start, 'ng' at end" },
  { char: "ㅏ", sound: "a", tip: "Like 'a' in 'father'" },
  { char: "ㅓ", sound: "eo", tip: "Like 'u' in 'up'" },
  { char: "ㅗ", sound: "o", tip: "Like 'o' in 'more'" },
  { char: "ㅜ", sound: "u", tip: "Like 'oo' in 'moon'" },
];

export type GrammarPoint = {
  pattern: string;
  meaning: string;
  note: string;
  example: string;
  exampleEnglish: string;
};

export const grammarPoints: GrammarPoint[] = [
  {
    pattern: "은/는",
    meaning: "Topic marker",
    note: "Marks what the sentence is about — similar in feel to Hindi 'तो'.",
    example: "저는 인도 사람이에요.",
    exampleEnglish: "I am Indian.",
  },
  {
    pattern: "이/가",
    meaning: "Subject marker",
    note: "Points at who or what performs the action.",
    example: "친구가 왔어요.",
    exampleEnglish: "My friend came.",
  },
  {
    pattern: "-고 싶어요",
    meaning: "Want to ...",
    note: "Attach to a verb stem to express your own wish.",
    example: "한국에 가고 싶어요.",
    exampleEnglish: "I want to go to Korea.",
  },
  {
    pattern: "-아/어야 해요",
    meaning: "Must / have to",
    note: "Obligation form used constantly in daily speech.",
    example: "지금 공부해야 해요.",
    exampleEnglish: "I have to study now.",
  },
];

export type QuizQuestion = {
  id: string;
  type: "mcq" | "blank";
  prompt: string;
  korean?: string;
  options?: string[];
  answer: string;
  explanation: string;
};

export const quiz: QuizQuestion[] = [
  {
    id: "q1",
    type: "mcq",
    prompt: "What does 안녕하세요 mean?",
    korean: "안녕하세요",
    options: ["Goodbye", "Hello", "Sorry", "Thank you"],
    answer: "Hello",
    explanation: "안녕하세요 is the standard polite greeting used at any time of day.",
  },
  {
    id: "q2",
    type: "mcq",
    prompt: "Which particle marks the topic of a sentence?",
    options: ["은/는", "이/가", "을/를", "에서"],
    answer: "은/는",
    explanation: "은/는 introduces or contrasts the topic; 이/가 marks the grammatical subject.",
  },
  {
    id: "q3",
    type: "blank",
    prompt: "Complete: 저___ 학생이에요. (I am a student.)",
    answer: "는",
    explanation: "저 ends in a vowel, so the topic marker 는 is used.",
  },
  {
    id: "q4",
    type: "mcq",
    prompt: "Choose the correct meaning of 맛있어요.",
    korean: "맛있어요",
    options: ["It's expensive", "It's delicious", "It's spicy", "It's cold"],
    answer: "It's delicious",
    explanation: "맛 (taste) + 있어요 (exists) = it has taste, i.e. it's delicious.",
  },
];

export const lessonSteps = [
  { id: "intro", label: "Warm-up" },
  { id: "vocab", label: "Vocabulary" },
  { id: "grammar", label: "Grammar" },
  { id: "quiz", label: "Quiz" },
  { id: "done", label: "Complete" },
] as const;

export const testimonials = [
  {
    name: "Ananya Iyer",
    role: "TOPIK II Level 4 · Bengaluru",
    quote:
      "The Hindi-and-English explanations made particles finally click. I cleared Level 4 in seven months studying 40 minutes a day on my phone.",
  },
  {
    name: "Rohit Menon",
    role: "Engineer at a Korean auto supplier · Chennai",
    quote:
      "Speaking drills with instant pronunciation feedback were the difference. I now run standups partly in Korean.",
  },
  {
    name: "Simran Kaur",
    role: "Exchange student · Seoul",
    quote:
      "I started from zero Hangul. The streak system kept me honest, and the mock tests matched the real exam pacing.",
  },
];

export const faqs = [
  {
    q: "I know zero Korean. Where do I start?",
    a: "Start with Hangul Foundations. You will read your first Korean words in about 90 minutes and finish the alphabet in two weeks at 20 minutes a day.",
  },
  {
    q: "Do you explain things in Hindi as well as English?",
    a: "Yes. Vocabulary and grammar cards carry both English and Hindi meanings, and tricky sounds are compared to Devanagari equivalents.",
  },
  {
    q: "Will this prepare me for the TOPIK exam?",
    a: "The TOPIK track covers I and II with timed mock papers, listening strategy, and 51/52/53/54 writing templates with model answers.",
  },
  {
    q: "How much time do I need each day?",
    a: "Twenty focused minutes is enough to keep a streak. The daily plan adapts to the time you have available.",
  },
  {
    q: "Does it work well on a phone?",
    a: "It is built mobile-first. Lessons, flashcards and audio drills are designed for one-handed use on small Android screens.",
  },
  {
    q: "Can I try before paying?",
    a: "The placement test, the first unit of every course, and daily practice are free to use for as long as you like.",
  },
];

export const learningPath = [
  {
    step: "01",
    title: "Placement",
    korean: "레벨 진단",
    body: "A 6-minute adaptive test places you on the right rung — no guesswork, no repeating what you know.",
  },
  {
    step: "02",
    title: "Daily plan",
    korean: "매일 학습",
    body: "Short stacked sessions: vocabulary recall, one grammar pattern, one speaking drill, one listening clip.",
  },
  {
    step: "03",
    title: "Active recall",
    korean: "복습 알고리즘",
    body: "Spaced repetition schedules every word and pattern so review arrives exactly before you forget.",
  },
  {
    step: "04",
    title: "Real usage",
    korean: "실전 적용",
    body: "AI role-plays, writing feedback and mock exams turn recognition into production you can rely on.",
  },
];

export const stats = [
  { value: "38,000+", label: "learners across India" },
  { value: "92%", label: "pass rate on first TOPIK attempt" },
  { value: "4.9/5", label: "average lesson rating" },
  { value: "20 min", label: "average daily session" },
];

export const progressData = {
  streak: 24,
  xp: 8460,
  level: 7,
  levelLabel: "Elementary II",
  xpToNext: 1540,
  weekly: [
    { day: "Mon", xp: 120 },
    { day: "Tue", xp: 180 },
    { day: "Wed", xp: 90 },
    { day: "Thu", xp: 210 },
    { day: "Fri", xp: 150 },
    { day: "Sat", xp: 240 },
    { day: "Sun", xp: 80 },
  ],
  skills: [
    { name: "Reading", value: 78 },
    { name: "Listening", value: 64 },
    { name: "Speaking", value: 52 },
    { name: "Writing", value: 41 },
  ],
  badges: [
    { name: "Hangul Master", note: "All 24 letters" },
    { name: "30-Day Flame", note: "Streak milestone" },
    { name: "500 Words", note: "Vocabulary" },
    { name: "Mock Test Pro", note: "3 papers cleared" },
  ],
};
