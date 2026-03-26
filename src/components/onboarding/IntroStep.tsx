import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export function IntroStep({ onStart }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-32 pt-16">
      <div className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-[radial-gradient(circle_at_center,_rgba(254,240,138,0.42),_rgba(255,255,255,0))]" />

      <div className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-black text-orange-500 shadow-sm ring-1 ring-orange-100"
        >
          말씀 퍼즐
        </motion.div>

        <motion.div
          data-testid="intro-hero"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mb-8 flex h-52 w-52 items-center justify-center"
        >
          <div className="absolute h-40 w-40 rounded-[48%] bg-gradient-to-br from-lime-100 via-amber-50 to-white blur-xl" />
          <img
            src="/joy-excited.png"
            alt="JOY 캐릭터"
            className="relative h-44 w-44 object-contain drop-shadow-[0_18px_24px_rgba(245,158,11,0.2)]"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 text-4xl font-black leading-tight tracking-[-0.02em] text-stone-900"
        >
          하루 3분,
          <br />
          말씀을 읽고 외우고 풀어요
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-auto max-w-sm text-base font-bold leading-relaxed text-stone-500"
        >
          첫 퍼즐로 바로 시작하고,
          <br />
          그다음에 나에게 맞는 말씀 루트를 고르게 해드릴게요.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-sm font-black text-stone-400"
        >
          첫 문제부터 바로 체험해보세요
        </motion.p>
      </div>

      <div
        data-testid="intro-fixed-cta"
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#FFE0B2] via-[#FFEFD6] to-transparent px-6 pb-8 pt-10"
      >
        <div className="mx-auto max-w-md">
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="btn-primary flex w-full items-center justify-center gap-2 py-4 text-xl"
          >
            지금 시작하기
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
