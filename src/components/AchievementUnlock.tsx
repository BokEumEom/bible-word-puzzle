import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AchievementDef, AchievementCategory } from '../data/achievements';
import { useSound } from '../hooks/useSound';
import { Award } from 'lucide-react';
import { animations } from '../design/tokens';

interface Props {
  show: boolean;
  achievement: AchievementDef | null;
  onDismiss: () => void;
}

const categoryColors: Record<AchievementCategory, { shadow: string; text: string; bg: string }> = {
  '학습': { shadow: 'shadow-[0_8px_0_var(--color-emerald-200)]', text: 'text-emerald-600', bg: 'bg-emerald-100' },
  '연속': { shadow: 'shadow-[0_8px_0_var(--color-orange-200)]', text: 'text-orange-600', bg: 'bg-orange-100' },
  '도전': { shadow: 'shadow-[0_8px_0_var(--color-amber-200)]', text: 'text-amber-600', bg: 'bg-amber-100' },
  '헌신': { shadow: 'shadow-[0_8px_0_var(--color-violet-200)]', text: 'text-violet-600', bg: 'bg-violet-100' },
  '수집': { shadow: 'shadow-[0_8px_0_var(--color-rose-200)]', text: 'text-rose-600', bg: 'bg-rose-100' },
};

export function AchievementUnlock({ show, achievement, onDismiss }: Props) {
  const { play } = useSound();

  useEffect(() => {
    if (show && achievement) play('achievement');
  }, [show]);

  if (!achievement) return null;

  const colors = categoryColors[achievement.category];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 z-[65] flex items-center justify-center bg-black/40 p-6"
        >
          <motion.div
            initial={{ scale: 0.3, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={animations.celebration}
            onClick={(e) => e.stopPropagation()}
            className={`card-celebration ${colors.shadow} p-8 max-w-sm w-full text-center`}
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Award className={`${colors.text} mx-auto mb-2`} size={40} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-lg font-bold ${colors.text} mb-2`}
            >
              업적 달성!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="text-7xl mb-3"
            >
              {achievement.emoji}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black text-stone-800 mb-1"
            >
              {achievement.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-stone-500 font-bold mb-3"
            >
              {achievement.description}
            </motion.p>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={`inline-block ${colors.bg} ${colors.text} text-xs font-black px-3 py-1 rounded-full mb-6`}
            >
              {achievement.category}
            </motion.span>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDismiss}
              className="btn-primary w-full py-4 text-xl"
            >
              계속하기
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
