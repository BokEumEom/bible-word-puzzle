import { motion } from 'motion/react';
import { BookOpen, Flame, Heart, Star, Clock, RotateCcw, Shuffle } from 'lucide-react';
import { Verse } from '../types';
import { UserProgress } from '../hooks/useUserProgress';
import { LevelInfo } from '../data/levels';
import { verses as presetVerses } from '../data/verses';
import { getRecommendations } from '../utils/recommend';
import { getDueReviews } from '../utils/spaced';
import { InstallPrompt } from './InstallPrompt';
import { SectionTitle } from './ui/SectionTitle';
import { ActionButton } from './ui/ActionButton';

interface Props {
  readonly progress: UserProgress;
  readonly isDailyGoalMet: boolean;
  readonly currentLevel: LevelInfo;
  readonly onStartPreset: () => void;
  readonly onSelectVerse: (verse: Verse) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '고요한 밤이에요';
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

function isNightTime(): boolean {
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
}

function getJoyMessage(options: {
  isDailyGoalMet: boolean;
  streak: number;
  remainingReviews: number;
  todayCompletions: number;
  dailyGoal: number;
  totalCompleted: number;
}): string {
  const { isDailyGoalMet, streak, remainingReviews, todayCompletions, dailyGoal, totalCompleted } = options;

  if (isDailyGoalMet) return '오늘 목표 달성! 대단해!';
  if (streak >= 7) return `벌써 ${streak}일째! 멋져!`;
  if (remainingReviews > 0) return `다시 만날 말씀이 ${remainingReviews}개 있어!`;
  if (todayCompletions > 0) {
    const remaining = dailyGoal - todayCompletions;
    return `${remaining}개 더 풀면 목표 달성!`;
  }
  if (totalCompleted === 0) return '첫 퍼즐을 풀어볼까?';
  return getGreeting();
}

function getJoyPose(options: {
  isDailyGoalMet: boolean;
  streak: number;
  remainingReviews: number;
  todayCompletions: number;
  totalCompleted: number;
}): string {
  const { isDailyGoalMet, streak, remainingReviews, todayCompletions, totalCompleted } = options;

  if (isDailyGoalMet) return '/joy-excited.png';
  if (streak >= 7) return '/joy-proud.png';
  if (remainingReviews > 0) return '/joy-focused.png';
  if (todayCompletions > 0) return '/joy-happy.png';
  if (totalCompleted === 0) return '/joy-smile.png';
  if (isNightTime()) return '/joy-comfort.png';
  return '/joy-default.png';
}

export function Dashboard({ progress, isDailyGoalMet, currentLevel, onStartPreset, onSelectVerse }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const dateSeed = today.split('-').reduce((a, b) => a + parseInt(b), 0);

  const recommendations = getRecommendations({
    allVerses: presetVerses,
    interests: progress.onboarding.interests,
    level: progress.onboarding.level,
    completedVerses: progress.completedVerses,
    dateSeed,
    reviewData: progress.reviewData,
    today,
  });

  const todaysVerse = recommendations.dailyVerse.verse;
  const isReview = recommendations.dailyVerse.reason === 'review';

  const dueReviews = progress.reviewData ? getDueReviews(progress.reviewData, today) : [];
  const remainingReviews = isReview
    ? dueReviews.filter(r => r.verseId !== todaysVerse.id).length
    : dueReviews.length;

  const totalCompleted = Object.values(progress.completedVerses).reduce((a, b) => a + b, 0);

  const joyMessage = getJoyMessage({
    isDailyGoalMet,
    streak: progress.streak,
    remainingReviews,
    todayCompletions: progress.todayCompletions,
    dailyGoal: progress.dailyGoal,
    totalCompleted,
  });

  const filledStars = Math.min(progress.todayCompletions, progress.dailyGoal);

  const joyPose = getJoyPose({
    isDailyGoalMet,
    streak: progress.streak,
    remainingReviews,
    todayCompletions: progress.todayCompletions,
    totalCompleted,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-4 pb-24"
    >
      {/* LAYER 1: Status Bar */}
      <div className="flex items-center gap-3 mb-3 h-10">
        <div className="flex items-center gap-1.5">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm font-black text-orange-500">{progress.streak}일</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={16} className="text-amber-500" fill="currentColor" />
          <span className="text-sm font-black text-amber-500">{progress.xp}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{currentLevel.emoji}</span>
          <span className="text-sm font-black text-violet-500">Lv.{currentLevel.level}</span>
        </div>
      </div>

      {/* LAYER 2: JOY Companion (compact) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex items-center gap-3 mb-5"
      >
        {/* JOY — companion: fixed layout box, image overflows visually */}
        <motion.div
          key={joyPose}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative w-24 h-24 shrink-0"
        >
          <img
            src={joyPose}
            alt="JOY"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 object-contain drop-shadow-md"
          />
        </motion.div>

        <div className="flex-1">
          {/* Speech bubble */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-amber-100 px-3 py-2 relative">
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-8 border-r-white" />
            <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[9px] border-r-amber-100" />
            <p className="text-base font-black text-stone-700">{joyMessage}</p>
          </div>

          {/* Daily Stars — inline */}
          <div className="flex items-center gap-1.5 mt-1.5 ml-1">
            {Array.from({ length: progress.dailyGoal }, (_, i) => {
              const isFilled = i < filledStars;
              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={isFilled ? { scale: [0, 1.3, 1], rotate: [0, 15, 0] } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <Star
                    size={20}
                    className={isFilled ? 'text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]' : 'text-stone-200'}
                    fill={isFilled ? 'currentColor' : 'none'}
                    strokeWidth={isFilled ? 1.5 : 2}
                  />
                </motion.div>
              );
            })}
            <span className="text-[10px] font-bold text-stone-400 ml-1">
              {isDailyGoalMet ? '달성!' : `${progress.dailyGoal - filledStars}개 남음`}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* LAYER 3: Primary CTA — Today's Verse */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        {isReview ? (
          <SectionTitle icon={RotateCcw} iconColor="text-emerald-500">다시 만나는 말씀</SectionTitle>
        ) : (
          <SectionTitle icon={BookOpen} iconColor="text-amber-500">오늘의 말씀</SectionTitle>
        )}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className={`card-featured ${isReview ? 'border-emerald-200 shadow-[0_4px_0_var(--color-emerald-200)]' : 'border-amber-200 shadow-[0_4px_0_var(--color-amber-200)]'} p-5 relative overflow-hidden`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-block ${isReview ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} text-sm font-bold px-3 py-1 rounded-full shadow-sm`}>
              {todaysVerse.reference}
            </span>
            {recommendations.dailyVerse.reason === 'interest' && (
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                관심 성경
              </span>
            )}
          </div>
          <p className="text-base text-stone-700 font-bold leading-relaxed line-clamp-2 mb-3">
            {todaysVerse.verse}
          </p>
          <ActionButton
            variant={isReview ? 'success' : 'primary'}
            size="sm"
            onClick={() => onSelectVerse(todaysVerse)}
          >
            퍼즐로 만나기
          </ActionButton>
        </motion.div>
      </motion.div>

      {/* LAYER 4: Quick Actions — 2-column grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-5"
      >
        {/* 추천 퍼즐 */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onStartPreset}
          className="bg-violet-50 p-5 rounded-2xl border-2 border-violet-200 shadow-sm transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
            <Shuffle size={20} className="text-violet-500" />
          </div>
          <span className="text-base font-black text-violet-600 block mb-1">추천 퍼즐</span>
          <p className="text-xs font-bold text-stone-400 leading-snug">
            난이도에 맞는 새 말씀
          </p>
        </motion.button>

        {/* 복습 or 좋아하는 */}
        {remainingReviews > 0 ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              const reviewAction = recommendations.nextActions.find(a => a.type === 'review');
              if (reviewAction) onSelectVerse(reviewAction.verse);
            }}
            className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-200 shadow-sm transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3 relative">
              <RotateCcw size={20} className="text-emerald-500" />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                {remainingReviews}
              </span>
            </div>
            <span className="text-base font-black text-emerald-600 block mb-1">복습</span>
            <p className="text-xs font-bold text-stone-400 leading-snug">
              다시 만날 말씀
            </p>
          </motion.button>
        ) : progress.favoriteVerses.length > 0 ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectVerse(progress.favoriteVerses[0])}
            className="bg-rose-50 p-5 rounded-2xl border-2 border-rose-200 shadow-sm transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mb-3">
              <Heart size={20} className="text-rose-400" />
            </div>
            <span className="text-base font-black text-rose-500 block mb-1">좋아하는</span>
            <p className="text-xs font-bold text-stone-400 leading-snug">
              저장한 말씀 풀기
            </p>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onStartPreset}
            className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-200 shadow-sm transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
              <Star size={20} className="text-amber-400" />
            </div>
            <span className="text-base font-black text-amber-500 block mb-1">도전</span>
            <p className="text-xs font-bold text-stone-400 leading-snug">
              더 많은 말씀 풀기
            </p>
          </motion.button>
        )}
      </motion.div>

      {/* Recent Verses */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <SectionTitle icon={Clock} iconColor="text-emerald-500">최근 말씀</SectionTitle>
        {progress.recentVerses.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {progress.recentVerses.slice(0, 5).map((verse) => (
              <motion.button
                key={`recent-${verse.id}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectVerse(verse)}
                className="shrink-0 w-44 card p-4 shadow-[0_4px_0_var(--color-emerald-100)] text-left hover:bg-white transition-colors"
              >
                <span className="text-xs font-bold text-emerald-600 mb-1 block">
                  {verse.reference}
                </span>
                <p className="text-sm text-stone-700 line-clamp-2 font-bold leading-snug">
                  {verse.verse}
                </p>
                {progress.completedVerses[verse.id] > 0 && (
                  <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {progress.completedVerses[verse.id]}회
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 rounded-2xl p-6 text-center">
            <div className="w-15 h-15 mx-auto mb-3">
              <img src="/joy-support.png" alt="JOY" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm font-bold text-stone-600 mb-1">아직 만난 말씀이 없어요</p>
            <p className="text-xs font-bold text-stone-400">퍼즐을 풀면 여기에 모여요</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
