import { motion } from 'motion/react';
import { Star, Home, RotateCcw } from 'lucide-react';

interface Props {
  stars: number;
  total: number;
  onHome: () => void;
  onRetry: () => void;
}

export function ResultScreen({ stars, total, onHome, onRetry }: Props) {
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
        className="bg-white p-8 rounded-3xl shadow-xl border-4 border-yellow-300 w-full mb-8"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          참 잘했어요! 🎉
        </h2>
        
        <div className="flex justify-center gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
            >
              <Star size={64} className="text-yellow-400" fill="currentColor" />
            </motion.div>
          ))}
        </div>

        <p className="text-2xl text-gray-600 mb-2">
          획득한 별: <span className="font-bold text-yellow-500">{stars}개</span>
        </p>
        <p className="text-xl text-gray-500">
          총 {total}문제를 맞췄어요!
        </p>
      </motion.div>

      <div className="flex flex-col w-full gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white text-2xl py-4 rounded-2xl shadow-md border-b-4 border-blue-600 flex items-center justify-center gap-2"
        >
          <RotateCcw size={28} />
          다시 하기
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onHome}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-2xl py-4 rounded-2xl shadow-sm flex items-center justify-center gap-2"
        >
          <Home size={28} />
          홈으로
        </motion.button>
      </div>
    </motion.div>
  );
}
