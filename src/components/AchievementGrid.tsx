import { motion } from 'motion/react';
import { Trophy } from 'lucide-react';
import { achievements, AchievementCategory } from '../data/achievements';

interface Props {
  unlockedIds: readonly string[];
}

const categoryBorderColors: Record<AchievementCategory, string> = {
  '학습': 'border-emerald-200',
  '연속': 'border-orange-200',
  '도전': 'border-amber-200',
  '헌신': 'border-violet-200',
  '수집': 'border-rose-200',
};

export function AchievementGrid({ unlockedIds }: Props) {
  const lastUnlocked = unlockedIds.length > 0 ? unlockedIds[unlockedIds.length - 1] : null;

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black text-stone-800 mb-4 flex items-center gap-2">
        <Trophy className="text-amber-500" size={28} />
        나의 업적
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {achievements.map((achievement, index) => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const isRecent = achievement.id === lastUnlocked;
          const borderColor = isUnlocked ? categoryBorderColors[achievement.category] : 'border-stone-100';

          return (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.03, type: 'spring', stiffness: 200, damping: 15 }}
              className={`bg-white/90 backdrop-blur-sm p-3 rounded-3xl shadow-sm border-b-4 ${borderColor} text-center ${!isUnlocked ? 'opacity-30 grayscale' : ''}`}
            >
              {isRecent && isUnlocked && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0"
                />
              )}
              <div className="text-3xl mb-1">
                {isUnlocked ? achievement.emoji : '🔒'}
              </div>
              <p className="text-xs font-bold text-stone-600 leading-tight truncate">
                {isUnlocked ? achievement.name : '???'}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
