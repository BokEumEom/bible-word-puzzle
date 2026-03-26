import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Flame, Heart, Star, Clock, RotateCcw, Shuffle } from 'lucide-react';
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

      {/* LAYER 2: Status message + daily stars */}
      <motion.div
        data-testid="dashboard-companion-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-5 rounded-3xl border border-stone-100 bg-white p-4 shadow-sm"
      >
        <p className="text-sm font-black text-stone-800 mb-1">{joyMessage}</p>
        <div className="flex items-center gap-1.5 mt-2">
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
                  size={18}
                  className={isFilled ? 'text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.45)]' : 'text-stone-200'}
                  fill={isFilled ? 'currentColor' : 'none'}
                  strokeWidth={isFilled ? 1.5 : 2}
                />
              </motion.div>
            );
          })}
          <span className="ml-1 text-[10px] font-bold text-stone-400">
            {isDailyGoalMet ? '달성!' : `${progress.dailyGoal - filledStars}개 남음`}
          </span>
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
          data-testid="dashboard-featured-card"
          whileTap={{ scale: 0.98 }}
          className="relative overflow-hidden rounded-3xl border border-stone-100 bg-white p-5 shadow-sm"
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
        className="flex flex-col gap-3 mb-5"
      >
        {/* 추천 퍼즐 */}
        <motion.button
          data-testid="dashboard-quick-action-primary"
          whileTap={{ scale: 0.96 }}
          onClick={onStartPreset}
          className="flex items-start gap-3 rounded-3xl border border-stone-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50 active:bg-stone-100"
        >
          <div
            data-testid="dashboard-quick-action-primary-icon"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100"
          >
            <Shuffle size={20} className="text-violet-500" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="mb-1 block text-base font-black text-stone-800">추천 퍼즐</span>
            <p className="text-xs font-bold leading-snug text-stone-400">
              난이도에 맞는 새 말씀
            </p>
          </div>
          <ChevronRight size={18} className="mt-1 shrink-0 text-stone-300" />
        </motion.button>

        {/* 복습 or 좋아하는 */}
        {remainingReviews > 0 ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              const reviewAction = recommendations.nextActions.find(a => a.type === 'review');
              if (reviewAction) onSelectVerse(reviewAction.verse);
            }}
            className="flex items-start gap-3 rounded-3xl border border-stone-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50 active:bg-stone-100"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <RotateCcw size={20} className="text-emerald-500" />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-black rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                {remainingReviews}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="mb-1 block text-base font-black text-stone-800">복습</span>
              <p className="text-xs font-bold leading-snug text-stone-400">
                다시 만날 말씀
              </p>
            </div>
            <ChevronRight size={18} className="mt-1 shrink-0 text-stone-300" />
          </motion.button>
        ) : progress.favoriteVerses.length > 0 ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectVerse(progress.favoriteVerses[0])}
            className="flex items-start gap-3 rounded-3xl border border-stone-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50 active:bg-stone-100"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100">
              <Heart size={20} className="text-rose-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="mb-1 block text-base font-black text-stone-800">좋아하는</span>
              <p className="text-xs font-bold leading-snug text-stone-400">
                저장한 말씀 풀기
              </p>
            </div>
            <ChevronRight size={18} className="mt-1 shrink-0 text-stone-300" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onStartPreset}
            className="flex items-start gap-3 rounded-3xl border border-stone-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50 active:bg-stone-100"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <Star size={20} className="text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="mb-1 block text-base font-black text-stone-800">도전</span>
              <p className="text-xs font-bold leading-snug text-stone-400">
                더 많은 말씀 풀기
              </p>
            </div>
            <ChevronRight size={18} className="mt-1 shrink-0 text-stone-300" />
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
                className="shrink-0 w-44 rounded-3xl border border-stone-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50"
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
          <div
            data-testid="dashboard-recent-empty"
            className="rounded-3xl border border-stone-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <Clock size={20} className="text-amber-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-sm font-black text-stone-800">아직 만난 말씀이 없어요</p>
                <p className="text-xs font-bold text-stone-400">퍼즐을 풀면 여기에 모여요</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
