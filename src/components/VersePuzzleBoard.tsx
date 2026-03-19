import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Verse } from '../types';
import { shuffle } from '../utils/shuffle';
import { useSound } from '../hooks/useSound';
import { vibrateShort, vibrateError, vibrateSuccess } from '../haptics/haptics';
import { ComboText } from './ComboText';
import { ConfettiBurst } from './ConfettiBurst';
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

      // Check if placed in correct position for combo
      const isCorrectPosition = item.text === verse.words[destIndex];
      if (isCorrectPosition) {
        const nextCombo = comboCount + 1;
        setComboCount(nextCombo);
        if (nextCombo >= 2) {
          play('combo', { pitchMultiplier: 1 + nextCombo * 0.15 });
          setShowCombo(true);
          clearTimeout(comboTimerRef.current);
          comboTimerRef.current = setTimeout(() => setShowCombo(false), 800);
        }
      } else {
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
      play('correct');
      vibrateSuccess();

      setTimeout(() => {
        setIsChecking(false);
        onCorrect({ usedHint: showHint });
      }, 2000);
    } else {
      setIsWrong(true);
      play('wrong');
      vibrateError();
      setTimeout(() => {
        setIsChecking(false);
        setIsWrong(false);
      }, 800);
    }
  };

  const allFilled = !slots.includes(null);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      {/* Reference & Hint */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-black text-stone-700 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border-2 border-orange-100 flex items-center gap-2">
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
            className="bg-amber-50/80 backdrop-blur-sm text-amber-800 p-4 rounded-2xl mb-4 text-lg border-2 border-amber-200 font-bold"
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
        animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`p-4 sm:p-6 rounded-[2rem] shadow-sm border-4 mb-6 sm:mb-8 min-h-[120px] sm:min-h-[150px] flex flex-wrap gap-2 sm:gap-3 content-start transition-colors duration-500 ${
          isSuccess ? 'bg-emerald-50/80 backdrop-blur-sm border-emerald-200' : 'bg-white/90 backdrop-blur-md border-orange-100'
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
                whileDrag={{ scale: 1.1, rotateY: 180, zIndex: 50 }}
                onDragEnd={(e, info) => handleDragEnd(e, info, item, 'slot', i)}
                initial={{ rotateY: 180, scale: 0.8 }}
                animate={{
                  rotateY: 0,
                  scale: isSuccess ? [1, 1.2, 1] : 1,
                  y: isSuccess ? [0, -15, 0] : 0,
                  boxShadow: lastPlacedSlot === i && !isSuccess
                    ? ['0 0 0 0 rgba(52,211,153,0)', '0 0 16px 4px rgba(52,211,153,0.5)', '0 0 0 0 rgba(52,211,153,0)']
                    : '0 0 0 0 rgba(52,211,153,0)',
                }}
                transition={isSuccess ? {
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: "easeOut",
                  times: [0, 0.5, 1]
                } : {
                  type: "spring",
                  stiffness: 250,
                  damping: 25
                }}
                onClick={() => handleSlotClick(item, i)}
                disabled={isSuccess}
                className={`
                  absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-base sm:text-xl font-black transition-colors cursor-grab active:cursor-grabbing
                  ${isSuccess 
                    ? 'bg-emerald-400 text-white shadow-sm border-b-4 border-emerald-600' 
                    : 'bg-orange-400 text-white shadow-sm border-b-4 border-orange-600 hover:bg-orange-500 hover:border-orange-700 active:border-b-0 active:translate-y-1'}
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
                whileDrag={{ scale: 1.1, rotateY: 180, zIndex: 50 }}
                onDragEnd={(e, info) => handleDragEnd(e, info, item, 'bank', i)}
                initial={{ rotateY: 180, scale: 0.8 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                disabled={isSuccess}
                onClick={() => handleBankClick(item, i)}
                className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-base sm:text-xl font-black shadow-sm transition-colors bg-white/90 backdrop-blur-sm border-2 border-b-4 border-stone-200 text-stone-700 hover:border-orange-400 hover:text-orange-500 active:border-b-2 active:translate-y-1 cursor-grab active:cursor-grabbing"
                style={{ transformStyle: 'preserve-3d', touchAction: 'none' }}
              >
                {item.text}
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* Check Button */}
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
              w-full py-4 rounded-[2rem] text-2xl font-black flex items-center justify-center gap-2 transition-all
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
            className="w-full py-4 rounded-[2rem] text-2xl font-black flex items-center justify-center gap-2 bg-emerald-500 text-white shadow-sm border-b-4 border-emerald-700"
          >
            <Check size={28} />
            정답입니다! ✨
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWrong && !isSuccess && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-500 font-black text-xl mt-4"
          >
            조금만 더 생각해 볼까요? 할 수 있어요!
          </motion.p>
        )}
      </AnimatePresence>

      <ConfettiBurst active={isSuccess} />

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 200 }}
              className="bg-amber-400 text-amber-900 rounded-[3rem] w-44 h-44 sm:w-56 sm:h-56 flex flex-col items-center justify-center shadow-sm border-8 border-amber-200 relative"
            >
              <Star size={72} fill="currentColor" className="mb-2" />
              <span className="text-3xl font-black">최고예요!</span>
              
              {/* Bursting small stars */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-amber-400"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    x: Math.cos(i * 45 * Math.PI / 180) * 180,
                    y: Math.sin(i * 45 * Math.PI / 180) * 180,
                    rotate: 180
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <Star size={32} fill="currentColor" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

