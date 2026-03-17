import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Verse } from '../types';
import { ChevronLeft, RotateCcw } from 'lucide-react';

interface Props {
  verse: Verse;
  onBack: () => void;
}

export function MemorizeScreen({ verse, onBack }: Props) {
  const [hiddenWords, setHiddenWords] = useState<boolean[]>([]);

  useEffect(() => {
    setHiddenWords(new Array(verse.words.length).fill(false));
  }, [verse]);

  const toggleWord = (index: number) => {
    const newHidden = [...hiddenWords];
    newHidden[index] = !newHidden[index];
    setHiddenWords(newHidden);
  };

  const reset = () => {
    setHiddenWords(new Array(verse.words.length).fill(false));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-screen p-6 max-w-md mx-auto pt-12"
    >
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 border-2 border-gray-100"
        >
          <ChevronLeft size={32} className="text-gray-600" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 ml-4 flex-1 text-center">
          말씀 외우기
        </h2>
        <button 
          onClick={reset}
          className="p-3 bg-blue-100 rounded-full shadow-md hover:bg-blue-200 border-2 border-blue-300 text-blue-600"
        >
          <RotateCcw size={28} />
        </button>
      </div>

      <div className="bg-yellow-50 text-yellow-800 p-4 rounded-2xl mb-8 text-xl border-2 border-yellow-200 text-center font-bold">
        가리고 싶은 단어를 콕콕 눌러보세요!
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-yellow-300 w-full relative mb-8">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-800 px-6 py-2 rounded-full font-bold text-2xl shadow-md border-2 border-yellow-500 whitespace-nowrap">
          {verse.reference}
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {verse.words.map((word, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleWord(index)}
              className={`
                px-4 py-3 rounded-xl text-2xl font-bold transition-all
                ${hiddenWords[index] 
                  ? 'bg-gray-200 text-transparent border-2 border-dashed border-gray-400 min-w-[80px]' 
                  : 'bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm'}
              `}
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
