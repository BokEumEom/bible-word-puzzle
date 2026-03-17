import { motion } from 'motion/react';
import { Verse } from '../types';
import { ChevronLeft, Volume2 } from 'lucide-react';

interface Props {
  verse: Verse;
  onBack: () => void;
}

export function ReadingScreen({ verse, onBack }: Props) {
  // Simple TTS fallback (if supported by browser)
  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${verse.reference}. ${verse.verse}`);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8; // Slower for kids
      window.speechSynthesis.speak(utterance);
    } else {
      alert('음성 읽기를 지원하지 않는 브라우저입니다.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col min-h-screen p-6 max-w-md mx-auto pt-12"
    >
      <div className="flex items-center mb-12">
        <button 
          onClick={onBack}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white border-2 border-orange-100 transition-colors"
        >
          <ChevronLeft size={32} className="text-orange-500" />
        </button>
        <div className="flex-1" />
        <button 
          onClick={handleReadAloud}
          className="p-3 bg-amber-400 rounded-full shadow-sm hover:bg-amber-500 border-2 border-amber-500 text-white transition-colors"
        >
          <Volume2 size={32} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border-4 border-emerald-200 w-full relative"
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-emerald-400 text-white px-6 py-2 rounded-full font-black text-2xl shadow-sm border-2 border-emerald-500 whitespace-nowrap">
            {verse.reference}
          </div>
          
          <p className="text-4xl leading-relaxed text-stone-800 mt-8 font-black break-keep">
            {verse.verse}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
