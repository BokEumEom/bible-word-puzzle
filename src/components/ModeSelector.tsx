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
      color: 'bg-green-200 hover:bg-green-300',
      border: 'border-green-400',
    },
    {
      id: 'memorizing' as const,
      label: '말씀 외우기',
      desc: '단어를 콕콕 눌러서 가려보아요',
      icon: Brain,
      color: 'bg-yellow-200 hover:bg-yellow-300',
      border: 'border-yellow-400',
    },
    {
      id: 'custom-playing' as const,
      label: '퍼즐 맞추기',
      desc: '흩어진 단어를 순서대로 맞춰요',
      icon: Puzzle,
      color: 'bg-blue-200 hover:bg-blue-300',
      border: 'border-blue-400',
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
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 mr-4"
        >
          <ChevronLeft size={32} className="text-gray-600" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 flex-1 text-center">
          어떻게 해볼까요?
        </h2>
        <div className="w-12" />
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-gray-100 mb-8 w-full text-center">
        <h3 className="text-xl font-bold text-blue-500 mb-2">{verse.reference}</h3>
        <p className="text-2xl text-gray-700 leading-relaxed">{verse.verse}</p>
      </div>

      <div className="w-full space-y-4">
        {modes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode(mode.id)}
              className={`w-full flex items-center p-6 rounded-3xl border-b-4 ${mode.border} ${mode.color} shadow-md transition-colors text-left`}
            >
              <div className="bg-white p-3 rounded-full mr-4 shadow-sm">
                <Icon size={32} className="text-gray-700" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{mode.label}</h3>
                <p className="text-lg text-gray-600">{mode.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
