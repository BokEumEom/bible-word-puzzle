import { motion } from 'motion/react';
import { ChevronLeft, Flame, CheckCircle2, Target, Trophy, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { LevelInfo, getXpProgress } from '../data/levels';
import { UserProgress } from '../hooks/useUserProgress';
import { achievements, AchievementCategory } from '../data/achievements';
import { getDueReviews } from '../utils/spaced';
import { useSound } from '../hooks/useSound';

interface Props {
  progress: UserProgress;
  level: LevelInfo;
  onBack: () => void;
  onResetOnboarding?: () => void;
}

const categoryBorderColors: Record<AchievementCategory, string> = {
  '학습': 'border-emerald-200',
  '연속': 'border-orange-200',
  '도전': 'border-amber-200',
  '헌신': 'border-violet-200',
  '수집': 'border-rose-200',
};

function getStrengthDistribution(reviewData: UserProgress['reviewData']): { label: string; count: number; color: string }[] {
  const entries = Object.values(reviewData);
  const mastered = entries.filter(d => d.strength >= 5).length;
  const learning = entries.filter(d => d.strength >= 2 && d.strength < 5).length;
  const fresh = entries.filter(d => d.strength < 2).length;
  return [
    { label: '마스터', count: mastered, color: 'bg-violet-400' },
    { label: '학습중', count: learning, color: 'bg-amber-400' },
    { label: '새것', count: fresh, color: 'bg-stone-300' },
  ];
}

export function ProfileScreen({ progress, level, onBack, onResetOnboarding }: Props) {
  const { isMuted, toggleMute, play } = useSound();
  const { current, next, progress: xpProgress } = getXpProgress(progress.xp);
  const isMaxLevel = xpProgress === 1 && current === next;
  const unlockedCount = progress.unlockedAchievements.length;
  const totalCount = achievements.length;

  const today = new Date().toISOString().split('T')[0];
  const dueCount = getDueReviews(progress.reviewData, today).length;
  const strengthDist = getStrengthDistribution(progress.reviewData);
  const totalReviewEntries = Object.keys(progress.reviewData).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-6 pb-20"
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white border-2 border-orange-100 transition-colors"
        >
          <ChevronLeft size={24} className="text-orange-500" />
        </button>
        <h1 className="text-2xl font-black text-stone-800 ml-4">프로필</h1>
      </div>

      {/* Level Badge — Large */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/90 backdrop-blur-sm p-6 rounded-[2rem] shadow-sm border-b-4 border-violet-100 mb-6 text-center"
      >
        <div className="text-5xl mb-2">{level.emoji}</div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-sm font-black text-violet-600">Lv.{level.level}</span>
          <span className="text-xl font-black text-stone-800">{level.name}</span>
        </div>
        <div className="w-full h-3.5 bg-violet-100 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(xpProgress * 100, 100)}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full"
          />
        </div>
        <span className="text-sm font-bold text-stone-400">
          {isMaxLevel ? `${progress.xp} XP (MAX)` : `${current} / ${next} XP`}
        </span>
      </motion.div>

      {/* Stats Grid — 3 columns */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border-b-4 border-orange-100 text-center"
        >
          <Flame className="text-orange-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-orange-500">{progress.streak}일</p>
          <p className="text-xs font-bold text-stone-400">연속 학습</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border-b-4 border-emerald-100 text-center"
        >
          <CheckCircle2 className="text-emerald-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-emerald-500">{Object.keys(progress.completedVerses).length}개</p>
          <p className="text-xs font-bold text-stone-400">완료 말씀</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-sm border-b-4 border-violet-100 text-center"
        >
          <Target className="text-violet-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-violet-500">{progress.dailyGoalMetCount}일</p>
          <p className="text-xs font-bold text-stone-400">목표 달성</p>
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h2 className="text-xl font-black text-stone-800 mb-4 flex items-center gap-2">
          <Trophy className="text-amber-500" size={24} />
          나의 업적
          <span className="text-sm font-bold text-stone-400 ml-auto">{unlockedCount}/{totalCount}</span>
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement, index) => {
            const isUnlocked = progress.unlockedAchievements.includes(achievement.id);
            const borderColor = isUnlocked ? categoryBorderColors[achievement.category] : 'border-stone-100';

            return (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.02, type: 'spring', stiffness: 200, damping: 15 }}
                className={`bg-white/90 backdrop-blur-sm p-3 rounded-[1.5rem] shadow-sm border-b-4 ${borderColor} text-center ${!isUnlocked ? 'opacity-30 grayscale' : ''}`}
              >
                <div className="text-2xl mb-1">
                  {isUnlocked ? achievement.emoji : '🔒'}
                </div>
                <p className="text-[10px] font-bold text-stone-600 leading-tight truncate">
                  {isUnlocked ? achievement.name : '???'}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Review Status */}
      {totalReviewEntries > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm p-5 rounded-[2rem] shadow-sm border-b-4 border-rose-100 mb-6"
        >
          <h2 className="text-lg font-black text-stone-800 mb-3 flex items-center gap-2">
            <RotateCcw className="text-rose-400" size={22} />
            복습 현황
            {dueCount > 0 && (
              <span className="text-xs font-black text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full ml-auto">
                {dueCount}개 대기
              </span>
            )}
          </h2>
          {/* Strength distribution bar */}
          <div className="flex h-4 rounded-full overflow-hidden mb-3">
            {strengthDist.map(({ label, count, color }) => {
              if (count === 0) return null;
              const pct = (count / totalReviewEntries) * 100;
              return (
                <div
                  key={label}
                  className={`${color} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs font-bold text-stone-500">
            {strengthDist.map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span>{label} {count}개</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white/90 backdrop-blur-sm p-5 rounded-[2rem] shadow-sm border-b-4 border-stone-100"
      >
        <h2 className="text-lg font-black text-stone-800 mb-4 flex items-center gap-2">
          <Settings className="text-stone-400" size={22} />
          설정
        </h2>

        {/* Sound toggle */}
        <button
          onClick={() => {
            toggleMute();
            if (isMuted) play('button-tap');
          }}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {isMuted ? (
              <VolumeX size={20} className="text-stone-400" />
            ) : (
              <Volume2 size={20} className="text-violet-500" />
            )}
            <span className="text-stone-600 font-bold text-sm">사운드</span>
          </div>
          <motion.div
            className={`w-12 h-7 rounded-full p-1 ${isMuted ? 'bg-stone-200' : 'bg-violet-400'}`}
          >
            <motion.div
              animate={{ x: isMuted ? 0 : 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-5 h-5 bg-white rounded-full shadow-sm"
            />
          </motion.div>
        </button>

        {onResetOnboarding && (
          <button
            onClick={onResetOnboarding}
            className="w-full text-left p-3 rounded-xl hover:bg-stone-50 transition-colors text-stone-600 font-bold text-sm"
          >
            프로필 재설정
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
