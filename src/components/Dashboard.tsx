import { motion } from 'motion/react';
import { BookOpen, Search, Flame, Clock, CheckCircle2, ChevronRight, Heart, Play, Settings } from 'lucide-react';
import { LevelInfo } from '../data/levels';
import { Verse } from '../types';
import { UserProgress } from '../hooks/useUserProgress';
import { verses as presetVerses } from '../data/verses';
import { getRecommendations } from '../utils/recommend';
import { DailyGoalBadge } from './DailyGoalBadge';
import { LevelBadge } from './LevelBadge';
import { AchievementGrid } from './AchievementGrid';
import { NextActionCards } from './NextActionCards';

interface Props {
  progress: UserProgress;
  isDailyGoalMet: boolean;
  level: LevelInfo;
  onStartExplore: () => void;
  onStartPreset: () => void;
  onSelectVerse: (verse: Verse) => void;
  onResetOnboarding?: () => void;
}

export function Dashboard({ progress, isDailyGoalMet, level, onStartExplore, onStartPreset, onSelectVerse, onResetOnboarding }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const dateSeed = today.split('-').reduce((a, b) => a + parseInt(b), 0);

  const recommendations = getRecommendations({
    allVerses: presetVerses,
    interests: progress.onboarding.interests,
    level: progress.onboarding.level,
    completedVerses: progress.completedVerses,
    dateSeed,
  });

  const todaysVerse = recommendations.dailyVerse.verse;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-6 pb-20"
    >
      {/* Profile reset */}
      {onResetOnboarding && (
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onResetOnboarding}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-orange-100 hover:bg-orange-50 transition-colors"
            aria-label="프로필 재설정"
          >
            <Settings size={22} className="text-stone-400" />
          </motion.button>
        </div>
      )}

      {/* Header with Streak */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: -2 }}
          className="flex-1 flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-[2rem] shadow-sm border-b-4 border-orange-100"
        >
          <div className="bg-orange-100 p-2.5 rounded-2xl">
            <Flame className="text-orange-500" size={28} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold">연속 학습</p>
            <p className="text-2xl font-black text-orange-500">{progress.streak}일째</p>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="flex-1 flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-[2rem] shadow-sm border-b-4 border-emerald-100"
        >
          <div className="bg-emerald-100 p-2.5 rounded-2xl">
            <CheckCircle2 className="text-emerald-500" size={28} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold">완료한 말씀</p>
            <p className="text-2xl font-black text-emerald-500">{Object.keys(progress.completedVerses).length}개</p>
          </div>
        </motion.div>
      </div>

      {/* Level Badge */}
      <div className="mb-6">
        <LevelBadge level={level} xp={progress.xp} />
      </div>

      {/* Achievements */}
      <AchievementGrid unlockedIds={progress.unlockedAchievements} />

      {/* Daily Goal */}
      <div className="mb-8">
        <DailyGoalBadge
          todayCompletions={progress.todayCompletions}
          dailyGoal={progress.dailyGoal}
          isMet={isDailyGoalMet}
        />
      </div>

      {/* Next Actions */}
      {recommendations.nextActions.length > 0 && (
        <NextActionCards
          actions={recommendations.nextActions}
          onSelectVerse={onSelectVerse}
        />
      )}

      {/* Today's Verse */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-stone-800 mb-4 flex items-center gap-2">
          <BookOpen className="text-amber-500" size={28} />
          오늘의 말씀 🎁
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectVerse(todaysVerse)}
          className="w-full bg-white/90 backdrop-blur-sm p-6 rounded-[2rem] shadow-md border-b-4 border-amber-200 text-left hover:bg-white transition-colors relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-5 text-amber-500">
            <BookOpen size={120} />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block bg-amber-100 text-amber-800 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
              {todaysVerse.reference}
            </span>
            {recommendations.dailyVerse.reason === 'interest' && (
              <span className="inline-block bg-violet-100 text-violet-700 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                관심 성경
              </span>
            )}
          </div>
          <p className="text-lg text-stone-700 font-bold leading-relaxed line-clamp-2">
            {todaysVerse.verse}
          </p>
          <div className="mt-5 flex items-center text-amber-600 font-black text-sm">
            학습하기 <ChevronRight size={18} />
          </div>
        </motion.button>
      </div>

      {/* Explore & Preset Buttons */}
      <div className="flex flex-col gap-4 mb-10">
        <motion.button
          onClick={onStartPreset}
          className="btn-primary w-full p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl shadow-sm rotate-3">
              <Play className="text-white" fill="currentColor" size={32} />
            </div>
            <span className="text-2xl">추천 말씀 퍼즐 🧩</span>
          </div>
          <ChevronRight className="text-white opacity-80" size={32} />
        </motion.button>

        <motion.button
          onClick={onStartExplore}
          className="btn-secondary w-full p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-2xl shadow-sm -rotate-3">
              <Search className="text-orange-500" size={32} />
            </div>
            <span className="text-2xl">성경 찾기 📖</span>
          </div>
          <ChevronRight className="text-orange-300" size={32} />
        </motion.button>
      </div>

      {/* Recent & Review */}
      {progress.recentVerses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-black text-stone-800 mb-4 flex items-center gap-2">
            <Clock className="text-emerald-500" size={28} />
            최근에 배운 말씀이에요! 🏃‍♂️
          </h2>
          <div className="flex flex-col gap-3">
            {progress.recentVerses.slice(0, 3).map((verse) => (
              <motion.button
                key={`recent-${verse.id}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectVerse(verse)}
                className="bg-white/80 backdrop-blur-sm p-5 rounded-[2rem] shadow-sm border-b-4 border-emerald-100 text-left hover:bg-white transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-bold text-emerald-600 mb-1 block">
                    {verse.reference}
                  </span>
                  <p className="text-stone-700 line-clamp-1 text-base font-bold">
                    {verse.verse}
                  </p>
                </div>
                {progress.completedVerses[verse.id] > 0 && (
                  <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ml-3 shadow-sm">
                    {progress.completedVerses[verse.id]}회 완료
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {progress.favoriteVerses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-black text-stone-800 mb-4 flex items-center gap-2">
            <Heart className="text-rose-400" size={28} />
            내가 좋아하는 말씀 💖
          </h2>
          <div className="flex flex-col gap-3">
            {progress.favoriteVerses.map((verse) => (
              <motion.button
                key={`fav-${verse.id}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectVerse(verse)}
                className="bg-white/80 backdrop-blur-sm p-5 rounded-[2rem] shadow-sm border-b-4 border-rose-100 text-left hover:bg-white transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-bold text-rose-500 mb-1 block">
                    {verse.reference}
                  </span>
                  <p className="text-stone-700 line-clamp-1 text-base font-bold">
                    {verse.verse}
                  </p>
                </div>
                <div className="bg-rose-50 p-2.5 rounded-full shadow-sm ml-3 shrink-0">
                  <Heart className="text-rose-400 fill-rose-400" size={20} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
