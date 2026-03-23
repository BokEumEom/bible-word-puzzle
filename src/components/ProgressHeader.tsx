import { useRef } from 'react';
import { X, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  current: number;
  total: number;
  stars: number;
  onClose?: () => void;
  onBack?: () => void;
}

export function ProgressHeader({ current, total, stars, onClose, onBack }: Props) {
  const prevStarsRef = useRef(stars);
  const justEarned = stars > prevStarsRef.current;
  prevStarsRef.current = stars;
  const progressPercent = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full mb-6 flex items-center gap-3">
      {/* Close / Back button — Duolingo uses X */}
      {(onBack || onClose) && (
        <button
          onClick={onBack ?? onClose}
          className="p-2 rounded-full hover:bg-stone-100 transition-colors shrink-0"
          aria-label="닫기"
        >
          <X size={28} className="text-stone-400" strokeWidth={3} />
        </button>
      )}

      {/* Progress bar — clean, Duolingo green */}
      <div className="flex-1 h-4 bg-stone-200 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-emerald-500 rounded-full relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* Energy-style counter — lightning bolt like Duolingo */}
      <motion.div
        className="flex items-center gap-1 shrink-0"
        animate={justEarned ? {
          scale: [1, 1.3, 1],
        } : {}}
        transition={{ duration: 0.4 }}
      >
        <Zap size={22} className="text-amber-500" fill="currentColor" />
        <motion.span
          key={stars}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-black text-lg text-amber-500"
        >
          {stars}
        </motion.span>
      </motion.div>
    </div>
  );
}
