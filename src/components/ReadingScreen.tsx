import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Verse } from '../types';
import { ChevronLeft, Volume2 } from 'lucide-react';

interface Props {
  verse: Verse;
  onBack: () => void;
}

export function ReadingScreen({ verse, onBack }: Props) {
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${verse.reference}. ${verse.verse}`);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen max-w-md mx-auto bg-stone-50"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 pt-6">
        <button
          onClick={onBack}
          className="p-3 bg-white rounded-full shadow-sm hover:bg-white border-2 border-stone-200 transition-colors"
        >
          <ChevronLeft size={28} className="text-stone-500" />
        </button>
        <button
          onClick={handleReadAloud}
          className="p-3 bg-white rounded-full shadow-sm hover:bg-white border-2 border-stone-200 transition-colors"
        >
          <Volume2 size={24} className="text-stone-500" />
        </button>
      </div>

      {/* Reading Content */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12">
        {/* Reference */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm font-bold tracking-widest uppercase text-stone-400 mb-6"
        >
          {verse.reference}
        </motion.p>

        {/* Verse Text — editorial typography */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          {/* Decorative quotation mark */}
          <span className="absolute -top-8 -left-2 text-7xl font-serif text-stone-200 select-none leading-none">
            &ldquo;
          </span>

          <p
            className="text-2xl leading-[1.9] text-stone-800 font-medium break-keep"
            style={{ fontFamily: '"Noto Serif KR", serif', wordBreak: 'keep-all' }}
          >
            {verse.verse}
          </p>

          <span className="absolute -bottom-4 right-0 text-7xl font-serif text-stone-200 select-none leading-none">
            &rdquo;
          </span>
        </motion.blockquote>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="h-px bg-stone-200 mt-10 mb-6 origin-left"
        />

        {/* Hint / Context */}
        {verse.hint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base text-stone-400 font-medium italic"
          >
            {verse.hint}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
