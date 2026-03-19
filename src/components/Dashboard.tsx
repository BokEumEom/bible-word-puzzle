import { motion } from 'motion/react';
import { BookOpen, Search, Flame, ChevronRight, Heart, Play, Clock, User } from 'lucide-react';
import { LevelInfo } from '../data/levels';
import { Verse } from '../types';
import { UserProgress } from '../hooks/useUserProgress';
import { verses as presetVerses } from '../data/verses';
import { getRecommendations } from '../utils/recommend';
import { NextActionCards } from './NextActionCards';

interface Props {
  progress: UserProgress;
  isDailyGoalMet: boolean;
  level: LevelInfo;
  onStartExplore: () => void;
  onStartPreset: () => void;
  onSelectVerse: (verse: Verse) => void;
  onOpenProfile: () => void;
}

export function Dashboard({ progress, isDailyGoalMet, level, onStartExplore, onStartPreset, onSelectVerse, onOpenProfile }: Props) {
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
  const goalProgress = Math.min(progress.todayCompletions / progress.dailyGoal, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-6 pb-20"
    >
      {/* Mini Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-lg">{level.emoji}</span>
          <span className="text-sm font-black text-violet-600">Lv.{level.level}</span>
          <div className="flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full">
            <Flame size={14} className="text-orange-500" />
            <span className="text-sm font-black text-orange-500">{progress.streak}</span>
          </div>
        </div>
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

      {/* Daily Goal Inline */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2.5 bg-violet-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalProgress * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${isDailyGoalMet ? 'bg-violet-500' : 'bg-violet-400'}`}
          />
        </div>
        <span className="text-sm font-black text-violet-500 whitespace-nowrap">
          {isDailyGoalMet ? '목표 달성!' : `${progress.todayCompletions}/${progress.dailyGoal}`}
        </span>
      </div>

      {/* Today's Verse — Main CTA */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-stone-800 mb-3 flex items-center gap-2">
          <BookOpen className="text-amber-500" size={24} />
          오늘의 말씀
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectVerse(todaysVerse)}
          className="w-full bg-white/90 backdrop-blur-sm p-5 rounded-[2rem] shadow-md border-b-4 border-amber-200 text-left hover:bg-white transition-colors relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-5 text-amber-500">
            <BookOpen size={100} />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full shadow-sm">
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
          <div className="mt-4 flex items-center text-amber-600 font-black text-sm">
            학습하기 <ChevronRight size={16} />
          </div>
        </motion.button>
      </div>

      {/* Next Actions */}
      {recommendations.nextActions.length > 0 && (
        <NextActionCards
          actions={recommendations.nextActions}
          onSelectVerse={onSelectVerse}
        />
      )}

      {/* CTA Buttons — 2 column, DifficultySelector style */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartPreset}
          className="flex flex-col items-center p-5 rounded-[2rem] border-b-8 border-orange-300 bg-orange-100 hover:bg-orange-200 shadow-sm transition-colors"
        >
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm rotate-3 mb-3">
            <Play className="text-orange-500" fill="currentColor" size={28} />
          </div>
          <h3 className="text-lg font-black text-stone-800">추천 퍼즐</h3>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartExplore}
          className="flex flex-col items-center p-5 rounded-[2rem] border-b-8 border-violet-300 bg-violet-100 hover:bg-violet-200 shadow-sm transition-colors"
        >
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm -rotate-3 mb-3">
            <Search className="text-violet-500" size={28} />
          </div>
          <h3 className="text-lg font-black text-stone-800">성경 찾기</h3>
        </motion.button>
      </div>

      {/* Recent Verses — Horizontal Scroll */}
      {progress.recentVerses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-black text-stone-800 mb-3 flex items-center gap-2">
            <Clock className="text-emerald-500" size={20} />
            최근 말씀
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {progress.recentVerses.slice(0, 5).map((verse) => (
              <motion.button
                key={`recent-${verse.id}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectVerse(verse)}
                className="shrink-0 w-44 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border-b-4 border-emerald-100 text-left hover:bg-white transition-colors"
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
          <h2 className="text-lg font-black text-stone-800 mb-3 flex items-center gap-2">
            <Heart className="text-rose-400" size={20} />
            좋아하는 말씀
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {progress.favoriteVerses.map((verse) => (
              <motion.button
                key={`fav-${verse.id}`}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectVerse(verse)}
                className="shrink-0 w-44 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border-b-4 border-rose-100 text-left hover:bg-white transition-colors"
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
