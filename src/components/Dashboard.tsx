import { motion } from 'motion/react';
import { BookOpen, Flame, ChevronRight, Heart, Star, Clock, RotateCcw, Library } from 'lucide-react';
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
  readonly onOpenCollections: () => void;
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
  if (todayCompletions > 0) return '/joy-support.png';
  if (totalCompleted === 0) return '/joy-default.png';
  return '/joy-default.png';
}

export function Dashboard({ progress, isDailyGoalMet, currentLevel, onStartPreset, onSelectVerse, onOpenCollections }: Props) {
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

  // Quick pills
  const pills: { key: string; icon: typeof RotateCcw; label: string; badge?: number; action: () => void }[] = [];

  if (remainingReviews > 0) {
    const reviewAction = recommendations.nextActions.find(a => a.type === 'review');
    pills.push({
      key: 'review',
      icon: RotateCcw,
      label: '복습',
      badge: remainingReviews,
      action: () => { if (reviewAction) onSelectVerse(reviewAction.verse); },
    });
  }

  pills.push({
    key: 'collections',
    icon: Library,
    label: '테마 모음',
    action: onOpenCollections,
  });

  if (progress.favoriteVerses.length > 0) {
    pills.push({
      key: 'favorites',
      icon: Heart,
      label: '좋아하는',
      action: () => onSelectVerse(progress.favoriteVerses[0]),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-4 pb-24"
    >
      {/* LAYER 1: Status Bar */}
      <div className="flex items-center gap-3 mb-4 h-12">
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
          <span className="text-sm font-black text-violet-500">Lv.{currentLevel.level} {currentLevel.name}</span>
        </div>
      </div>

      {/* LAYER 2: JOY Hero Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-col items-center mb-6"
      >
        {/* JOY mascot */}
        <div className="relative w-30 h-30 mb-3">
          <div className="absolute inset-0 rounded-full bg-amber-50" />
          <img
            src={joyPose}
            alt="JOY"
            className="relative w-full h-full object-contain drop-shadow-md"
          />
        </div>

        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-white rounded-2xl shadow-sm border-2 border-amber-100 px-4 py-2.5 mb-4"
        >
          {/* Triangle tail */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white" />
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[9px] border-b-amber-100" />
          <p className="text-sm font-black text-stone-700 text-center">{joyMessage}</p>
        </motion.div>

        {/* Daily Stars */}
        <div className="flex items-center gap-2 mb-1">
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
                  size={28}
                  className={isFilled ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : 'text-stone-200'}
                  fill={isFilled ? 'currentColor' : 'none'}
                  strokeWidth={isFilled ? 1.5 : 2}
                />
              </motion.div>
            );
          })}
        </div>
        <span className="text-xs font-bold text-stone-400">
          {isDailyGoalMet ? '목표 달성!' : `목표까지 ${progress.dailyGoal - filledStars}개 남았어!`}
        </span>
      </motion.div>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* LAYER 3: Primary CTA — Today's Verse Card */}
      <div className="mb-5">
        {isReview ? (
          <SectionTitle icon={RotateCcw} iconColor="text-emerald-500">다시 만나는 말씀</SectionTitle>
        ) : (
          <SectionTitle icon={BookOpen} iconColor="text-amber-500">오늘의 말씀</SectionTitle>
        )}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className={`card-featured ${isReview ? 'border-emerald-200' : 'border-amber-200'} p-5 relative overflow-hidden`}
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
      </div>

      {/* Quick Access Pills */}
      {pills.length > 0 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {pills.map((pill) => {
            const PillIcon = pill.icon;
            return (
              <motion.button
                key={pill.key}
                whileTap={{ scale: 0.95 }}
                onClick={pill.action}
                className="shrink-0 flex items-center gap-1.5 bg-white rounded-full px-4 py-2.5 border-2 border-stone-100 shadow-[0_3px_0_var(--color-stone-200)] active:shadow-none active:translate-y-0.5 transition-all"
              >
                <PillIcon size={16} className="text-stone-500" />
                <span className="text-sm font-black text-stone-700">{pill.label}</span>
                {pill.badge !== undefined && (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                    {pill.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Recent Verses — Horizontal Scroll + Empty State */}
      <div className="mb-6">
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
      </div>

      {/* 추천 퍼즐 — secondary CTA */}
      <div className="mb-6">
        <ActionButton
          variant="secondary"
          size="sm"
          onClick={onStartPreset}
          delay={0.1}
        >
          추천 퍼즐 풀기 <ChevronRight size={18} />
        </ActionButton>
      </div>
    </motion.div>
  );
}
