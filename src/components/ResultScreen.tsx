import { motion } from 'motion/react';
import { Star, Home, RotateCcw, Shuffle } from 'lucide-react';

interface Props {
  stars: number;
  total: number;
  onHome: () => void;
  onRetry: () => void;
  onChangeDifficulty: () => void;
}

export function ResultScreen({ stars, total, onHome, onRetry, onChangeDifficulty }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border-4 border-orange-200 w-full mb-10 relative overflow-hidden"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.4 }}
          className="absolute -top-6 -right-6 bg-orange-200 w-24 h-24 rounded-full opacity-30"
        />
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.6 }}
          className="absolute -bottom-8 -left-8 bg-amber-200 w-32 h-32 rounded-full opacity-30"
        />

        <h2 className="text-4xl font-black text-stone-800 mb-6 relative z-10">
          최고예요! 🌟
        </h2>
        
        <div className="flex justify-center gap-3 mb-8 relative z-10">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 200 }}
            >
              <Star size={72} className="text-amber-400 drop-shadow-sm" fill="currentColor" />
            </motion.div>
          ))}
        </div>

        <div className="bg-orange-50/80 backdrop-blur-sm rounded-2xl p-4 relative z-10 border-2 border-orange-100">
          <p className="text-2xl text-stone-700 mb-2 font-bold">
            획득한 별: <span className="font-black text-amber-500 text-3xl">{stars}개</span>
          </p>
          <p className="text-xl text-stone-500 font-bold">
            총 {total}문제를 맞췄어요!
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col w-full gap-4">
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="btn-primary w-full text-2xl py-5 rounded-[2rem] flex items-center justify-center gap-3"
        >
          <RotateCcw size={32} />
          다시 하기
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onChangeDifficulty}
          className="w-full text-2xl py-5 rounded-[2rem] flex items-center justify-center gap-3 bg-white/80 text-stone-700 font-black border-2 border-orange-200 shadow-sm hover:bg-white transition-colors"
        >
          <Shuffle size={32} />
          다른 난이도 도전
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="btn-secondary w-full text-2xl py-5 rounded-[2rem] flex items-center justify-center gap-3"
        >
          <Home size={32} />
          홈으로
        </motion.button>
      </div>
    </motion.div>
  );
}
