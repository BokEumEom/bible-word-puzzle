import { motion } from 'motion/react';
import { Difficulty } from '../types';
import { Baby, Smile, Zap, ChevronLeft } from 'lucide-react';

interface Props {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

export function DifficultySelector({ onSelect, onBack }: Props) {
  const difficulties: { id: Difficulty; label: string; desc: string; icon: any; color: string; border: string }[] = [
    {
      id: 'beginner',
      label: '처음이에요',
      desc: '짧고 쉬운 말씀이에요',
      icon: Baby,
      color: 'bg-green-200 hover:bg-green-300',
      border: 'border-green-400',
    },
    {
      id: 'easy',
      label: '쉬워요',
      desc: '조금 더 긴 말씀이에요',
      icon: Smile,
      color: 'bg-yellow-200 hover:bg-yellow-300',
      border: 'border-yellow-400',
    },
    {
      id: 'normal',
      label: '잘해요',
      desc: '긴 말씀도 거뜬해요!',
      icon: Zap,
      color: 'bg-blue-200 hover:bg-blue-300',
      border: 'border-blue-400',
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto relative"
    >
      <div className="absolute top-8 left-4">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 border-2 border-gray-100"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={32} className="text-gray-600" />
        </button>
      </div>

      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center mt-12">
        어떤 난이도로<br/>해볼까요?
      </h2>

      <div className="w-full space-y-4">
        {difficulties.map((diff, index) => {
          const Icon = diff.icon;
          return (
            <motion.button
              key={diff.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(diff.id)}
              className={`w-full flex items-center p-6 rounded-3xl border-b-4 ${diff.border} ${diff.color} shadow-md transition-colors text-left`}
            >
              <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                <Icon size={32} className="text-gray-700" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{diff.label}</h3>
                <p className="text-lg text-gray-600">{diff.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
