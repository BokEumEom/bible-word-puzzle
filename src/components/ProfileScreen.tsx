import { motion } from 'motion/react';
import { Flame, CheckCircle2, Target, Trophy, RotateCcw, Settings, User, Volume2, VolumeX } from 'lucide-react';
import { SectionTitle } from './ui/SectionTitle';
import { LevelInfo, getXpProgress } from '../data/levels';
import { UserProgress } from '../hooks/useUserProgress';
import { achievements, AchievementCategory } from '../data/achievements';
import { getDueReviews } from '../utils/spaced';
import { useSound } from '../hooks/useSound';

interface Props {
  progress: UserProgress;
  level: LevelInfo;
  onResetOnboarding?: () => void;
}

const categoryShadowColors: Record<AchievementCategory, string> = {
  '학습': 'shadow-sm',
  '연속': 'shadow-sm',
  '도전': 'shadow-sm',
  '헌신': 'shadow-sm',
  '수집': 'shadow-sm',
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

export function ProfileScreen({ progress, level, onResetOnboarding }: Props) {
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
      className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-4 pb-24"
    >
      <div className="flex items-center gap-2 mb-5 h-10">
        <User size={22} className="text-orange-500" />
        <h1 className="text-xl font-black text-stone-800">프로필</h1>
      </div>

      {/* Hero — JOY + Level */}
      <motion.div
        data-testid="profile-hero-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 rounded-3xl border border-stone-100 bg-white p-6 text-center shadow-sm"
      >
        <div className="relative w-28 h-28 mx-auto mb-2">
          <img src="/joy-proud.png" alt="JOY" className="absolute -top-4 -left-4 w-36 h-36 object-contain drop-shadow-md" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-sm font-black text-violet-600">Lv.{level.level}</span>
          <span className="text-xl font-black text-stone-800">{level.name} {level.emoji}</span>
        </div>
        <div className="w-full h-3.5 bg-violet-100 rounded-full overflow-hidden mb-2 mt-3">
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
          data-testid="profile-stat-streak"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm"
        >
          <Flame className="text-orange-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-orange-500">{progress.streak}일</p>
          <p className="text-xs font-bold text-stone-400">연속 학습</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm"
        >
          <CheckCircle2 className="text-emerald-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-emerald-500">{Object.keys(progress.completedVerses).length}개</p>
          <p className="text-xs font-bold text-stone-400">완료 말씀</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-stone-100 bg-white p-4 text-center shadow-sm"
        >
          <Target className="text-violet-500 mx-auto mb-1" size={24} />
          <p className="text-xl font-black text-violet-500">{progress.dailyGoalMetCount}일</p>
          <p className="text-xs font-bold text-stone-400">목표 달성</p>
        </motion.div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <SectionTitle icon={Trophy} iconColor="text-amber-500">나의 업적</SectionTitle>
          <span className="text-sm font-bold text-stone-400">{unlockedCount}/{totalCount}</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement, index) => {
            const isUnlocked = progress.unlockedAchievements.includes(achievement.id);
            const shadowColor = isUnlocked ? categoryShadowColors[achievement.category] : 'shadow-sm';

            return (
              <motion.div
                key={achievement.id}
                data-testid={`profile-achievement-${achievement.id}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.02, type: 'spring', stiffness: 200, damping: 15 }}
                className={`aspect-square rounded-3xl border border-stone-100 bg-white ${shadowColor} flex flex-col items-center justify-center p-2 ${!isUnlocked ? 'opacity-30 grayscale' : ''}`}
              >
                <div className="text-2xl mb-1">
                  {isUnlocked ? achievement.emoji : '🔒'}
                </div>
                <p className="text-[10px] font-bold text-stone-600 leading-tight truncate w-full text-center">
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
          data-testid="profile-review-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 rounded-3xl border border-stone-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <SectionTitle icon={RotateCcw} iconColor="text-rose-400">복습 현황</SectionTitle>
            {dueCount > 0 && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-black text-rose-500">
                {dueCount}개 대기
              </span>
            )}
          </div>

          <div
            data-testid="profile-review-breakdown"
            className="rounded-2xl bg-stone-50 p-4"
          >
            <div className="flex h-4 overflow-hidden rounded-full mb-3">
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
          </div>
        </motion.div>
      )}

      {/* Settings */}
      <motion.div
        data-testid="profile-settings-card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl border border-stone-100 bg-white p-5 shadow-sm"
      >
        <SectionTitle icon={Settings} iconColor="text-stone-400">설정</SectionTitle>

        {/* Sound toggle */}
        <button
          data-testid="profile-setting-sound"
          onClick={() => {
            toggleMute();
            if (isMuted) play('button-tap');
          }}
          className="mb-3 flex w-full items-center justify-between rounded-2xl bg-stone-50 p-3 transition-colors hover:bg-stone-100"
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
            data-testid="profile-setting-reset"
            onClick={onResetOnboarding}
            className="w-full rounded-2xl bg-stone-50 p-3 text-left text-sm font-bold text-stone-600 transition-colors hover:bg-stone-100"
          >
            프로필 재설정
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
