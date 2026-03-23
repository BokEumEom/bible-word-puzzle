import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XpEvent } from '../utils/xp';
import { useSound } from '../hooks/useSound';
import { Zap, Eye, Target, Flame } from 'lucide-react';

interface Props {
  xpEvent: XpEvent | null;
  onDone: () => void;
}

export function XpGainAnimation({ xpEvent, onDone }: Props) {
  const { play } = useSound();

  useEffect(() => {
    if (xpEvent) play('xp-gain');
  }, [xpEvent]);

  if (!xpEvent) return null;

  const bonuses = [
    xpEvent.noHintBonus > 0 && { label: '힌트 없이!', value: xpEvent.noHintBonus, icon: Eye, color: 'text-sky-500' },
    xpEvent.dailyGoalBonus > 0 && { label: '일일 목표!', value: xpEvent.dailyGoalBonus, icon: Target, color: 'text-emerald-500' },
    xpEvent.streakBonus > 0 && { label: '연속 보너스!', value: xpEvent.streakBonus, icon: Flame, color: 'text-orange-500' },
  ].filter(Boolean) as { label: string; value: number; icon: any; color: string }[];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onAnimationComplete={() => {
          setTimeout(onDone, 2000);
        }}
        className="fixed inset-x-0 bottom-24 z-50 flex flex-col items-center pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="bg-white/95 backdrop-blur-md px-8 py-5 rounded-3xl shadow-lg border-b-4 border-violet-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-violet-500" size={24} />
            <span className="text-2xl font-black text-violet-600">+{xpEvent.total} XP</span>
          </div>

          {bonuses.length > 0 && (
            <div className="flex flex-col gap-1">
              {bonuses.map((bonus, i) => {
                const Icon = bonus.icon;
                return (
                  <motion.div
                    key={bonus.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Icon size={14} className={bonus.color} />
                    <span className="font-bold text-stone-600">{bonus.label}</span>
                    <span className={`font-black ${bonus.color}`}>+{bonus.value}</span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
