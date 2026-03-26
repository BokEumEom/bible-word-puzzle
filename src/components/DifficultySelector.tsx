import { motion } from 'motion/react';
import { Difficulty } from '../types';
import { Baby, Smile, Zap, ChevronLeft } from 'lucide-react';

interface Props {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
  defaultLevel?: Difficulty;
}

export function DifficultySelector({ onSelect, onBack, defaultLevel }: Props) {
  const difficulties: { id: Difficulty; label: string; desc: string; icon: any; color: string; shadow: string; iconColor: string }[] = [
    {
      id: 'beginner',
      label: '처음이에요',
      desc: '짧고 쉬운 말씀이에요',
      icon: Baby,
      color: 'bg-emerald-100 hover:bg-emerald-200',
      shadow: 'shadow-[0_4px_0_var(--color-emerald-300)]',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'easy',
      label: '쉬워요',
      desc: '조금 더 긴 말씀이에요',
      icon: Smile,
      color: 'bg-amber-100 hover:bg-amber-200',
      shadow: 'shadow-[0_4px_0_var(--color-amber-300)]',
      iconColor: 'text-amber-500'
    },
    {
      id: 'normal',
      label: '잘해요',
      desc: '긴 말씀도 거뜬해요!',
      icon: Zap,
      color: 'bg-sky-100 hover:bg-sky-200',
      shadow: 'shadow-[0_4px_0_var(--color-sky-300)]',
      iconColor: 'text-sky-500'
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
          className="p-3 bg-white rounded-full shadow-sm hover:bg-white border-2 border-orange-100 transition-colors"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={32} className="text-orange-500" />
        </button>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="mb-4 mt-12"
      />

      <h2 className="text-3xl font-black text-stone-800 mb-8 text-center leading-tight">
        어떤 난이도로<br/>해볼까요?
      </h2>

      <div className="w-full space-y-5">
        {difficulties.map((diff, index) => {
          const Icon = diff.icon;
          return (
            <motion.button
              key={diff.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(diff.id)}
              className={`w-full flex items-center p-6 rounded-3xl ${diff.color} ${diff.shadow} transition-colors text-left relative ${defaultLevel === diff.id ? 'ring-4 ring-orange-300' : ''}`}
            >
              <div className="bg-white p-4 rounded-2xl mr-5 shadow-sm rotate-3">
                <Icon size={36} className={diff.iconColor} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-800 mb-1">{diff.label}</h3>
                <p className="text-lg text-stone-600 font-bold">{diff.desc}</p>
              </div>
              {defaultLevel === diff.id && (
                <span className="absolute top-4 right-5 bg-orange-400 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                  나의 레벨
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
