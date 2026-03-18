import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';

interface Props {
  show: boolean;
  onDismiss: () => void;
}

export function DailyGoalCelebration({ show, onDismiss }: Props) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDismiss, 2500);
    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="bg-white/95 backdrop-blur-md p-10 rounded-[2rem] shadow-lg border-4 border-violet-200 text-center max-w-sm mx-6"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              <Trophy size={72} className="text-violet-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-black text-stone-800 mb-2">
              목표 달성!
            </h2>
            <p className="text-lg text-stone-600 font-bold">
              오늘의 목표를 완료했어요!
            </p>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: -80,
                  x: (i - 2.5) * 30,
                }}
                transition={{ duration: 1.2, delay: 0.1 * i, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 text-2xl pointer-events-none"
              >
                {['🌟', '✨', '🎉', '💜', '⭐', '🎊'][i]}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
