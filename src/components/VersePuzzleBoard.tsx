import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Verse } from '../types';
import { shuffle } from '../utils/shuffle';
import { useSound } from '../hooks/useSound';
import { vibrateShort, vibrateError, vibrateSuccess } from '../haptics/haptics';
import { ComboText } from './ComboText';
import { ConfettiBurst } from './ConfettiBurst';
import { BottomFeedbackSheet } from './BottomFeedbackSheet';
import { Check, Lightbulb, Star } from 'lucide-react';

interface WordItem {
  id: string;
  text: string;
}

interface Props {
  verse: Verse;
  onCorrect: (options?: { usedHint?: boolean }) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function VersePuzzleBoard({ verse, onCorrect, isFavorite, onToggleFavorite }: Props) {
  const [slots, setSlots] = useState<(WordItem | null)[]>([]);
  const [bank, setBank] = useState<(WordItem | null)[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [lastPlacedSlot, setLastPlacedSlot] = useState<number | null>(null);
  const [correctSlots, setCorrectSlots] = useState<Set<number>>(new Set());
  const [wrongSlots, setWrongSlots] = useState<Set<number>>(new Set());
  const [revealedSlots, setRevealedSlots] = useState<Set<number>>(new Set());
  const [showStarBurst, setShowStarBurst] = useState(false);
  const [correctPositionCount, setCorrectPositionCount] = useState<number | null>(null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<'correct' | 'wrong'>('correct');
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { play } = useSound();

  // Initialize puzzle
  useEffect(() => {
    const items = verse.words.map((text, i) => ({ id: `word-${i}-${text}`, text }));
    setSlots(new Array(items.length).fill(null));
    // Shuffle words
    setBank(shuffle(items));
    setShowHint(false);
    setIsWrong(false);
    setIsSuccess(false);
    setComboCount(0);
    setShowCombo(false);
    setLastPlacedSlot(null);
    setCorrectSlots(new Set());
    setWrongSlots(new Set());
    setRevealedSlots(new Set());
    setShowStarBurst(false);
    setCorrectPositionCount(null);
    setShowBottomSheet(false);
    setBottomSheetType('correct');
  }, [verse]);

  const moveItem = (item: WordItem, source: 'bank' | 'slot', sourceIndex: number, dest: 'bank' | 'slot', destIndex: number) => {
    if (source === dest && sourceIndex === destIndex) return;

    const newSlots = [...slots];
    const newBank = [...bank];

    // Get the item currently at the destination (if any)
    const destItem = dest === 'slot' ? newSlots[destIndex] : newBank[destIndex];

    // Set the destination to the dragged item
    if (dest === 'slot') newSlots[destIndex] = item;
    else newBank[destIndex] = item;

    // Set the source to the displaced item (swap)
    if (source === 'slot') newSlots[sourceIndex] = destItem;
    else newBank[sourceIndex] = destItem;

    setSlots(newSlots);
    setBank(newBank);
    setIsWrong(false);

    // Sound + combo tracking when placing into a slot
    if (dest === 'slot') {
      play('word-place');
      vibrateShort();
      setLastPlacedSlot(destIndex);

      // Check if placed in correct position for combo + visual feedback
      const isCorrectPosition = item.text === verse.words[destIndex];
      if (isCorrectPosition) {
        setCorrectSlots(prev => new Set([...prev, destIndex]));
        const nextCombo = comboCount + 1;
        setComboCount(nextCombo);
        if (nextCombo >= 2) {
          play('combo', { pitchMultiplier: 1 + nextCombo * 0.15 });
          setShowCombo(true);
          clearTimeout(comboTimerRef.current);
          comboTimerRef.current = setTimeout(() => setShowCombo(false), 800);
        }
      } else {
        setCorrectSlots(prev => {
          const next = new Set(prev);
          next.delete(destIndex);
          return next;
        });
        setComboCount(0);
        setShowCombo(false);
      }
    }
  };

  const handleDragEnd = (event: any, info: PanInfo, item: WordItem, source: 'bank' | 'slot', sourceIndex: number) => {
    // Temporarily hide the dragged button to find the element underneath
    const target = event.target as HTMLElement;
    const btn = target?.closest ? target.closest('button') : null;
    if (btn) btn.style.visibility = 'hidden';
    
    const elementUnder = document.elementFromPoint(info.point.x, info.point.y);
    
    if (btn) btn.style.visibility = 'visible';

    const slotElement = elementUnder?.closest('[data-slot-index]');
    const bankElement = elementUnder?.closest('[data-bank-index]');

    if (slotElement) {
      const targetIndex = parseInt(slotElement.getAttribute('data-slot-index')!, 10);
      moveItem(item, source, sourceIndex, 'slot', targetIndex);
    } else if (bankElement) {
      const targetIndex = parseInt(bankElement.getAttribute('data-bank-index')!, 10);
      moveItem(item, source, sourceIndex, 'bank', targetIndex);
    }
  };

  const handleBankClick = (item: WordItem, index: number) => {
    if (isSuccess) return;
    const emptySlotIndex = slots.findIndex(s => s === null);
    if (emptySlotIndex === -1) return; // No empty slots
    moveItem(item, 'bank', index, 'slot', emptySlotIndex);
  };

  const handleSlotClick = (item: WordItem, index: number) => {
    if (isSuccess) return;
    const emptyBankIndex = bank.findIndex(w => w === null);
    if (emptyBankIndex !== -1) {
      moveItem(item, 'slot', index, 'bank', emptyBankIndex);
    } else {
      // If bank is somehow full (shouldn't happen), just append
      const newBank = [...bank, item];
      const newSlots = [...slots];
      newSlots[index] = null;
      setBank(newBank);
      setSlots(newSlots);
      setIsWrong(false);
    }
  };

  const checkAnswer = () => {
    if (slots.includes(null)) return;
    
    setIsChecking(true);
    const currentAnswer = slots.map(s => s?.text).join(' ');
    const correctAnswer = verse.words.join(' ');

    if (currentAnswer === correctAnswer) {
      setIsSuccess(true);

      // Sequential reveal: each slot lights up with ascending pitch
      const totalSlots = slots.length;
      const stepDelay = 150; // ms between each slot reveal
      for (let idx = 0; idx < totalSlots; idx++) {
        setTimeout(() => {
          setRevealedSlots(prev => new Set([...prev, idx]));
          // Ascending pitch: C5 → up by major scale steps
          const pitchStep = 1 + idx * 0.08;
          play('reveal-step', { pitchMultiplier: pitchStep });
          vibrateShort();
        }, idx * stepDelay);
      }

      // After all slots revealed, play the final fanfare + show bottom sheet
      const revealDuration = totalSlots * stepDelay;
      setTimeout(() => {
        play('correct');
        vibrateSuccess();
        setShowStarBurst(true);
      }, revealDuration + 100);

      setTimeout(() => {
        setIsChecking(false);
        setBottomSheetType('correct');
        setShowBottomSheet(true);
      }, revealDuration + 800);
    } else {
      setIsWrong(true);
      play('wrong');
      vibrateError();
      // Mark individual wrong slots AND count correct positions
      const wrong = new Set<number>();
      let correctCount = 0;
      slots.forEach((s, i) => {
        if (s && s.text !== verse.words[i]) {
          wrong.add(i);
        } else if (s) {
          correctCount++;
        }
      });
      setWrongSlots(wrong);
      setCorrectPositionCount(correctCount);
      setTimeout(() => {
        setIsChecking(false);
        setBottomSheetType('wrong');
        setShowBottomSheet(true);
      }, 600);
    }
  };

  const handleBottomSheetContinue = () => {
    setShowBottomSheet(false);
    if (bottomSheetType === 'correct') {
      onCorrect({ usedHint: showHint });
    } else {
      // Dismiss wrong state and let user try again
      setIsWrong(false);
      setWrongSlots(new Set());
      setCorrectPositionCount(null);
    }
  };

  const allFilled = !slots.includes(null);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      {/* Reference & Hint */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-black text-stone-700 bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-orange-100 flex items-center gap-2">
          {verse.reference}
          {onToggleFavorite && (
            <button 
              onClick={onToggleFavorite}
              className="ml-2 p-1 rounded-full hover:bg-orange-50 transition-colors"
              aria-label="즐겨찾기"
            >
              <Star 
                size={24} 
                className={isFavorite ? "text-amber-400 fill-amber-400" : "text-stone-300"} 
              />
            </button>
          )}
        </h3>
        {verse.hint && (
          <button 
            onClick={() => setShowHint(!showHint)}
            className="bg-amber-100 text-amber-700 p-2 rounded-full hover:bg-amber-200 transition-colors shadow-sm"
          >
            <Lightbulb size={24} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showHint && verse.hint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-amber-50 text-amber-800 p-4 rounded-2xl mb-4 text-lg border-2 border-amber-200 font-bold"
          >
            💡 {verse.hint}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combo Text */}
      <div className="relative">
        <ComboText comboCount={comboCount} show={showCombo} />
      </div>

      {/* Slots Area */}
      <motion.div
        animate={isWrong ? { x: [-4, 4, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`p-4 sm:p-6 rounded-3xl shadow-sm border-4 mb-6 sm:mb-8 min-h-[120px] sm:min-h-[150px] flex flex-wrap gap-2 sm:gap-3 content-start transition-colors duration-500 ${
          isSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-orange-100'
        }`}
      >
        {slots.map((item, i) => (
          <div 
            key={`slot-bg-${i}`} 
            data-slot-index={i}
            className="relative bg-stone-100/80 border-2 border-dashed border-stone-300 rounded-xl flex items-center justify-center"
          >
            {/* Placeholder text - visible when empty, invisible when filled to maintain size */}
            <div className={`px-3 py-2.5 sm:px-4 sm:py-3 text-base sm:text-xl font-black whitespace-nowrap ${item ? 'opacity-0 pointer-events-none' : 'text-stone-400'}`}>
              {item ? item.text : '빈칸'}
            </div>
            
            {item && (
              <motion.button
                layoutId={item.id}
                drag={!isSuccess}
                dragSnapToOrigin
                whileDrag={{ scale: 1.15, rotateY: 180, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                whileTap={!isSuccess ? { scale: 0.92, transition: { duration: 0.08 } } : {}}
                onDragEnd={(e, info) => handleDragEnd(e, info, item, 'slot', i)}
                initial={{ rotateY: 180, scale: 0.8 }}
                animate={{
                  rotateY: 0,
                  scale: revealedSlots.has(i) ? [1, 1.25, 1] : (wrongSlots.has(i) ? [1, 1.05, 0.95, 1.03, 0.97, 1] : 1),
                  x: wrongSlots.has(i) ? [0, -6, 6, -4, 4, 0] : 0,
                  y: revealedSlots.has(i) ? [0, -18, 0] : 0,
                  boxShadow: revealedSlots.has(i)
                    ? ['0 0 0 0 rgba(52,211,153,0)', '0 0 16px 6px rgba(52,211,153,0.7)', '0 0 4px 2px rgba(52,211,153,0.3)']
                    : correctSlots.has(i) && !isSuccess
                      ? ['0 0 0 0 rgba(52,211,153,0)', '0 0 12px 4px rgba(52,211,153,0.6)', '0 0 0 0 rgba(52,211,153,0)']
                      : lastPlacedSlot === i && !isSuccess
                        ? ['0 0 0 0 rgba(251,146,60,0)', '0 0 12px 3px rgba(251,146,60,0.4)', '0 0 0 0 rgba(251,146,60,0)']
                        : '0 0 0 0 rgba(0,0,0,0)',
                }}
                transition={revealedSlots.has(i) ? {
                  duration: 0.4,
                  ease: "easeOut",
                  times: [0, 0.4, 1]
                } : wrongSlots.has(i) ? {
                  duration: 0.4,
                  ease: "easeInOut"
                } : {
                  type: "spring",
                  stiffness: 250,
                  damping: 25
                }}
                onClick={() => handleSlotClick(item, i)}
                disabled={isSuccess}
                className={`
                  absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-base sm:text-xl font-black transition-colors cursor-grab active:cursor-grabbing
                  ${revealedSlots.has(i)
                    ? 'bg-emerald-400 text-white shadow-[0_4px_0_var(--color-emerald-600)]'
                    : wrongSlots.has(i)
                      ? 'bg-amber-400 text-white shadow-[0_4px_0_var(--color-amber-600)]'
                      : correctSlots.has(i) && !isSuccess
                        ? 'bg-emerald-400 text-white shadow-[0_4px_0_var(--color-emerald-600)]'
                        : isSuccess
                          ? 'bg-orange-400 text-white shadow-[0_4px_0_var(--color-orange-600)]'
                          : 'bg-orange-400 text-white shadow-[0_4px_0_var(--color-orange-600)] hover:bg-orange-500 active:shadow-none active:translate-y-1'}
                `}
                style={{ transformStyle: 'preserve-3d', touchAction: 'none' }}
              >
                {item.text}
              </motion.button>
            )}
          </div>
        ))}
      </motion.div>

      {/* Word Bank */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8">
        {bank.map((item, i) => (
          <div 
            key={`bank-bg-${i}`} 
            data-bank-index={i}
            className="relative rounded-xl"
          >
            {/* Invisible placeholder to maintain size */}
            <div className="px-3 py-2.5 sm:px-4 sm:py-3 text-base sm:text-xl font-black opacity-0 pointer-events-none whitespace-nowrap">
              {item ? item.text : '빈칸'}
            </div>

            {item && (
              <motion.button
                layoutId={item.id}
                drag={!isSuccess}
                dragSnapToOrigin
                whileDrag={{ scale: 1.15, rotateY: 180, zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.92, transition: { duration: 0.08 } }}
                onDragEnd={(e, info) => handleDragEnd(e, info, item, 'bank', i)}
                initial={{ rotateY: 180, scale: 0.8 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                disabled={isSuccess}
                onClick={() => handleBankClick(item, i)}
                className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-base sm:text-xl font-black transition-colors bg-white border-2 border-stone-200 shadow-[0_4px_0_var(--color-stone-200)] text-stone-700 hover:border-orange-400 hover:text-orange-500 active:shadow-none active:translate-y-1 cursor-grab active:cursor-grabbing"
                style={{ transformStyle: 'preserve-3d', touchAction: 'none' }}
              >
                {item.text}
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* Check Button — hidden when bottom sheet is showing */}
      {!showBottomSheet && (
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.button
              key="check-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={allFilled ? { scale: 1.05 } : {}}
              whileTap={allFilled ? { scale: 0.95 } : {}}
              onClick={checkAnswer}
              disabled={!allFilled || isChecking}
              className={`
                w-full py-4 rounded-full text-2xl font-black flex items-center justify-center gap-2 transition-all
                ${allFilled
                  ? 'btn-primary'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'}
              `}
            >
              <Check size={28} />
              정답 확인하기
            </motion.button>
          ) : (
            <motion.div
              key="success-msg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full py-4 rounded-full text-2xl font-black flex items-center justify-center gap-2 bg-emerald-500 text-white shadow-[0_4px_0_var(--color-emerald-700)]"
            >
              <Check size={28} />
              정답이에요!
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <ConfettiBurst active={showStarBurst} />

      {/* Duolingo-style bottom feedback sheet */}
      <BottomFeedbackSheet
        type={bottomSheetType}
        show={showBottomSheet}
        correctCount={correctPositionCount ?? undefined}
        totalCount={slots.length}
        onContinue={handleBottomSheetContinue}
      />
    </div>
  );
}

