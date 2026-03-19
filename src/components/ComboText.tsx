import { motion, AnimatePresence } from 'motion/react';

interface Props {
  comboCount: number;
  show: boolean;
}

function getComboConfig(count: number): { text: string; color: string; scale: number } {
  if (count >= 4) return { text: '완벽!', color: 'text-violet-500', scale: 1.4 };
  if (count === 3) return { text: '훌륭해요!', color: 'text-amber-500', scale: 1.2 };
  return { text: '좋아요!', color: 'text-emerald-500', scale: 1 };
}

export function ComboText({ comboCount, show }: Props) {
  if (comboCount < 2) return null;

  const { text, color, scale } = getComboConfig(comboCount);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={comboCount}
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale, y: -20 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={`absolute -top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none ${color} text-2xl font-black whitespace-nowrap drop-shadow-sm`}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
