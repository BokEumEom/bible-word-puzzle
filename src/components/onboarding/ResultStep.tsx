import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Difficulty } from '../../types';
import { bibleIndex } from '../../data/bible';
import { BarChart3, BookOpen, Target, Sparkles } from 'lucide-react';

interface Props {
  level: Difficulty;
  interests: string[];
  dailyGoal: number;
  onComplete: () => void;
}

const levelLabels: Record<Difficulty, string> = {
  beginner: '🌱 이제 막 시작',
  easy: '🌿 주일학교 수준',
  normal: '🌳 매일 말씀 읽기',
};

export function ResultStep({ level, interests, dailyGoal, onComplete }: Props) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showCards, setShowCards] = useState(false);

  // Fake loading animation
  useEffect(() => {
    const duration = 2500;
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setProgress(Math.min((step / steps) * 100, 100));
      if (step >= steps) {
        clearInterval(timer);
        setLoading(false);
        setShowCards(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const interestNames = interests
    .map(id => bibleIndex.find(b => b.id === id)?.name)
    .filter(Boolean)
    .slice(0, 4)
    .join(', ');

  const cards = [
    { icon: BarChart3, label: '당신의 수준', value: levelLabels[level], color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
    { icon: BookOpen, label: '관심 성경', value: interestNames || '시편, 잠언, 창세기', color: 'bg-violet-100 border-violet-300 text-violet-800' },
    { icon: Target, label: '일일 목표', value: `하루 ${dailyGoal}구절`, color: 'bg-amber-100 border-amber-300 text-amber-800' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center w-full"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="mb-8"
            >
              <Sparkles size={48} className="text-orange-400" />
            </motion.div>
            <h2 className="text-2xl font-black text-stone-800 mb-8 text-center">
              맞춤 플랜 생성 중...
            </h2>
            <div className="w-full h-4 bg-stone-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-bold text-stone-400 mt-4">
              {progress < 40 ? '성경 데이터 분석 중...' : progress < 75 ? '맞춤 콘텐츠 준비 중...' : '거의 다 됐어요!'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center w-full"
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-black text-stone-800 mb-10 text-center leading-tight"
            >
              맞춤 플랜이<br />준비됐어요! ✨
            </motion.h2>

            <div className="w-full space-y-4 mb-12">
              {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.3, type: 'spring', stiffness: 200 }}
                    className={`w-full p-5 rounded-3xl border-2 border-b-6 ${card.color} flex items-center gap-4`}
                  >
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm">
                      <Icon size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-bold opacity-70">{card.label}</p>
                      <p className="text-xl font-black">{card.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
              className="btn-primary w-full py-5 text-2xl"
            >
              내 맞춤 말씀 시작하기!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
