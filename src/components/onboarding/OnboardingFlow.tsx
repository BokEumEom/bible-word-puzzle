import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Difficulty, OnboardingProfile } from '../../types';
import { IntroStep } from './IntroStep';
import { LevelStep } from './LevelStep';
import { MiniPuzzleStep } from './MiniPuzzleStep';
import { InterestStep } from './InterestStep';
import { GoalStep } from './GoalStep';
import { ResultStep } from './ResultStep';
import { X } from 'lucide-react';

type Step = 'intro' | 'puzzle' | 'level' | 'interest' | 'goal' | 'result';

interface Props {
  onComplete: (profile: OnboardingProfile, dailyGoal: number) => void;
  onSkip?: () => void;
}

function getStepIndex(step: Step): { current: number; total: number } {
  const allSteps: Step[] = ['intro', 'puzzle', 'level', 'interest', 'goal', 'result'];
  return { current: allSteps.indexOf(step), total: allSteps.length };
}

export function OnboardingFlow({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [level, setLevel] = useState<Difficulty>('beginner');
  const [interests, setInterests] = useState<string[]>([]);
  const [dailyGoal, setDailyGoal] = useState(3);

  const { current, total } = getStepIndex(step);

  const handleStart = () => {
    setStep('puzzle');
  };

  const handleLevelSelect = (selected: Difficulty) => {
    setLevel(selected);
    setStep('interest');
  };

  const handlePuzzleComplete = () => {
    setStep('level');
  };

  const handleInterestSelect = (selected: string[]) => {
    setInterests(selected);
    setStep('goal');
  };

  const handleGoalSelect = (goal: number) => {
    setDailyGoal(goal);
    setStep('result');
  };

  const handleComplete = () => {
    onComplete(
      { level, interests, onboardingCompleted: true },
      dailyGoal,
    );
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Progress dots + close button */}
      <div className="fixed top-6 left-0 right-0 z-30 flex items-center justify-center px-6">
        {onSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSkip}
            className="absolute left-6 p-2 bg-white rounded-full shadow-sm border-2 border-orange-100 hover:bg-orange-50 transition-colors"
            aria-label="닫기"
          >
            <X size={20} className="text-stone-400" />
          </motion.button>
        )}
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i <= current ? 'bg-orange-400' : 'bg-stone-300'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <IntroStep onStart={handleStart} />
          </motion.div>
        )}

        {step === 'puzzle' && (
          <motion.div key="puzzle" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <MiniPuzzleStep onComplete={handlePuzzleComplete} />
          </motion.div>
        )}

        {step === 'level' && (
          <motion.div key="level" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <LevelStep onSelect={handleLevelSelect} />
          </motion.div>
        )}

        {step === 'interest' && (
          <motion.div key="interest" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <InterestStep level={level} onSelect={handleInterestSelect} />
          </motion.div>
        )}

        {step === 'goal' && (
          <motion.div key="goal" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <GoalStep onSelect={handleGoalSelect} />
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <ResultStep
              level={level}
              interests={interests}
              dailyGoal={dailyGoal}
              onComplete={handleComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
