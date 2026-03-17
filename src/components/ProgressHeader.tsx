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
      
      <div className="flex items-center justify-between w-full p-3 sm:p-4 bg-white/90 backdrop-blur-md rounded-[2rem] shadow-sm border-2 border-orange-100">
        <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-black text-lg sm:text-xl shrink-0">
          {current} / {total}
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-100 px-3 sm:px-4 py-2 rounded-full shrink-0">
          <motion.div
            key={stars}
            initial={{ scale: 1.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-amber-500"
          >
            <Star fill="currentColor" size={20} className="sm:w-6 sm:h-6" />
          </motion.div>
          <span className="font-black text-lg sm:text-xl text-amber-700">{stars}</span>
        </div>
      </div>
    </div>
  );
}
