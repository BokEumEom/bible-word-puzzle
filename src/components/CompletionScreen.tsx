import { motion } from 'motion/react';
import { Star, ChevronRight, List, Home, BookOpen, Zap, Flame, Target } from 'lucide-react';
import { Verse, SessionStats } from '../types';
import { ActionButton } from './ui/ActionButton';
import { animations } from '../design/tokens';

interface Props {
  verse: Verse;
  nextVerse: Verse | null;
  sessionStats: SessionStats | null;
  onNextVerse: () => void;
  onBackToModes: () => void;
  onHome: () => void;
}

export function CompletionScreen({ verse, nextVerse, sessionStats, onNextVerse, onBackToModes, onHome }: Props) {
  const isBookComplete = !nextVerse;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-md mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="mb-3"
      >
        <Star size={56} className="text-amber-400 mx-auto drop-shadow-sm" fill="currentColor" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-black text-stone-800 mb-6"
      >
        {isBookComplete ? '모두 완료했어요!' : '잘했어요!'}
      </motion.h2>

      {/* Verse card + stats combined */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, ...animations.standard }}
        className="card-featured border-emerald-100 w-full mb-8 overflow-hidden"
      >
        {/* Completed verse */}
        <div className="px-6 py-5 border-b-2 border-emerald-50">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-emerald-500" />
            <span className="text-sm text-emerald-600 font-bold">{verse.reference}</span>
          </div>
          <p className="text-base text-stone-700 font-bold leading-relaxed">{verse.verse}</p>
        </div>

        {/* Session stats row */}
        {sessionStats && (
          <div className="grid grid-cols-3 gap-0">
            {/* XP */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="px-4 py-4 border-r border-emerald-50 text-center"
            >
              <div className="stat-icon bg-amber-100 w-fit mx-auto mb-1">
                <Zap size={18} className="text-amber-500" />
              </div>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
                className="text-xl font-black text-amber-600"
              >
                +{sessionStats.totalXp}
              </motion.p>
              <p className="text-[10px] font-bold text-stone-400">XP</p>
            </motion.div>

            {/* Streak */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="px-4 py-4 border-r border-emerald-50 text-center"
            >
              <div className="stat-icon bg-orange-100 w-fit mx-auto mb-1">
                <Flame size={18} className="text-orange-500" />
              </div>
              <p className="text-xl font-black text-orange-500">{sessionStats.streak}일</p>
              <p className="text-[10px] font-bold text-stone-400">연속</p>
            </motion.div>

            {/* Daily goal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="px-4 py-4 text-center"
            >
              <div className="stat-icon bg-violet-100 w-fit mx-auto mb-1">
                <Target size={18} className="text-violet-500" />
              </div>
              <p className="text-xl font-black text-violet-500">
                {Math.min(sessionStats.dailyGoalProgress, sessionStats.dailyGoal)}/{sessionStats.dailyGoal}
              </p>
              <p className="text-[10px] font-bold text-stone-400">오늘 목표</p>
            </motion.div>
          </div>
        )}

        {isBookComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="px-6 py-3 bg-emerald-50/80 border-t-2 border-emerald-100"
          >
            <p className="text-sm text-emerald-600 font-bold">
              이 책의 모든 구절을 완료했어요!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-col w-full gap-4">
        {nextVerse && (
          <ActionButton
            variant="primary"
            size="lg"
            icon={ChevronRight}
            delay={1.0}
            onClick={onNextVerse}
          >
            다음 구절 계속
          </ActionButton>
        )}

        <ActionButton
          variant="secondary"
          icon={List}
          delay={1.1}
          onClick={onBackToModes}
        >
          모드 선택
        </ActionButton>

        {isBookComplete && (
          <ActionButton
            variant="ghost"
            icon={Home}
            delay={1.2}
            onClick={onHome}
          >
            홈으로
          </ActionButton>
        )}
      </div>
    </motion.div>
  );
}
