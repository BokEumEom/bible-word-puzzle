import { motion } from 'motion/react';
import { Difficulty } from '../../types';
import { bibleIndex } from '../../data/bible';
import { BarChart3, BookOpen, Target } from 'lucide-react';

interface Props {
  level: Difficulty;
  interests: string[];
  dailyGoal: number;
  onComplete: () => void;
}

const levelLabels: Record<Difficulty, string> = {
  beginner: '이제 막 시작',
  easy: '주일학교 수준',
  normal: '매일 말씀 읽기',
};

export function ResultStep({ level, interests, dailyGoal, onComplete }: Props) {
  const interestNames = interests
    .map(id => bibleIndex.find(b => b.id === id)?.name)
    .filter(Boolean)
    .slice(0, 4)
    .join(', ');

  const cards = [
    {
      icon: BarChart3,
      label: '현재 수준',
      value: levelLabels[level],
      accentClassName: 'bg-emerald-50 text-emerald-500',
    },
    {
      icon: BookOpen,
      label: '관심 말씀',
      value: interestNames || '시편, 잠언, 창세기',
      accentClassName: 'bg-violet-50 text-violet-500',
    },
    {
      icon: Target,
      label: '일일 목표',
      value: `하루 ${dailyGoal}구절`,
      accentClassName: 'bg-amber-50 text-amber-500',
    },
  ];

  return (
    <div className="flex min-h-screen items-center p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.03 }}
          className="mb-5 flex justify-center"
        >
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-lime-100 via-amber-50 to-white shadow-sm">
            <img
              src="/joy-support.png"
              alt="완료한 JOY 캐릭터"
              className="h-28 w-28 scale-[1.2] object-contain"
            />
          </div>
        </motion.div>

        <motion.h2
          data-testid="result-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-center text-2xl font-black leading-tight text-stone-900"
        >
          맞춤 시작점이
          <br />
          준비됐어요
        </motion.h2>
        <p className="mb-8 text-center text-sm font-bold leading-relaxed text-stone-500">
          처음엔 가볍게 시작하고, 학습하면서 언제든 다시 조정할 수 있어요.
        </p>

        <div className="mb-8 space-y-3">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.accentClassName}`}>
                  <Icon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-stone-500">{card.label}</p>
                  <p className="mt-1 text-base font-black text-stone-900">{card.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="btn-primary w-full py-5 text-xl"
        >
          내 맞춤 말씀 시작하기!
        </motion.button>
      </motion.div>
    </div>
  );
}
