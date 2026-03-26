import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Verse } from '../../types';
import { shuffle } from '../../utils/shuffle';
import { BookOpen, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const MINI_VERSE: Verse = {
  id: 'onboarding-mini',
  reference: '데살로니가전서 5:17',
  verse: '쉬지 말고 기도하라',
  words: ['쉬지', '말고', '기도하라'],
};

interface WordItem {
  id: string;
  text: string;
}

export function MiniPuzzleStep({ onComplete }: Props) {
  const items = MINI_VERSE.words.map((text, i) => ({ id: `w-${i}`, text }));
  const [bank, setBank] = useState<(WordItem | null)[]>(() => shuffle([...items]));
  const [slots, setSlots] = useState<(WordItem | null)[]>(new Array(items.length).fill(null));
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBankClick = (item: WordItem, bankIndex: number) => {
    if (isSuccess) return;
    const emptySlot = slots.findIndex(s => s === null);
    if (emptySlot === -1) return;

    const newSlots = [...slots];
    newSlots[emptySlot] = item;
    const newBank = [...bank];
    newBank[bankIndex] = null;
    setSlots(newSlots);
    setBank(newBank);

    // Check answer when all slots filled
    const filledSlots = newSlots.filter(Boolean);
    if (filledSlots.length === items.length) {
      const answer = newSlots.map(s => s?.text).join(' ');
      if (answer === MINI_VERSE.words.join(' ')) {
        setIsSuccess(true);
        setTimeout(onComplete, 2500);
      } else {
        // Wrong — reset after shake
        setTimeout(() => {
          setSlots(new Array(items.length).fill(null));
          setBank(shuffle([...items]));
        }, 600);
      }
    }
  };

  const handleSlotClick = (item: WordItem, slotIndex: number) => {
    if (isSuccess) return;
    const emptyBank = bank.findIndex(w => w === null);
    if (emptyBank === -1) return;
    const newBank = [...bank];
    newBank[emptyBank] = item;
    const newSlots = [...slots];
    newSlots[slotIndex] = null;
    setSlots(newSlots);
    setBank(newBank);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-orange-500 shadow-sm ring-1 ring-orange-100"
      >
        <Sparkles size={16} />
        첫 퍼즐
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-5 flex w-full items-center gap-3 rounded-[1.75rem] border border-stone-200 bg-white px-4 py-3 shadow-sm"
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.5rem] bg-lime-50">
          <img
            src="/joy-focused.png"
            alt="JOY 도우미 캐릭터"
            className="h-16 w-16 scale-[1.25] object-contain"
          />
        </div>
        <p className="text-sm font-black leading-relaxed text-stone-600">
          단어를 순서대로 눌러서
          <br />
          첫 성공을 만들어볼까요?
        </p>
      </motion.div>

      <motion.h2
        data-testid="mini-puzzle-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-center text-2xl font-black leading-tight text-stone-900"
      >
        말씀을 순서대로<br />맞춰보세요!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-black text-stone-500 shadow-sm ring-1 ring-stone-200"
      >
        <BookOpen size={16} className="text-violet-500" />
        {MINI_VERSE.reference}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8 text-center text-sm font-bold text-stone-500"
      >
        아래 단어를 눌러 위 칸을 채워보세요.
      </motion.p>

      {/* Slots */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mb-6 flex min-h-[104px] w-full flex-wrap content-center justify-center gap-3 rounded-[2rem] border p-6 shadow-sm transition-colors duration-500 ${
          isSuccess ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 bg-white'
        }`}
      >
        {slots.map((item, i) => (
          <div
            key={`slot-${i}`}
            className="relative rounded-2xl border-2 border-dashed border-stone-300 bg-stone-100"
          >
            <div className={`px-4 py-3 text-xl font-black whitespace-nowrap ${item ? 'opacity-0' : 'text-stone-400'}`}>
              {item ? item.text : '?'}
            </div>
            {item && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{
                  scale: isSuccess ? [1, 1.2, 1] : 1,
                  y: isSuccess ? [0, -10, 0] : 0,
                }}
                transition={isSuccess ? { duration: 0.5, delay: i * 0.1 } : { type: 'spring', stiffness: 250 }}
                onClick={() => handleSlotClick(item, i)}
                disabled={isSuccess}
                className={`absolute inset-0 flex h-full w-full items-center justify-center rounded-2xl text-xl font-black transition-colors ${
                  isSuccess
                    ? 'bg-emerald-400 text-white shadow-[0_4px_0_var(--color-emerald-600)]'
                    : 'bg-orange-400 text-white shadow-[0_4px_0_var(--color-orange-600)]'
                }`}
                style={{ touchAction: 'none' }}
              >
                {item.text}
              </motion.button>
            )}
          </div>
        ))}
      </motion.div>

      {/* Bank */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex w-full flex-wrap justify-center gap-3 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm"
      >
        {bank.map((item, i) => (
          <div key={`bank-${i}`} className="relative rounded-xl">
            <div className="px-4 py-3 text-xl font-black opacity-0 pointer-events-none whitespace-nowrap">
              {item ? item.text : '?'}
            </div>
            {item && (
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 250 }}
                onClick={() => handleBankClick(item, i)}
                disabled={isSuccess}
                className="absolute inset-0 flex h-full w-full items-center justify-center rounded-xl border-2 border-stone-200 bg-white text-xl font-black text-stone-700 shadow-[0_4px_0_var(--color-stone-200)] hover:border-orange-400 hover:text-orange-500 active:translate-y-1"
                style={{ touchAction: 'none' }}
              >
                {item.text}
              </motion.button>
            )}
          </div>
        ))}
      </motion.div>

      {/* Success overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="flex flex-col items-center justify-center rounded-[2rem] border border-amber-100 bg-white px-9 py-8 text-center text-amber-900 shadow-[0_16px_40px_rgba(245,158,11,0.18)]"
            >
              <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-lime-100 via-amber-50 to-white">
                <img
                  src="/joy-happy.png"
                  alt="성공한 JOY 캐릭터"
                  className="h-28 w-28 scale-[1.2] object-contain"
                />
              </div>
              <span className="text-xl font-black">이렇게 쉬워요!</span>
              <span className="mt-1 text-base font-bold">말씀을 맞추며 배워봐요</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
