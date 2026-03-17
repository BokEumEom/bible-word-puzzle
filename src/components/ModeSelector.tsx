import { motion } from 'motion/react';
import { Verse } from '../types';
import { BookOpen, Brain, Puzzle, ChevronLeft } from 'lucide-react';

interface Props {
  verse: Verse;
  onSelectMode: (mode: 'reading' | 'memorizing' | 'custom-playing') => void;
  onBack: () => void;
}

export function ModeSelector({ verse, onSelectMode, onBack }: Props) {
  const modes = [
    {
      id: 'reading' as const,
      label: '말씀 읽기',
      desc: '큰 글씨로 천천히 읽어보아요',
      icon: BookOpen,
      color: 'bg-emerald-100 hover:bg-emerald-200',
      border: 'border-emerald-300',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'memorizing' as const,
      label: '말씀 외우기',
      desc: '단어를 콕콕 눌러서 가려보아요',
      icon: Brain,
      color: 'bg-amber-100 hover:bg-amber-200',
      border: 'border-amber-300',
      iconColor: 'text-amber-500'
    },
    {
      id: 'custom-playing' as const,
      label: '퍼즐 맞추기',
      desc: '흩어진 단어를 순서대로 맞춰요',
      icon: Puzzle,
      color: 'bg-sky-100 hover:bg-sky-200',
      border: 'border-sky-300',
      iconColor: 'text-sky-500'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto"
    >
      <div className="w-full flex items-center mb-8">
        <button 
          onClick={onBack}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white mr-4 border-2 border-orange-100 transition-colors"
        >
          <ChevronLeft size={32} className="text-orange-500" />
        </button>
        <h2 className="text-3xl font-black text-stone-800 flex-1 text-center">
          어떻게 해볼까요? 🎈
        </h2>
        <div className="w-14" />
      </div>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border-2 border-orange-100 mb-10 w-full text-center relative overflow-hidden">
        <div className="absolute -top-4 -right-4 bg-orange-50 w-20 h-20 rounded-full opacity-50" />
        <h3 className="text-2xl font-black text-orange-500 mb-3 relative z-10">{verse.reference}</h3>
        <p className="text-2xl text-stone-700 leading-relaxed font-bold relative z-10">{verse.verse}</p>
      </div>

      <div className="w-full space-y-5">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectMode(mode.id)}
              className={`w-full flex items-center p-6 rounded-[2rem] border-b-8 ${mode.border} ${mode.color} shadow-sm transition-colors text-left`}
            >
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl mr-5 shadow-sm rotate-3">
                <Icon size={36} className={mode.iconColor} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-800 mb-1">{mode.label}</h3>
                <p className="text-lg text-stone-600 font-bold">{mode.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
