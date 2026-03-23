import { motion } from 'motion/react';
import { LevelInfo } from '../data/levels';
import { getXpProgress } from '../data/levels';

interface Props {
  level: LevelInfo;
  xp: number;
}

export function LevelBadge({ level, xp }: Props) {
  const { current, next, progress } = getXpProgress(xp);
  const isMaxLevel = progress === 1 && current === next;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-4 bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-sm border-b-4 border-violet-100"
    >
      <div className="bg-violet-100 p-3 rounded-2xl shrink-0">
        <span className="text-3xl">{level.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-violet-600">Lv.{level.level}</span>
            <span className="text-base font-black text-stone-800">{level.name}</span>
          </div>
          <span className="text-xs font-bold text-stone-400">
            {isMaxLevel ? `${xp} XP` : `${current} / ${next} XP`}
          </span>
        </div>
        <div className="w-full h-3 bg-violet-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress * 100, 100)}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
