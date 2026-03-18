import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Verse } from '../../types';
import { shuffle } from '../../utils/shuffle';
import { Star, PartyPopper } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-stone-800 mb-3 text-center leading-tight"
      >
        말씀을 순서대로<br />맞춰보세요!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-bold text-stone-500 mb-10"
      >
        {MINI_VERSE.reference}
      </motion.p>

      {/* Slots */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`w-full p-6 rounded-[2rem] shadow-sm border-4 mb-8 min-h-[80px] flex flex-wrap gap-3 justify-center content-center transition-colors duration-500 ${
          isSuccess ? 'bg-emerald-50/80 border-emerald-200' : 'bg-white/90 border-orange-100'
        }`}
      >
        {slots.map((item, i) => (
          <div
            key={`slot-${i}`}
            className="relative bg-stone-100/80 border-2 border-dashed border-stone-300 rounded-xl"
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
                className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-xl font-black transition-colors ${
                  isSuccess
                    ? 'bg-emerald-400 text-white border-b-4 border-emerald-600'
                    : 'bg-orange-400 text-white border-b-4 border-orange-600'
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
        className="flex flex-wrap gap-3 justify-center mb-8"
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
                className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-xl font-black shadow-sm bg-white/90 border-2 border-b-4 border-stone-200 text-stone-700 hover:border-orange-400 hover:text-orange-500 active:border-b-2 active:translate-y-1"
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
              className="bg-amber-400 text-amber-900 rounded-[3rem] w-52 h-52 flex flex-col items-center justify-center shadow-sm border-8 border-amber-200"
            >
              <PartyPopper size={56} className="mb-2" />
              <span className="text-2xl font-black">이렇게 쉬워요!</span>
              <span className="text-lg font-bold mt-1">말씀을 맞추며 배워봐요</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
