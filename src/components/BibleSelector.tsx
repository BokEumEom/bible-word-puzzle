import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BibleBook, BibleChapter, BibleVerse, Verse } from '../types';
import { bibleData } from '../data/bible';
import { Book, ChevronLeft, ChevronRight, List, CheckCircle2 } from 'lucide-react';

interface Props {
  onSelect: (verse: Verse) => void;
  onBack: () => void;
  completedVerses?: Record<string, number>;
}

type Step = 'book' | 'chapter' | 'verse';

export function BibleSelector({ onSelect, onBack, completedVerses = {} }: Props) {
  const [step, setStep] = useState<Step>('book');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BibleChapter | null>(null);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setStep('chapter');
  };

  const handleChapterSelect = (chapter: BibleChapter) => {
    setSelectedChapter(chapter);
    setStep('verse');
  };

  const handleVerseSelect = (verse: BibleVerse) => {
    if (!selectedBook || !selectedChapter) return;
    
    const words = verse.text.split(' ').filter(w => w.length > 0);
    
    const chapterUnit = selectedBook.name === '시편' ? '편' : '장';
    
    const gameVerse: Verse = {
      id: `${selectedBook.id}-${selectedChapter.chapter}-${verse.verse}`,
      reference: `${selectedBook.name} ${selectedChapter.chapter}${chapterUnit} ${verse.verse}절`,
      verse: verse.text,
      words: words,
      hint: '말씀을 잘 읽고 맞춰보아요!',
    };
    
    onSelect(gameVerse);
  };

  const handleGlobalBack = () => {
    if (step === 'verse') setStep('chapter');
    else if (step === 'chapter') setStep('book');
    else onBack();
  };

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-8 pb-20">
      <div className="flex items-center mb-6 sticky top-0 z-10 py-2 bg-[#fdfbf7]">
        <button 
          onClick={handleGlobalBack}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border-2 border-gray-100"
        >
          <ChevronLeft size={32} className="text-gray-600" />
        </button>
        <h2 className="text-3xl font-bold text-gray-800 ml-4 flex-1 text-center">
          성경 찾기
        </h2>
        <div className="w-12" /> {/* Spacer for centering */}
      </div>

      <AnimatePresence mode="wait">
        {step === 'book' && (
          <motion.div 
            key="book"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl mb-2 text-xl border-2 border-blue-200 text-center font-bold">
              어떤 성경을 읽을까요?
            </div>
            <div className="grid grid-cols-2 gap-4">
              {bibleData.map((book) => (
                <motion.button
                  key={book.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBookSelect(book)}
                  className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-gray-200 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="p-3 bg-blue-100 text-blue-500 rounded-full">
                    <Book size={32} />
                  </div>
                  <span className="text-2xl font-bold text-gray-700">{book.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'chapter' && selectedBook && (
          <motion.div 
            key="chapter"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('book')}
              className="flex items-center gap-2 bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-lg"
            >
              <ChevronLeft size={24} />
              다른 성경 고르기 (뒤로가기)
            </motion.button>

            <div className="bg-green-50 text-green-800 p-4 rounded-2xl mb-2 text-xl border-2 border-green-200 text-center font-bold flex items-center justify-center gap-2">
              <Book size={24} />
              {selectedBook.name} 몇 {selectedBook.name === '시편' ? '편' : '장'}을 읽을까요?
            </div>

            <div className="grid grid-cols-4 gap-3">
              {selectedBook.chapters.map((chapter) => (
                <motion.button
                  key={chapter.chapter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChapterSelect(chapter)}
                  className="bg-white p-4 rounded-2xl shadow-sm border-b-4 border-green-200 text-2xl font-bold text-green-700 hover:bg-green-50 hover:border-green-400 transition-colors"
                >
                  {chapter.chapter}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'verse' && selectedBook && selectedChapter && (
          <motion.div 
            key="verse"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('chapter')}
              className="flex items-center gap-2 bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-lg"
            >
              <ChevronLeft size={24} />
              다른 {selectedBook.name === '시편' ? '편' : '장'} 고르기 (뒤로가기)
            </motion.button>

            {(() => {
              const currentIndex = selectedBook.chapters.findIndex(c => c.chapter === selectedChapter.chapter);
              const prevChapter = currentIndex > 0 ? selectedBook.chapters[currentIndex - 1] : null;
              const nextChapter = currentIndex < selectedBook.chapters.length - 1 ? selectedBook.chapters[currentIndex + 1] : null;
              const chapterUnit = selectedBook.name === '시편' ? '편' : '장';

              return (
                <div className="bg-yellow-50 text-yellow-800 p-2 rounded-2xl mb-2 text-xl border-2 border-yellow-200 font-bold flex items-center justify-between shadow-sm">
                  <button
                    onClick={() => prevChapter && setSelectedChapter(prevChapter)}
                    disabled={!prevChapter}
                    className={`p-2 rounded-full transition-colors ${prevChapter ? 'hover:bg-yellow-200 text-yellow-700 active:scale-95' : 'opacity-30 cursor-not-allowed'}`}
                    aria-label={`이전 ${chapterUnit}`}
                  >
                    <ChevronLeft size={28} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <List size={24} />
                    {selectedBook.name} {selectedChapter.chapter}{chapterUnit}
                  </div>

                  <button
                    onClick={() => nextChapter && setSelectedChapter(nextChapter)}
                    disabled={!nextChapter}
                    className={`p-2 rounded-full transition-colors ${nextChapter ? 'hover:bg-yellow-200 text-yellow-700 active:scale-95' : 'opacity-30 cursor-not-allowed'}`}
                    aria-label={`다음 ${chapterUnit}`}
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>
              );
            })()}

            <div className="flex flex-col gap-3">
              {selectedChapter.verses.map((verse) => {
                const verseId = `${selectedBook.id}-${selectedChapter.chapter}-${verse.verse}`;
                const isCompleted = completedVerses[verseId] > 0;
                
                return (
                  <motion.button
                    key={verse.verse}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVerseSelect(verse)}
                    className="bg-white p-5 rounded-2xl shadow-sm border-2 border-yellow-200 text-left hover:bg-yellow-50 flex gap-4 items-start transition-colors relative overflow-hidden"
                  >
                    <span className="bg-yellow-400 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shrink-0 mt-1 text-lg shadow-sm">
                      {verse.verse}
                    </span>
                    <div className="flex-1 pt-1">
                      <span className="text-xl text-gray-700 leading-relaxed block">
                        {verse.text}
                      </span>
                      {isCompleted && (
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold mt-2">
                          <CheckCircle2 size={16} />
                          {completedVerses[verseId]}회 완료
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


