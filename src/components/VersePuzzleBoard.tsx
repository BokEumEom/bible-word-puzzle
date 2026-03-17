import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import confetti from 'canvas-confetti';
import { Verse } from '../types';
import { Check, Lightbulb, Star } from 'lucide-react';

interface WordItem {
  id: string;
  text: string;
}

interface Props {
  verse: Verse;
  onCorrect: () => void;
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

  // Initialize puzzle
  useEffect(() => {
    const items = verse.words.map((text, i) => ({ id: `word-${i}-${text}`, text }));
    setSlots(new Array(items.length).fill(null));
    // Shuffle words
    setBank([...items].sort(() => Math.random() - 0.5));
    setShowHint(false);
    setIsWrong(false);
    setIsSuccess(false);
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
      
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#facc15', '#4ade80', '#60a5fa', '#f87171', '#c084fc'],
        disableForReducedMotion: true
      });

      setTimeout(() => {
        setIsChecking(false);
        onCorrect();
      }, 2500); // Wait for animation to finish
    } else {
      setIsWrong(true);
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
        <h3 className="text-2xl font-bold text-gray-700 bg-white px-4 py-2 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center gap-2">
          {verse.reference}
          {onToggleFavorite && (
            <button 
              onClick={onToggleFavorite}
              className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="즐겨찾기"
            >
              <Star 
                size={24} 
                className={isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
              />
            </button>
          )}
        </h3>
        {verse.hint && (
          <button 
            onClick={() => setShowHint(!showHint)}
            className="bg-yellow-100 text-yellow-700 p-2 rounded-full hover:bg-yellow-200 transition-colors"
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
            className="bg-yellow-50 text-yellow-800 p-4 rounded-2xl mb-4 text-lg border-2 border-yellow-200"
          >
            💡 {verse.hint}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slots Area */}
      <motion.div 
        animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`p-6 rounded-3xl shadow-md border-4 mb-8 min-h-[150px] flex flex-wrap gap-3 content-start transition-colors duration-500 ${
          isSuccess ? 'bg-green-50 border-green-200' : 'bg-white border-blue-100'
        }`}
      >
        {slots.map((item, i) => (
          <div 
            key={`slot-bg-${i}`} 
            data-slot-index={i}
            className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center"
          >
            {/* Placeholder text - visible when empty, invisible when filled to maintain size */}
            <div className={`px-4 py-3 text-xl font-bold whitespace-nowrap ${item ? 'opacity-0 pointer-events-none' : 'text-gray-400'}`}>
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
                  scale: 1,
                  ...(isSuccess ? { 
                    scale: [1, 1.2, 1],
                    y: [0, -15, 0],
                  } : {})
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 250, 
                  damping: 25,
                  ...(isSuccess ? { duration: 0.5, delay: i * 0.1, ease: "easeOut" } : {})
                }}
                onClick={() => handleSlotClick(item, i)}
                disabled={isSuccess}
                className={`
                  absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-xl font-bold transition-colors cursor-grab active:cursor-grabbing
                  ${isSuccess 
                    ? 'bg-green-400 text-white shadow-md border-b-4 border-green-600' 
                    : 'bg-blue-400 text-white shadow-sm border-b-4 border-blue-600 hover:bg-blue-500 hover:border-blue-700 active:border-b-0 active:translate-y-1'}
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
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {bank.map((item, i) => (
          <div 
            key={`bank-bg-${i}`} 
            data-bank-index={i}
            className="relative rounded-xl"
          >
            {/* Invisible placeholder to maintain size */}
            <div className="px-4 py-3 text-xl font-bold opacity-0 pointer-events-none whitespace-nowrap">
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
                className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl text-xl font-bold shadow-sm transition-colors bg-white border-2 border-b-4 border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500 active:border-b-2 active:translate-y-1 cursor-grab active:cursor-grabbing"
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
              w-full py-4 rounded-2xl text-2xl font-bold flex items-center justify-center gap-2 transition-all
              ${allFilled 
                ? 'bg-green-500 text-white shadow-lg border-b-4 border-green-700 hover:bg-green-400' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
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
            className="w-full py-4 rounded-2xl text-2xl font-bold flex items-center justify-center gap-2 bg-yellow-400 text-yellow-900 shadow-lg border-b-4 border-yellow-600"
          >
            🎉 참 잘했어요! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWrong && !isSuccess && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-500 font-bold text-xl mt-4"
          >
            조금만 더 생각해 볼까요? 할 수 있어요!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

