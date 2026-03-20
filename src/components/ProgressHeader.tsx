import { useRef } from 'react';
import { Star, Home, ChevronLeft } from 'lucide-react';
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
    <div className="w-full mb-6 flex flex-col gap-3">
      {(onBack || onClose) && (
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white border-2 border-orange-100 shrink-0 transition-colors"
              aria-label="뒤로 가기"
            >
              <ChevronLeft size={32} className="text-orange-500" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white border-2 border-orange-100 shrink-0 transition-colors"
              aria-label="홈으로 가기"
            >
              <Home size={32} className="text-orange-500" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 w-full p-3 sm:p-4 bg-white/90 backdrop-blur-md rounded-[2rem] shadow-sm border-2 border-orange-100">
        {/* Progress bar */}
        <div className="flex-1 h-4 bg-stone-100 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>

        {/* Star counter */}
        <motion.div
          className="flex items-center gap-1.5 sm:gap-2 bg-amber-100 px-3 sm:px-4 py-2 rounded-full shrink-0"
          animate={justEarned ? {
            boxShadow: ['0 0 0 0 rgba(251,191,36,0)', '0 0 16px 4px rgba(251,191,36,0.5)', '0 0 0 0 rgba(251,191,36,0)'],
          } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            key={stars}
            initial={{ scale: 1.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-amber-500"
          >
            <Star fill="currentColor" size={20} className="sm:w-6 sm:h-6" />
          </motion.div>
          <span className="font-black text-lg sm:text-xl text-amber-700">{stars}</span>
        </motion.div>
      </div>
    </div>
  );
}
