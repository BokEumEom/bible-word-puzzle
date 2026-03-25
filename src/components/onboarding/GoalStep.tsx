import { motion } from 'motion/react';
import { Turtle, Rabbit, Bird } from 'lucide-react';

interface Props {
  onSelect: (goal: number) => void;
}

const goals = [
  {
    value: 1,
    label: '1구절',
    desc: '가볍게',
    icon: Turtle,
    color: 'bg-emerald-100 hover:bg-emerald-200',
    shadow: 'shadow-[0_8px_0_var(--color-emerald-300)]',
    iconColor: 'text-emerald-500',
  },
  {
    value: 3,
    label: '3구절',
    desc: '꾸준히',
    icon: Rabbit,
    color: 'bg-amber-100 hover:bg-amber-200',
    shadow: 'shadow-[0_8px_0_var(--color-amber-300)]',
    iconColor: 'text-amber-500',
    recommended: true,
  },
  {
    value: 5,
    label: '5구절',
    desc: '도전!',
    icon: Bird,
    color: 'bg-sky-100 hover:bg-sky-200',
    shadow: 'shadow-[0_8px_0_var(--color-sky-300)]',
    iconColor: 'text-sky-500',
  },
];

export function GoalStep({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-stone-800 mb-10 text-center leading-tight"
      >
        하루에 몇 구절<br />배울까요?
      </motion.h2>

      <div className="w-full space-y-5">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          return (
            <motion.button
              key={goal.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(goal.value)}
              className={`w-full flex items-center p-6 rounded-3xl ${goal.shadow} ${goal.color} transition-colors text-left relative`}
            >
              <div className="bg-white p-4 rounded-2xl mr-5 shadow-sm rotate-3">
                <Icon size={36} className={goal.iconColor} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-800 mb-1">{goal.label}</h3>
                <p className="text-lg text-stone-600 font-bold">{goal.desc}</p>
              </div>
              {goal.recommended && (
                <span className="absolute top-4 right-5 bg-orange-400 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm">
                  추천
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
