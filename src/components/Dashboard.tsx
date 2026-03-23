import { motion } from 'motion/react';
import { BookOpen, Search, Flame, ChevronRight, Heart, Sparkles, Clock, User, RotateCcw, Library } from 'lucide-react';
import { Verse } from '../types';
import { UserProgress } from '../hooks/useUserProgress';
import { verses as presetVerses } from '../data/verses';
import { getRecommendations } from '../utils/recommend';
import { getDueReviews } from '../utils/spaced';
import { InstallPrompt } from './InstallPrompt';
import { SectionTitle } from './ui/SectionTitle';

interface Props {
  progress: UserProgress;
  isDailyGoalMet: boolean;
  onStartExplore: () => void;
  onStartPreset: () => void;
  onSelectVerse: (verse: Verse) => void;
  onOpenProfile: () => void;
  onOpenCollections: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '고요한 밤이에요';
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

function getGreetingEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '🌙';
  if (hour < 12) return '☀️';
  if (hour < 18) return '🌤️';
  return '🌙';
}

export function Dashboard({ progress, isDailyGoalMet, onStartExplore, onStartPreset, onSelectVerse, onOpenProfile, onOpenCollections }: Props) {
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
  const goalProgress = Math.min(progress.todayCompletions / progress.dailyGoal, 1);

  const dueReviews = progress.reviewData ? getDueReviews(progress.reviewData, today) : [];
  const remainingReviews = isReview
    ? dueReviews.filter(r => r.verseId !== todaysVerse.id).length
    : dueReviews.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-6 pb-20"
    >
      {/* Header: Greeting + Profile */}
      <div className="flex items-center justify-between mb-2">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-black text-stone-800"
        >
          {getGreeting()} {getGreetingEmoji()}
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenProfile}
          className="p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border-2 border-violet-100 hover:bg-violet-50 transition-colors"
          aria-label="프로필"
        >
          <User size={20} className="text-violet-500" />
        </motion.button>
      </div>

      {/* Streak + Daily Goal — single compact row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          <Flame size={16} className="text-orange-500" />
          <span className="text-sm font-black text-orange-500">{progress.streak}일</span>
        </div>
        <div className="flex-1 h-2.5 bg-violet-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${goalProgress * 100}%`,
              boxShadow: isDailyGoalMet
                ? ['0 0 0 0 rgba(139,92,246,0)', '0 0 8px 2px rgba(139,92,246,0.4)', '0 0 0 0 rgba(139,92,246,0)']
                : '0 0 0 0 rgba(139,92,246,0)',
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${isDailyGoalMet ? 'bg-violet-500' : 'bg-violet-400'}`}
          />
        </div>
        <span className="text-sm font-black text-violet-500 whitespace-nowrap">
          {isDailyGoalMet ? '목표 달성!' : `${progress.todayCompletions}/${progress.dailyGoal}`}
        </span>
      </div>

      {/* Install Prompt */}
      <InstallPrompt />

      {/* Today's Verse — original card style with "퍼즐로 만나기" CTA */}
      <div className="mb-6">
        {isReview ? (
          <SectionTitle icon={RotateCcw} iconColor="text-emerald-500">다시 만나는 말씀</SectionTitle>
        ) : (
          <SectionTitle icon={BookOpen} iconColor="text-amber-500">오늘의 말씀</SectionTitle>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectVerse(todaysVerse)}
          className={`w-full card-featured ${isReview ? 'border-emerald-200' : 'border-amber-200'} text-left p-5 hover:bg-white transition-colors relative overflow-hidden`}
        >
          <div className={`absolute -right-4 -top-4 opacity-5 ${isReview ? 'text-emerald-500' : 'text-amber-500'}`}>
            {isReview ? <RotateCcw size={100} /> : <BookOpen size={100} />}
          </div>
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
          <p className="text-base text-stone-700 font-bold leading-relaxed line-clamp-2">
            {todaysVerse.verse}
          </p>
          <div className={`mt-4 flex items-center ${isReview ? 'text-emerald-600' : 'text-amber-600'} font-black text-sm`}>
            퍼즐로 만나기 <ChevronRight size={16} />
          </div>
        </motion.button>
      </div>

      {/* Review reminder */}
      {remainingReviews > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const reviewAction = recommendations.nextActions.find(a => a.type === 'review');
            if (reviewAction) onSelectVerse(reviewAction.verse);
          }}
          className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-emerald-50/80 rounded-xl w-full text-left"
        >
          <RotateCcw size={15} className="text-emerald-500 shrink-0" />
          <span className="text-sm font-medium text-emerald-600">
            다시 만날 말씀 {remainingReviews}개
          </span>
          <ChevronRight size={14} className="text-emerald-400 ml-auto shrink-0" />
        </motion.button>
      )}

      {/* 더 만나보기 — 3-column card grid (profile stats style) */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartPreset}
          className="card p-4 border-b-4 border-orange-100 text-center"
        >
          <Sparkles className="text-orange-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-orange-500">퍼즐</p>
          <p className="text-xs font-bold text-stone-400">추천 퍼즐</p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartExplore}
          className="card p-4 border-b-4 border-violet-100 text-center"
        >
          <Search className="text-violet-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-violet-500">성경</p>
          <p className="text-xs font-bold text-stone-400">66권 찾기</p>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenCollections}
          className="card p-4 border-b-4 border-emerald-100 text-center"
        >
          <Library className="text-emerald-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-emerald-500">테마</p>
          <p className="text-xs font-bold text-stone-400">8개 모음</p>
        </motion.button>
      </div>

      {/* Recent Verses — Horizontal Scroll */}
      {progress.recentVerses.length > 0 && (
        <div className="mb-6">
          <SectionTitle icon={Clock} iconColor="text-emerald-500">최근 말씀</SectionTitle>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {progress.recentVerses.slice(0, 5).map((verse) => (
              <motion.button
                key={`recent-${verse.id}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectVerse(verse)}
                className="shrink-0 w-44 card p-4 border-b-4 border-emerald-100 text-left hover:bg-white transition-colors"
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
        </div>
      )}

      {/* Favorite Verses — Horizontal Scroll */}
      {progress.favoriteVerses.length > 0 && (
        <div className="mb-6">
          <SectionTitle icon={Heart} iconColor="text-rose-400">좋아하는 말씀</SectionTitle>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {progress.favoriteVerses.map((verse) => (
              <motion.button
                key={`fav-${verse.id}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectVerse(verse)}
                className="shrink-0 w-44 card p-4 border-b-4 border-rose-100 text-left hover:bg-white transition-colors"
              >
                <span className="text-xs font-bold text-rose-500 mb-1 block">
                  {verse.reference}
                </span>
                <p className="text-sm text-stone-700 line-clamp-2 font-bold leading-snug">
                  {verse.verse}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
