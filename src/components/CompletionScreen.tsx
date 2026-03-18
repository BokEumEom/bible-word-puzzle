import { motion } from 'motion/react';
import { Star, ChevronRight, List, Home, BookOpen } from 'lucide-react';
import { Verse } from '../types';

interface Props {
  verse: Verse;
  nextVerse: Verse | null;
  onNextVerse: () => void;
  onBackToModes: () => void;
  onHome: () => void;
}

export function CompletionScreen({ verse, nextVerse, onNextVerse, onBackToModes, onHome }: Props) {
  const isBookComplete = !nextVerse;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border-4 border-emerald-200 w-full mb-8 relative overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.4 }}
          className="absolute -top-6 -right-6 bg-emerald-200 w-24 h-24 rounded-full opacity-30"
        />

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mb-4"
        >
          <Star size={64} className="text-amber-400 mx-auto drop-shadow-sm" fill="currentColor" />
        </motion.div>

        <h2 className="text-3xl font-black text-stone-800 mb-4 relative z-10">
          {isBookComplete ? '모두 완료했어요! 🎊' : '잘했어요! 🌟'}
        </h2>

        <div className="bg-emerald-50/80 rounded-2xl p-4 relative z-10 border-2 border-emerald-100">
          <p className="text-sm text-emerald-600 font-bold mb-1">{verse.reference}</p>
          <p className="text-lg text-stone-700 font-bold leading-relaxed">{verse.verse}</p>
        </div>

        {isBookComplete && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-emerald-600 font-bold relative z-10"
          >
            이 책의 모든 구절을 완료했어요!
          </motion.p>
        )}
      </motion.div>

      <div className="flex flex-col w-full gap-4">
        {nextVerse && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextVerse}
            className="btn-primary w-full text-xl py-5 rounded-[2rem] flex items-center justify-center gap-3"
          >
            <ChevronRight size={28} />
            다음 구절 계속
          </motion.button>
        )}

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBackToModes}
          className="btn-secondary w-full text-xl py-5 rounded-[2rem] flex items-center justify-center gap-3"
        >
          <List size={28} />
          모드 선택
        </motion.button>

        {isBookComplete && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHome}
            className="w-full text-xl py-5 rounded-[2rem] flex items-center justify-center gap-3 bg-white/80 text-stone-600 font-black border-2 border-stone-200 shadow-sm"
          >
            <Home size={28} />
            홈으로
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
