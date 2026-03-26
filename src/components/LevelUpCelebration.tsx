import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LevelInfo } from '../data/levels';
import { useSound } from '../hooks/useSound';
// Star icon removed — using JOY mascot instead
import { animations } from '../design/tokens';

interface Props {
  show: boolean;
  newLevel: LevelInfo | null;
  onDismiss: () => void;
}

export function LevelUpCelebration({ show, newLevel, onDismiss }: Props) {
  const { play } = useSound();

  useEffect(() => {
    if (show && newLevel) play('level-up');
  }, [show]);

  if (!newLevel) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6"
        >
          <motion.div
            initial={{ scale: 0.3, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={animations.celebration}
            onClick={(e) => e.stopPropagation()}
            className="card-celebration shadow-[0_4px_0_var(--color-violet-200)] p-8 max-w-sm w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-2"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-bold text-violet-500 mb-2"
            >
              레벨 업!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="text-5xl mb-3"
            >
              {newLevel.emoji}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-black text-stone-800 mb-1"
            >
              Lv.{newLevel.level} {newLevel.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-stone-500 font-bold mb-6"
            >
              축하해요! 계속 성장하고 있어요!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
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
