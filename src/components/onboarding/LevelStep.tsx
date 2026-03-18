import { motion } from 'motion/react';
import { Difficulty } from '../../types';
import { Sprout, TreePine, Trees } from 'lucide-react';

interface Props {
  onSelect: (level: Difficulty) => void;
}

const levels = [
  {
    id: 'beginner' as Difficulty,
    label: '이제 막 시작해요',
    desc: '성경이 처음이에요',
    icon: Sprout,
    color: 'bg-emerald-100 hover:bg-emerald-200',
    border: 'border-emerald-300',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'easy' as Difficulty,
    label: '주일학교에서 배웠어요',
    desc: '어느 정도 알고 있어요',
    icon: TreePine,
    color: 'bg-amber-100 hover:bg-amber-200',
    border: 'border-amber-300',
    iconColor: 'text-amber-500',
  },
  {
    id: 'normal' as Difficulty,
    label: '매일 말씀을 읽어요',
    desc: '성경을 잘 알아요',
    icon: Trees,
    color: 'bg-sky-100 hover:bg-sky-200',
    border: 'border-sky-300',
    iconColor: 'text-sky-500',
  },
];

export function LevelStep({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-stone-800 mb-10 text-center leading-tight"
      >
        성경 말씀을<br />얼마나 접해봤나요?
      </motion.h2>

      <div className="w-full space-y-5">
        {levels.map((level, index) => {
          const Icon = level.icon;
          return (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(level.id)}
              className={`w-full flex items-center p-6 rounded-[2rem] border-b-8 ${level.border} ${level.color} shadow-sm transition-colors text-left`}
            >
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl mr-5 shadow-sm rotate-3">
                <Icon size={36} className={level.iconColor} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-800 mb-1">{level.label}</h3>
                <p className="text-lg text-stone-600 font-bold">{level.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
