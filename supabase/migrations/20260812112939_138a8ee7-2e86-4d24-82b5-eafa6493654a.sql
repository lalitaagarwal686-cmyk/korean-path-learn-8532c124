
-- ============ ENUMS ============
create type public.korean_level as enum ('beginner','topik_i','intermediate','topik_ii','advanced');
create type public.speech_level as enum ('banmal','haeyoche','hamnidache','jondaenmal');
create type public.subscription_status as enum ('none','checkout','active','cancelled','expired');
create type public.session_kind as enum ('scenario','free_talk','lesson','shadowing');
create type public.mistake_kind as enum ('pronunciation','grammar','vocabulary','fluency','naturalness');

-- ============ PUBLIC CURRICULUM ============
create table public.tutors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  korean_name text not null,
  gender text not null,
  age_range text not null,
  personality text not null,
  voice_id text not null,
  tagline text not null,
  bio text not null,
  accent_color text not null default 'primary',
  speaks_hindi boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.grammar_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  pattern text not null,
  meaning text not null,
  level public.korean_level not null default 'beginner',
  speech_level public.speech_level not null default 'haeyoche',
  explanation_en text not null,
  explanation_hi text not null,
  example_ko text not null,
  example_en text not null,
  example_romanization text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  hangul text not null,
  romanization text not null,
  english text not null,
  hindi text not null,
  part_of_speech text not null default 'noun',
  level public.korean_level not null default 'beginner',
  category text not null default 'general',
  example_ko text not null default '',
  example_en text not null default '',
  example_hi text not null default '',
  created_at timestamptz not null default now(),
  unique (hangul, english)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  korean_title text not null,
  track text not null default 'conversation',
  level public.korean_level not null default 'beginner',
  summary text not null,
  objective text not null,
  minutes int not null default 4,
  xp_reward int not null default 40,
  coin_reward int not null default 10,
  is_free boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.lesson_steps (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  step_index int not null,
  kind text not null,
  title text not null,
  prompt_ko text not null default '',
  prompt_en text not null default '',
  prompt_hi text not null default '',
  romanization text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (lesson_id, step_index)
);

create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  korean_title text not null,
  category text not null default 'daily',
  emoji text not null default 'K',
  difficulty public.korean_level not null default 'beginner',
  learner_role text not null,
  tutor_role text not null,
  objective text not null,
  target_grammar text[] not null default '{}',
  target_vocabulary text[] not null default '{}',
  opening_line_ko text not null default '',
  opening_line_en text not null default '',
  is_free boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  icon text not null default 'award',
  tier text not null default 'bronze',
  requirement jsonb not null default '{}'::jsonb,
  sort_order int not null default 0
);

create table public.mission_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  goal_type text not null,
  goal_count int not null default 1,
  xp_reward int not null default 20,
  coin_reward int not null default 5,
  sort_order int not null default 0
);

create table public.topik_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  exam text not null,
  skill text not null,
  title text not null,
  description text not null,
  item_count int not null default 20,
  sort_order int not null default 0
);

grant select on public.tutors, public.grammar_topics, public.vocabulary, public.lessons,
  public.lesson_steps, public.scenarios, public.badges, public.mission_templates,
  public.topik_categories to anon, authenticated;
grant all on public.tutors, public.grammar_topics, public.vocabulary, public.lessons,
  public.lesson_steps, public.scenarios, public.badges, public.mission_templates,
  public.topik_categories to service_role;

alter table public.tutors enable row level security;
alter table public.grammar_topics enable row level security;
alter table public.vocabulary enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_steps enable row level security;
alter table public.scenarios enable row level security;
alter table public.badges enable row level security;
alter table public.mission_templates enable row level security;
alter table public.topik_categories enable row level security;

create policy "curriculum tutors readable" on public.tutors for select to anon, authenticated using (true);
create policy "curriculum grammar readable" on public.grammar_topics for select to anon, authenticated using (true);
create policy "curriculum vocab readable" on public.vocabulary for select to anon, authenticated using (true);
create policy "curriculum lessons readable" on public.lessons for select to anon, authenticated using (true);
create policy "curriculum steps readable" on public.lesson_steps for select to anon, authenticated using (true);
create policy "curriculum scenarios readable" on public.scenarios for select to anon, authenticated using (true);
create policy "curriculum badges readable" on public.badges for select to anon, authenticated using (true);
create policy "curriculum missions readable" on public.mission_templates for select to anon, authenticated using (true);
create policy "curriculum topik readable" on public.topik_categories for select to anon, authenticated using (true);

-- ============ SHARED HELPERS ============
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner',
  avatar_url text,
  level public.korean_level not null default 'beginner',
  xp int not null default 0,
  coins int not null default 0,
  streak_days int not null default 0,
  longest_streak int not null default 0,
  last_active_date date,
  daily_goal_minutes int not null default 20,
  preferred_tutor_id uuid references public.tutors(id) on delete set null,
  speech_speed text not null default 'normal',
  explanation_language text not null default 'english',
  hints_enabled boolean not null default true,
  notifications_enabled boolean not null default true,
  reminder_time time not null default '19:00',
  onboarded boolean not null default false,
  speaking_score int not null default 0,
  listening_score int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create trigger profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1), 'Learner'),
    new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- public leaderboard exposes only safe columns
create view public.leaderboard_entries
with (security_invoker = off) as
  select id as user_id, display_name, avatar_url, level, xp, streak_days
  from public.profiles order by xp desc limit 100;
grant select on public.leaderboard_entries to anon, authenticated;
grant all on public.leaderboard_entries to service_role;

-- ============ PRIVATE LEARNER DATA ============
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'in_progress',
  current_step int not null default 0,
  score int not null default 0,
  seconds_spent int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table public.user_vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vocabulary_id uuid references public.vocabulary(id) on delete cascade,
  custom_hangul text,
  custom_english text,
  mastery int not null default 0,
  review_count int not null default 0,
  correct_count int not null default 0,
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);

create table public.saved_phrases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hangul text not null,
  romanization text not null default '',
  english text not null default '',
  hindi text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create table public.conversation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tutor_id uuid references public.tutors(id) on delete set null,
  scenario_id uuid references public.scenarios(id) on delete set null,
  lesson_id uuid references public.lessons(id) on delete set null,
  kind public.session_kind not null default 'free_talk',
  topic text not null default '',
  speech_speed text not null default 'normal',
  turns int not null default 0,
  seconds_spent int not null default 0,
  overall_score int,
  summary text not null default '',
  demo_mode boolean not null default true,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.conversation_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  content_ko text not null default '',
  content_en text not null default '',
  romanization text not null default '',
  audio_url text,
  breakdown jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.speaking_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.conversation_sessions(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  target_text text not null,
  transcript text not null default '',
  mode text not null default 'repeat',
  demo_mode boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.pronunciation_feedback (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.speaking_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  pronunciation int not null default 0,
  grammar int not null default 0,
  vocabulary int not null default 0,
  fluency int not null default 0,
  naturalness int not null default 0,
  confidence int not null default 0,
  overall int not null default 0,
  problem_tokens jsonb not null default '[]'::jsonb,
  correction_ko text not null default '',
  coaching_note text not null default '',
  demo_mode boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind public.mistake_kind not null default 'grammar',
  original text not null,
  correction text not null default '',
  explanation text not null default '',
  times_seen int not null default 1,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'lesson',
  lesson_id uuid references public.lessons(id) on delete cascade,
  scenario_id uuid references public.scenarios(id) on delete cascade,
  title text not null,
  reason text not null default '',
  dismissed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.user_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_id uuid not null references public.mission_templates(id) on delete cascade,
  mission_date date not null default (now() at time zone 'utc')::date,
  progress int not null default 0,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_id, mission_date)
);

create table public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

create table public.learning_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  minutes int not null default 0,
  xp int not null default 0,
  lessons_completed int not null default 0,
  words_reviewed int not null default 0,
  speaking_attempts int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day)
);

create table public.topik_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.topik_categories(id) on delete cascade,
  completed_items int not null default 0,
  best_score int not null default 0,
  attempts int not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, category_id)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  plan text not null default 'free',
  billing_period text not null default 'monthly',
  status public.subscription_status not null default 'none',
  current_period_end timestamptz,
  provider text not null default 'none',
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default (now() at time zone 'utc')::date,
  conversations_started int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, usage_date)
);

grant select, insert, update, delete on
  public.user_progress, public.user_vocabulary, public.saved_phrases,
  public.conversation_sessions, public.conversation_messages, public.speaking_attempts,
  public.pronunciation_feedback, public.mistakes, public.recommendations,
  public.user_missions, public.user_badges, public.learning_days,
  public.topik_progress, public.subscriptions, public.ai_usage to authenticated;
grant all on
  public.user_progress, public.user_vocabulary, public.saved_phrases,
  public.conversation_sessions, public.conversation_messages, public.speaking_attempts,
  public.pronunciation_feedback, public.mistakes, public.recommendations,
  public.user_missions, public.user_badges, public.learning_days,
  public.topik_progress, public.subscriptions, public.ai_usage to service_role;

do $$
declare t text;
begin
  foreach t in array array['user_progress','user_vocabulary','saved_phrases','conversation_sessions',
    'conversation_messages','speaking_attempts','pronunciation_feedback','mistakes','recommendations',
    'user_missions','user_badges','learning_days','topik_progress','subscriptions','ai_usage']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own rows" on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;

create trigger user_progress_updated before update on public.user_progress for each row execute function public.update_updated_at_column();
create trigger user_vocabulary_updated before update on public.user_vocabulary for each row execute function public.update_updated_at_column();
create trigger conversation_sessions_updated before update on public.conversation_sessions for each row execute function public.update_updated_at_column();
create trigger mistakes_updated before update on public.mistakes for each row execute function public.update_updated_at_column();
create trigger user_missions_updated before update on public.user_missions for each row execute function public.update_updated_at_column();
create trigger learning_days_updated before update on public.learning_days for each row execute function public.update_updated_at_column();
create trigger topik_progress_updated before update on public.topik_progress for each row execute function public.update_updated_at_column();
create trigger subscriptions_updated before update on public.subscriptions for each row execute function public.update_updated_at_column();
create trigger ai_usage_updated before update on public.ai_usage for each row execute function public.update_updated_at_column();

create index on public.conversation_messages (session_id, created_at);
create index on public.user_vocabulary (user_id, due_at);
create index on public.mistakes (user_id, created_at desc);
create index on public.lesson_steps (lesson_id, step_index);

-- ============ SEED: TUTORS ============
insert into public.tutors (slug,name,korean_name,gender,age_range,personality,voice_id,tagline,bio,accent_color,speaks_hindi,sort_order) values
('seo-yeon','Seo-yeon','서연','female','20s','friendly teacher','ko-female-warm','Warm, clear and endlessly patient','Seo-yeon speaks slowly, repeats without judgement and celebrates every small win. Great for absolute beginners.','primary',true,1),
('min-jun','Min-jun','민준','male','30s','professional','ko-male-calm','Business Korean and precise honorifics','Min-jun keeps things structured. He corrects politely and drills workplace and interview language.','ink',false,2),
('ha-eun','Ha-eun','하은','female','20s','cute','ko-female-bright','Bubbly, playful and full of encouragement','Ha-eun turns practice into a game. Expect emoji-energy, K-pop examples and lots of 잘했어요!','accent',false,3),
('do-yun','Do-yun','도윤','male','20s','k-drama inspired','ko-male-soft','Cinematic Korean, natural everyday tone','Do-yun teaches the Korean you actually hear in dramas — contractions, 반말 and real rhythm.','gold',false,4),
('ji-woo','Ji-woo','지우','female','30s','patient','ko-female-calm','Slow, steady and detail-focused','Ji-woo breaks every sentence down word by word and never rushes you to the next line.','primary',true,5),
('tae-yang','Tae-yang','태양','male','20s','energetic','ko-male-bright','High-tempo speaking workouts','Tae-yang pushes your pace. Shadowing, speed rounds and confidence drills are his specialty.','accent',false,6),
('na-ri','Na-ri','나리','female','20s','supportive friend','ko-female-soft','Talk like you would with a close friend','Na-ri chats casually about your day, food and travel, keeping corrections gentle and conversational.','ink',true,7);

-- ============ SEED: GRAMMAR ============
insert into public.grammar_topics (slug,pattern,meaning,level,speech_level,explanation_en,explanation_hi,example_ko,example_en,example_romanization,sort_order) values
('topic-marker','은/는','Topic marker','beginner','haeyoche','Marks what the sentence is about, often adding contrast. Use 은 after a consonant, 는 after a vowel.','वाक्य का विषय बताता है, हिंदी के "तो" जैसा भाव देता है।','저는 인도 사람이에요.','I am Indian.','jeoneun indo saramieyo',1),
('subject-marker','이/가','Subject marker','beginner','haeyoche','Points at who or what performs the action. 이 after a consonant, 가 after a vowel.','क्रिया करने वाले को दर्शाता है।','친구가 왔어요.','My friend came.','chinguga wasseoyo',2),
('object-marker','을/를','Object marker','beginner','haeyoche','Marks the direct object of a verb.','क्रिया के कर्म को चिह्नित करता है।','커피를 마셔요.','I drink coffee.','keopireul masyeoyo',3),
('want-to','-고 싶어요','Want to ...','beginner','haeyoche','Attach to a verb stem to express your own wish.','अपनी इच्छा बताने के लिए क्रिया के साथ जोड़ें।','한국에 가고 싶어요.','I want to go to Korea.','hangug-e gago sipeoyo',4),
('must','-아/어야 해요','Must / have to','beginner','haeyoche','Expresses obligation, used constantly in daily speech.','आवश्यकता या मजबूरी बताता है।','지금 공부해야 해요.','I have to study now.','jigeum gongbuhaeya haeyo',5),
('can-do','-(으)ㄹ 수 있어요','Can / be able to','beginner','haeyoche','Expresses ability or possibility.','सक्षम होना बताता है।','한국어를 조금 할 수 있어요.','I can speak a little Korean.','hangugeoreul jogeum hal su isseoyo',6),
('because','-아서/어서','Because / and then','intermediate','haeyoche','Links a cause to its result, or two sequential actions.','कारण या क्रम बताने के लिए।','늦어서 죄송합니다.','I am sorry for being late.','neujeoseo joesonghamnida',7),
('polite-request','-(으)세요','Polite request / honorific','beginner','jondaenmal','Softens a command into a polite request and honours the listener.','विनम्र निवेदन के लिए।','여기 앉으세요.','Please sit here.','yeogi anjeuseyo',8),
('past-tense','-았/었어요','Past tense','beginner','haeyoche','Standard polite past-tense ending.','भूतकाल दर्शाता है।','어제 영화를 봤어요.','I watched a movie yesterday.','eoje yeonghwareul bwasseoyo',9),
('formal-polite','-ㅂ니다/습니다','Formal polite ending','intermediate','hamnidache','Used in presentations, news, the military and formal workplaces.','औपचारिक स्थितियों में प्रयोग होता है।','처음 뵙겠습니다.','It is a pleasure to meet you.','cheoeum boepgetseumnida',10),
('casual','반말 -아/어','Casual speech','intermediate','banmal','Used with close friends and people younger than you. Never with strangers or seniors.','करीबी दोस्तों के साथ प्रयोग करें।','뭐 해?','What are you doing?','mwo hae',11),
('while','-(으)면서','While doing','intermediate','haeyoche','Two actions happening at the same time.','दो काम एक साथ होने पर।','음악을 들으면서 공부해요.','I study while listening to music.','eumageul deureumyeonseo gongbuhaeyo',12);

-- ============ SEED: VOCABULARY ============
insert into public.vocabulary (hangul,romanization,english,hindi,part_of_speech,level,category,example_ko,example_en,example_hi) values
('안녕하세요','annyeonghaseyo','Hello (polite)','नमस्ते','phrase','beginner','greetings','안녕하세요, 만나서 반가워요.','Hello, nice to meet you.','नमस्ते, आपसे मिलकर खुशी हुई।'),
('감사합니다','gamsahamnida','Thank you (formal)','धन्यवाद','phrase','beginner','greetings','도와주셔서 감사합니다.','Thank you for helping me.','मदद के लिए धन्यवाद।'),
('죄송합니다','joesonghamnida','I am sorry (formal)','माफ़ कीजिए','phrase','beginner','greetings','늦어서 죄송합니다.','Sorry for being late.','देर के लिए माफ़ी।'),
('물','mul','Water','पानी','noun','beginner','food','물 한 잔 주세요.','Please give me a glass of water.','एक गिलास पानी दीजिए।'),
('커피','keopi','Coffee','कॉफ़ी','noun','beginner','cafe','아이스 커피 주세요.','An iced coffee, please.','आइस कॉफ़ी दीजिए।'),
('학교','hakgyo','School','स्कूल','noun','beginner','school','저는 학교에 가요.','I go to school.','मैं स्कूल जाता हूँ।'),
('친구','chingu','Friend','दोस्त','noun','beginner','people','친구와 같이 공부해요.','I study with a friend.','मैं दोस्त के साथ पढ़ता हूँ।'),
('맛있어요','masisseoyo','It is delicious','स्वादिष्ट है','adjective','beginner','food','이 김치는 정말 맛있어요.','This kimchi is really delicious.','यह किमची सचमुच स्वादिष्ट है।'),
('얼마예요','eolmayeyo','How much is it?','कितने का है?','phrase','beginner','shopping','이거 얼마예요?','How much is this?','यह कितने का है?'),
('주세요','juseyo','Please give me','दीजिए','phrase','beginner','shopping','메뉴 주세요.','Menu, please.','मेन्यू दीजिए।'),
('어디','eodi','Where','कहाँ','pronoun','beginner','directions','화장실이 어디예요?','Where is the restroom?','शौचालय कहाँ है?'),
('공항','gonghang','Airport','हवाई अड्डा','noun','beginner','travel','공항까지 가 주세요.','Please take me to the airport.','हवाई अड्डे तक ले चलिए।'),
('회사','hoesa','Company','कंपनी','noun','intermediate','work','회사에서 일해요.','I work at a company.','मैं कंपनी में काम करता हूँ।'),
('면접','myeonjeop','Job interview','साक्षात्कार','noun','intermediate','work','내일 면접이 있어요.','I have an interview tomorrow.','कल मेरा इंटरव्यू है।'),
('아파요','apayo','It hurts / I am sick','दर्द है','adjective','beginner','health','머리가 아파요.','I have a headache.','सिर दर्द कर रहा है।'),
('예약','yeyak','Reservation','आरक्षण','noun','intermediate','travel','예약했어요.','I made a reservation.','मैंने बुकिंग की है।'),
('지하철','jihacheol','Subway','मेट्रो','noun','beginner','transport','지하철로 갈게요.','I will go by subway.','मैं मेट्रो से जाऊँगा।'),
('노래','norae','Song','गाना','noun','beginner','culture','이 노래 좋아해요.','I like this song.','मुझे यह गाना पसंद है।'),
('드라마','deurama','Drama / series','ड्रामा','noun','beginner','culture','한국 드라마를 봐요.','I watch Korean dramas.','मैं कोरियाई ड्रामा देखता हूँ।'),
('연습','yeonseup','Practice','अभ्यास','noun','beginner','study','매일 연습해요.','I practise every day.','मैं रोज़ अभ्यास करता हूँ।'),
('천천히','cheoncheonhi','Slowly','धीरे','adverb','beginner','study','천천히 말해 주세요.','Please speak slowly.','कृपया धीरे बोलिए।'),
('다시','dasi','Again','फिर से','adverb','beginner','study','다시 한 번 말해 주세요.','Please say it once more.','कृपया एक बार फिर कहिए।'),
('배고파요','baegopayo','I am hungry','भूख लगी है','adjective','beginner','food','너무 배고파요.','I am so hungry.','मुझे बहुत भूख लगी है।'),
('괜찮아요','gwaenchanayo','It is okay / I am fine','ठीक है','phrase','beginner','greetings','저는 괜찮아요.','I am fine.','मैं ठीक हूँ।');

-- ============ SEED: LESSONS ============
insert into public.lessons (slug,title,korean_title,track,level,summary,objective,minutes,xp_reward,coin_reward,is_free,sort_order) values
('hangul-first-sounds','Hangul: First Sounds','한글 첫걸음','hangul','beginner','Read your first syllable blocks and say them out loud.','Read and pronounce 10 basic syllables.',4,40,10,true,1),
('greetings-first-hello','Your First Hello','첫 인사','conversation','beginner','Greet someone politely and introduce yourself in one breath.','Greet and introduce yourself confidently.',4,50,12,true,2),
('cafe-ordering','Ordering at a Café','카페에서 주문하기','conversation','beginner','Order a drink, adjust the size and pay — the most useful beginner scene.','Order a drink and answer two follow-up questions.',5,60,15,true,3),
('numbers-prices','Numbers and Prices','숫자와 가격','vocabulary','beginner','Sino-Korean numbers, prices and counting things you buy.','Ask and understand prices up to 100,000 won.',5,50,12,true,4),
('particles-eun-neun','Particles 은/는 vs 이/가','조사 완전 정복','grammar','beginner','The single biggest beginner confusion, explained with contrast pairs.','Choose the right particle in 8 out of 10 sentences.',5,60,15,true,5),
('directions-asking','Asking for Directions','길 묻기','conversation','beginner','Stop a stranger politely and understand the answer you get back.','Ask for and follow a two-step direction.',5,60,15,true,6),
('speech-levels','Speech Levels: 반말 to 존댓말','말의 높임','grammar','intermediate','When to soften, when to be formal, and how to switch mid-conversation.','Convert 6 sentences between speech levels.',5,70,18,false,7),
('restaurant-full-meal','Restaurant: A Full Meal','식당에서','conversation','beginner','From being seated to asking for the bill, with spice-level negotiation.','Complete a restaurant order end to end.',5,60,15,true,8),
('kdrama-listening','K-Drama Listening Ear','드라마 듣기','listening','intermediate','Catch contractions and casual endings at natural drama speed.','Transcribe 5 casual drama lines.',5,70,18,false,9),
('interview-korean','Job Interview Korean','면접 한국어','speaking','intermediate','Introduce your experience and answer the three questions that always come.','Deliver a 60-second self introduction.',5,80,20,false,10),
('topik-i-reading','TOPIK I Reading Warm-up','토픽 I 읽기','topik','topik_i','Signs, short notices and the question patterns that repeat every year.','Answer 8 TOPIK I style reading items.',5,70,18,true,11),
('culture-manners','Korean Table Manners','한국 예절','culture','beginner','Two hands, elders first, and the language that goes with each custom.','Use 3 culturally correct expressions at a meal.',4,50,12,true,12);

-- lesson steps for the flagship café lesson
insert into public.lesson_steps (lesson_id, step_index, kind, title, prompt_ko, prompt_en, prompt_hi, romanization, payload)
select l.id, s.idx, s.kind, s.title, s.ko, s.en, s.hi, s.rom, s.payload
from public.lessons l,
(values
 (0,'scenario','The scene','','You walk into a busy Seoul café. The barista greets you.','आप सियोल के एक व्यस्त कैफ़े में जाते हैं।','','{}'::jsonb),
 (1,'dialogue','Listen first','어서 오세요! 주문하시겠어요?','Welcome! Would you like to order?','स्वागत है! ऑर्डर करेंगे?','eoseo oseyo! jumunhasigesseoyo?','{}'::jsonb),
 (2,'key_expression','Key expression','아이스 아메리카노 한 잔 주세요.','One iced americano, please.','एक आइस अमेरिकानो दीजिए।','aiseu amerikano han jan juseyo','{}'::jsonb),
 (3,'vocabulary','Words you need','','Learn the five words that carry this whole scene.','इस दृश्य के पाँच ज़रूरी शब्द।','','{"words":["커피","주세요","얼마예요","물","괜찮아요"]}'::jsonb),
 (4,'listen','Listen and repeat','사이즈는 어떻게 해 드릴까요?','What size would you like?','कौन सा साइज़ चाहिए?','saijeuneun eotteoke hae deurilkkayo?','{}'::jsonb),
 (5,'speak','Your turn','큰 사이즈로 주세요.','Large size, please.','बड़ा साइज़ दीजिए।','keun saijeuro juseyo','{}'::jsonb),
 (6,'pronunciation','Pronunciation check','','We score pronunciation, fluency and naturalness on your attempt.','आपके उच्चारण का विश्लेषण।','','{}'::jsonb),
 (7,'recall','Recall','','Say the full order from memory, without looking.','बिना देखे पूरा ऑर्डर बोलिए।','','{}'::jsonb),
 (8,'roleplay','Guided roleplay','카드로 결제할게요.','I will pay by card.','कार्ड से भुगतान करूँगा।','kadeuro gyeoljehalgeyo','{}'::jsonb),
 (9,'free_talk','Free conversation','','Chat freely with the barista about your drink.','बरिस्ता से खुलकर बात कीजिए।','','{}'::jsonb),
 (10,'report','Performance report','','See your scores, mistakes and what to review next.','अपना स्कोर और सुधार देखिए।','','{}'::jsonb)
) as s(idx,kind,title,ko,en,hi,rom,payload)
where l.slug = 'cafe-ordering';

-- ============ SEED: SCENARIOS ============
insert into public.scenarios (slug,title,korean_title,category,emoji,difficulty,learner_role,tutor_role,objective,target_grammar,target_vocabulary,opening_line_ko,opening_line_en,is_free,sort_order) values
('cafe','Café','카페','daily','☕','beginner','Customer','Barista','Order a drink, choose a size and pay.','{주세요,-(으)ㄹ게요}','{커피,주세요,얼마예요}','어서 오세요! 주문 도와드릴까요?','Welcome! May I take your order?',true,1),
('restaurant','Restaurant','식당','daily','🍲','beginner','Diner','Server','Order a meal, adjust spice level and ask for the bill.','{주세요,-아/어서}','{맛있어요,물,얼마예요}','몇 분이세요?','How many people?',true,2),
('shopping','Shopping','쇼핑','daily','🛍️','beginner','Shopper','Shop assistant','Ask for a size, compare prices and request a discount.','{얼마예요,-(으)ㄹ 수 있어요}','{얼마예요,주세요}','찾으시는 거 있으세요?','Are you looking for something?',true,3),
('university','University','대학교','study','🎓','intermediate','Student','Classmate','Introduce yourself and ask about the class schedule.','{은/는,-아서/어서}','{학교,친구,연습}','안녕하세요, 이 수업 처음이세요?','Hi, is this your first time in this class?',true,4),
('airport','Airport','공항','travel','✈️','beginner','Traveller','Check-in agent','Check in, ask about baggage and find your gate.','{-(으)세요,어디}','{공항,예약,어디}','여권 보여 주시겠어요?','Could you show me your passport?',true,5),
('korean-friend','Meeting a Korean Friend','친구 만나기','social','🤝','beginner','New friend','Local friend','Exchange introductions and make weekend plans.','{반말 -아/어,-고 싶어요}','{친구,노래,드라마}','우리 반말해도 돼?','Is it okay if we speak casually?',true,6),
('job-interview','Job Interview','면접','work','💼','intermediate','Candidate','Interviewer','Give a self introduction and answer about your strengths.','{-ㅂ니다/습니다,-아서/어서}','{회사,면접,연습}','자기소개 부탁드립니다.','Please introduce yourself.',false,7),
('hospital','Hospital','병원','health','🏥','intermediate','Patient','Doctor','Describe symptoms and understand the instructions.','{-아요/어요,-(으)세요}','{아파요,물,다시}','어디가 불편하세요?','Where does it hurt?',false,8),
('transportation','Transportation','교통','travel','🚇','beginner','Passenger','Station staff','Buy a ticket and confirm the transfer.','{어디,-(으)ㄹ 수 있어요}','{지하철,어디,공항}','어디까지 가세요?','Where are you heading?',true,9),
('hotel','Hotel','호텔','travel','🏨','beginner','Guest','Receptionist','Check in and ask about breakfast times.','{예약,-(으)세요}','{예약,어디,괜찮아요}','예약하셨어요?','Do you have a reservation?',true,10),
('directions','Asking Directions','길 묻기','daily','🧭','beginner','Lost visitor','Passerby','Ask for and confirm a two-step route.','{어디,-(으)세요}','{어디,지하철,다시}','네, 뭐 도와드릴까요?','Yes, how can I help?',true,11),
('appointments','Making Appointments','약속 잡기','daily','📅','intermediate','Caller','Receptionist','Fix a date and time politely.','{-(으)ㄹ게요,-아야 해요}','{예약,다시,연습}','언제가 편하세요?','When works for you?',true,12),
('school','School','학교','study','🏫','beginner','Student','Teacher','Ask a question about homework politely.','{-(으)세요,은/는}','{학교,연습,다시}','질문 있어요?','Do you have a question?',true,13),
('workplace','Workplace','직장','work','🏢','intermediate','New employee','Team lead','Report progress and ask for a deadline extension.','{-ㅂ니다/습니다,-아야 해요}','{회사,연습,면접}','오늘 업무 어떻게 되고 있어요?','How is today going?',false,14),
('social','Social Gathering','모임','social','🎉','intermediate','Guest','Host','Make small talk and compliment the food.','{-네요,맛있어요}','{맛있어요,친구,노래}','와 주셔서 감사해요!','Thanks for coming!',true,15),
('kdrama','K-Drama Korean','드라마 한국어','culture','🎬','intermediate','Co-star','Scene partner','Deliver casual drama lines with natural rhythm.','{반말 -아/어,-(으)면서}','{드라마,노래,다시}','야, 진짜 그렇게 생각해?','Hey, do you really think so?',false,16),
('kpop','K-Pop and Culture','케이팝 문화','culture','🎤','beginner','Fan','Fellow fan','Talk about your bias, concerts and lyrics.','{-고 싶어요,은/는}','{노래,드라마,친구}','최애 누구예요?','Who is your favourite?',true,17);

-- ============ SEED: BADGES ============
insert into public.badges (slug,name,description,icon,tier,requirement,sort_order) values
('first-word','First Word','You said your first Korean sentence out loud.','mic','bronze','{"speaking_attempts":1}',1),
('hangul-master','Hangul Master','Read all basic Hangul letters correctly.','book-open','silver','{"lesson":"hangul-first-sounds"}',2),
('streak-7','7-Day Flame','Practised seven days in a row.','flame','bronze','{"streak":7}',3),
('streak-30','30-Day Flame','A full month without missing a day.','flame','silver','{"streak":30}',4),
('streak-100','100-Day Flame','One hundred days of Korean.','flame','gold','{"streak":100}',5),
('streak-365','365-Day Flame','A full year of daily practice.','flame','platinum','{"streak":365}',6),
('words-100','100 Words','Saved and reviewed one hundred words.','library','bronze','{"vocabulary":100}',7),
('words-500','500 Words','Half a thousand words in your memory.','library','gold','{"vocabulary":500}',8),
('conversation-10','Ten Conversations','Completed ten AI conversations.','messages-square','silver','{"conversations":10}',9),
('pronunciation-90','Clear Speaker','Scored 90+ on pronunciation.','audio-lines','gold','{"pronunciation":90}',10),
('topik-ready','TOPIK Ready','Finished a full mock paper.','graduation-cap','gold','{"topik_mock":1}',11),
('night-owl','Night Owl','Practised after midnight.','moon','bronze','{"late_session":1}',12);

-- ============ SEED: MISSIONS ============
insert into public.mission_templates (slug,title,description,goal_type,goal_count,xp_reward,coin_reward,sort_order) values
('daily-lesson','Finish one lesson','Complete any 2–5 minute mission today.','lesson',1,40,10,1),
('speak-5','Speak 5 sentences','Record five speaking attempts.','speaking',5,50,12,2),
('review-10','Review 10 words','Clear ten due vocabulary cards.','vocabulary',10,30,8,3),
('ai-chat','Talk to your AI tutor','Hold one conversation of at least 6 turns.','conversation',1,60,15,4),
('shadow-1','Shadow one dialogue','Match rhythm and intonation in shadowing mode.','shadowing',1,40,10,5),
('grammar-1','Learn one grammar point','Study a new pattern and use it in a sentence.','grammar',1,30,8,6);

-- ============ SEED: TOPIK ============
insert into public.topik_categories (slug,exam,skill,title,description,item_count,sort_order) values
('topik1-vocab','TOPIK I','Vocabulary','TOPIK I Vocabulary','The 800 highest-frequency words for Levels 1–2.',40,1),
('topik1-grammar','TOPIK I','Grammar','TOPIK I Grammar','Particles, tenses and connectors that appear every year.',30,2),
('topik1-reading','TOPIK I','Reading','TOPIK I Reading','Signs, notices, short messages and matching questions.',40,3),
('topik1-listening','TOPIK I','Listening','TOPIK I Listening','Slow dialogues with picture and inference questions.',30,4),
('topik1-mock','TOPIK I','Mock Test','TOPIK I Mock Paper','A timed full-length practice paper with instant scoring.',70,5),
('topik2-vocab','TOPIK II','Vocabulary','TOPIK II Vocabulary','Abstract, academic and news vocabulary for Levels 3–6.',50,6),
('topik2-grammar','TOPIK II','Grammar','TOPIK II Grammar','Advanced connectors, quotations and written endings.',40,7),
('topik2-reading','TOPIK II','Reading','TOPIK II Reading','Editorials, essays and long-passage inference.',50,8),
('topik2-listening','TOPIK II','Listening','TOPIK II Listening','Lectures, interviews and native-speed discussion.',50,9),
('topik2-writing','TOPIK II','Writing','TOPIK II Writing','51/52 short answers plus 53/54 essay templates.',20,10),
('topik2-mock','TOPIK II','Mock Test','TOPIK II Mock Paper','A timed full-length practice paper across all skills.',74,11);
