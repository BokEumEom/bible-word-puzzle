import { motion } from 'motion/react';
import { Star, Home, RotateCcw, Shuffle, Flame, Zap, Target, Clock } from 'lucide-react';
import { SessionStats } from '../types';
import { ActionButton } from './ui/ActionButton';
import { StatRow } from './ui/StatRow';
import { animations } from '../design/tokens';

interface Props {
  stars: number;
  total: number;
  sessionStats: SessionStats | null;
  onHome: () => void;
  onRetry: () => void;
  onChangeDifficulty: () => void;
}

function formatDuration(startedAt: number): string {
  const seconds = Math.round((Date.now() - startedAt) / 1000);
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return remaining > 0 ? `${minutes}분 ${remaining}초` : `${minutes}분`;
}

function getEncouragingMessage(stats: SessionStats | null, stars: number, total: number): string {
  if (!stats) return '잘했어요!';
  const accuracy = total > 0 ? stars / total : 0;
  if (stats.isDailyGoalJustMet) return '오늘의 목표 달성!';
  if (accuracy === 1 && stats.hintsUsed === 0) return '완벽해요! 힌트 없이 전부!';
  if (accuracy === 1) return '전부 맞췄어요!';
  if (accuracy >= 0.8) return '거의 완벽해요!';
  return '좋은 도전이었어요!';
}

export function ResultScreen({ stars, total, sessionStats, onHome, onRetry, onChangeDifficulty }: Props) {
  const accuracy = total > 0 ? Math.round((stars / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-md mx-auto"
    >
      {/* Header celebration */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="w-full mb-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-3"
        >
          <Star size={56} className="text-amber-400 mx-auto drop-shadow-sm" fill="currentColor" />
        </motion.div>
        <h2 className="text-3xl font-black text-stone-800">
          {getEncouragingMessage(sessionStats, stars, total)}
        </h2>
      </motion.div>

      {/* Stats card — Duolingo session summary style */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, ...animations.standard }}
        className="card-featured border-orange-100 w-full mb-8 overflow-hidden"
      >
        {/* XP total — prominent */}
        {sessionStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b-2 border-orange-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-amber-400 p-2.5 rounded-2xl">
                <Zap size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">획득 XP</p>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
                  className="text-3xl font-black text-amber-600"
                >
                  +{sessionStats.totalXp}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-0">
          <div className="border-b border-r border-orange-50">
            <StatRow
              icon={Target}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-100"
              label="정확도"
              value={`${accuracy}%`}
              delay={0.7}
            />
          </div>
          <div className="border-b border-orange-50">
            <StatRow
              icon={Star}
              iconColor="text-violet-600"
              iconBg="bg-violet-100"
              label="완료"
              value={`${stars}/${total}`}
              delay={0.8}
            />
          </div>
          <div className="border-r border-orange-50">
            <StatRow
              icon={Flame}
              iconColor="text-orange-500"
              iconBg="bg-orange-100"
              label="연속"
              value={`${sessionStats?.streak ?? 0}일`}
              valueColor="text-orange-500"
              delay={0.9}
            />
          </div>
          <div>
            <StatRow
              icon={Clock}
              iconColor="text-sky-600"
              iconBg="bg-sky-100"
              label="시간"
              value={sessionStats ? formatDuration(sessionStats.startedAt) : '-'}
              delay={1.0}
            />
          </div>
        </div>

        {/* Daily goal progress bar */}
        {sessionStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="px-6 py-4 bg-violet-50/50 border-t-2 border-orange-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-violet-600">오늘의 목표</span>
              <span className="text-xs font-black text-violet-500">
                {Math.min(sessionStats.dailyGoalProgress, sessionStats.dailyGoal)}/{sessionStats.dailyGoal}
              </span>
            </div>
            <div className="h-3 bg-violet-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(sessionStats.dailyGoalProgress / sessionStats.dailyGoal, 1) * 100}%` }}
                transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${sessionStats.dailyGoalProgress >= sessionStats.dailyGoal ? 'bg-violet-500' : 'bg-violet-400'}`}
              />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-col w-full gap-4">
        <ActionButton variant="primary" icon={RotateCcw} size="lg" delay={1.2} onClick={onRetry}>
          다시 하기
        </ActionButton>
        <ActionButton variant="secondary" icon={Shuffle} delay={1.3} onClick={onChangeDifficulty}>
          다른 난이도 도전
        </ActionButton>
        <ActionButton variant="ghost" icon={Home} delay={1.4} onClick={onHome}>
          홈으로
        </ActionButton>
      </div>
    </motion.div>
  );
}
