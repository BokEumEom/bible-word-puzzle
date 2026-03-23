import { motion } from 'motion/react';
import { Target, Check } from 'lucide-react';

interface Props {
  todayCompletions: number;
  dailyGoal: number;
  isMet: boolean;
}

export function DailyGoalBadge({ todayCompletions, dailyGoal, isMet }: Props) {
  const progress = Math.min(todayCompletions / dailyGoal, 1);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-3xl shadow-sm border-b-4 border-violet-100"
    >
      <div className={`p-2.5 rounded-2xl ${isMet ? 'bg-violet-200' : 'bg-violet-100'}`}>
        {isMet ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Check className="text-violet-600" size={28} />
          </motion.div>
        ) : (
          <Target className="text-violet-500" size={28} />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-stone-500 font-bold">오늘의 목표</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2.5 bg-violet-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${isMet ? 'bg-violet-500' : 'bg-violet-400'}`}
            />
          </div>
          <span className="text-sm font-black text-violet-500 whitespace-nowrap">
            {todayCompletions}/{dailyGoal}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
