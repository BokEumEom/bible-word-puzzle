import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BibleBook, BibleChapter, BibleVerse, Verse } from '../types';
import { bibleData } from '../data/bible';
import { Book, ChevronLeft, ChevronRight, List, CheckCircle2, Home } from 'lucide-react';

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
  const [activeTestament, setActiveTestament] = useState<'old' | 'new'>('old');

  const displayedBooks = bibleData.filter(book => book.testament === activeTestament);

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

  const theme = selectedBook?.testament === 'old' ? {
    color: 'amber',
    bg: 'bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-200',
    borderDark: 'border-amber-300',
    borderDarker: 'border-amber-400',
    btnBg: 'bg-amber-200',
    btnHover: 'hover:bg-amber-300',
    btnText: 'text-amber-900',
    iconText: 'text-amber-600',
    navHover: 'hover:bg-amber-50',
    navDisabled: 'bg-amber-50',
    numText: 'text-amber-800',
    breadcrumbBg: 'bg-amber-500',
    breadcrumbText: 'text-white',
    breadcrumbInactiveBg: 'bg-amber-100',
    breadcrumbInactiveText: 'text-amber-800',
    breadcrumbInactiveHover: 'hover:bg-amber-200',
    breadcrumbArrow: 'text-amber-300',
    verseBg: 'bg-amber-400',
    verseText: 'text-amber-900'
  } : {
    color: 'indigo',
    bg: 'bg-indigo-100',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    borderDark: 'border-indigo-300',
    borderDarker: 'border-indigo-400',
    btnBg: 'bg-indigo-200',
    btnHover: 'hover:bg-indigo-300',
    btnText: 'text-indigo-900',
    iconText: 'text-indigo-600',
    navHover: 'hover:bg-indigo-50',
    navDisabled: 'bg-indigo-50',
    numText: 'text-indigo-800',
    breadcrumbBg: 'bg-indigo-500',
    breadcrumbText: 'text-white',
    breadcrumbInactiveBg: 'bg-indigo-100',
    breadcrumbInactiveText: 'text-indigo-800',
    breadcrumbInactiveHover: 'hover:bg-indigo-200',
    breadcrumbArrow: 'text-indigo-300',
    verseBg: 'bg-indigo-400',
    verseText: 'text-indigo-900'
  };

  const handleGlobalBack = () => {
    if (step === 'verse') setStep('chapter');
    else if (step === 'chapter') setStep('book');
    else onBack();
  };

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-6 pb-20">
      <div className="sticky top-2 z-20 mb-8">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-[2rem] shadow-sm border-2 border-orange-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleGlobalBack}
              className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm hover:bg-orange-50 border-2 border-orange-100 shrink-0 transition-colors"
              aria-label="뒤로 가기"
            >
              <ChevronLeft size={28} className="text-orange-500" />
            </motion.button>
            <h2 className="text-2xl font-black text-stone-800 text-center flex-1">
              {step === 'book' ? '성경 찾기 📖' : step === 'chapter' ? selectedBook?.name : `${selectedBook?.name} ${selectedChapter?.chapter}${selectedBook?.name === '시편' ? '편' : '장'}`}
            </h2>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center justify-center w-12 h-12 bg-white rounded-2xl shadow-sm hover:bg-orange-50 border-2 border-orange-100 shrink-0 transition-colors"
              aria-label="홈으로 가기"
            >
              <Home size={24} className="text-orange-500" />
            </motion.button>
          </div>

          {/* Breadcrumb Navigation */}
          {step !== 'book' && (
            <div className="flex items-center justify-center gap-2 px-1 pb-1 overflow-x-auto no-scrollbar">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setStep('book')}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-black text-sm hover:bg-orange-200 transition-colors shadow-sm whitespace-nowrap"
              >
                <Book size={16} />
                성경 목록
              </motion.button>
              
              <ChevronRight size={18} className="text-orange-300 shrink-0" />
              
              <motion.button 
                whileHover={step !== 'chapter' ? { scale: 1.05 } : {}} 
                whileTap={step !== 'chapter' ? { scale: 0.95 } : {}}
                onClick={() => setStep('chapter')}
                disabled={step === 'chapter'}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm transition-colors shadow-sm whitespace-nowrap ${
                  step === 'chapter' 
                    ? `${theme.breadcrumbBg} ${theme.breadcrumbText} cursor-default shadow-inner` 
                    : `${theme.breadcrumbInactiveBg} ${theme.breadcrumbInactiveText} ${theme.breadcrumbInactiveHover}`
                }`}
              >
                <List size={16} />
                {selectedBook?.name}
              </motion.button>

              {step === 'verse' && (
                <>
                  <ChevronRight size={18} className={`${theme.breadcrumbArrow} shrink-0`} />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-1.5 px-4 py-2 ${theme.verseBg} ${theme.verseText} rounded-full font-black text-sm shadow-inner cursor-default whitespace-nowrap`}
                  >
                    {selectedChapter?.chapter}{selectedBook?.name === '시편' ? '편' : '장'}
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>
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
            <div className={`p-5 rounded-3xl mb-4 text-2xl border-4 text-center font-black shadow-sm ${
              activeTestament === 'old' 
                ? 'bg-amber-100 text-amber-900 border-amber-200' 
                : 'bg-indigo-100 text-indigo-900 border-indigo-200'
            }`}>
              어떤 성경을 읽을까요? 🧐
            </div>
            
            <div className="flex bg-white/50 p-2 rounded-3xl mb-2 shadow-inner border-2 border-orange-100">
              <motion.button
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xl transition-colors ${
                  activeTestament === 'old' 
                    ? 'bg-white text-amber-600 shadow-sm border-2 border-amber-100' 
                    : 'text-stone-500 hover:bg-white/80'
                }`}
                onClick={() => setActiveTestament('old')}
                whileTap={{ scale: 0.95 }}
              >
                구약 <span className="text-sm font-bold opacity-70 ml-1">39권</span>
              </motion.button>
              <motion.button
                className={`flex-1 py-3 px-4 rounded-2xl font-black text-xl transition-colors ${
                  activeTestament === 'new' 
                    ? 'bg-white text-indigo-600 shadow-sm border-2 border-indigo-100' 
                    : 'text-stone-500 hover:bg-white/80'
                }`}
                onClick={() => setActiveTestament('new')}
                whileTap={{ scale: 0.95 }}
              >
                신약 <span className="text-sm font-bold opacity-70 ml-1">27권</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {displayedBooks.map((book, index) => (
                <motion.button
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBookSelect(book)}
                  className={`p-6 h-32 rounded-[2rem] shadow-sm border-b-8 flex items-center justify-center transition-colors ${
                    activeTestament === 'old'
                      ? 'bg-amber-100 border-amber-300 hover:bg-amber-200'
                      : 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200'
                  }`}
                >
                  <span className="text-2xl font-black text-stone-800">{book.name}</span>
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
            <div className={`${theme.bg} ${theme.text} p-5 rounded-[2rem] mb-4 text-2xl border-4 ${theme.border} text-center font-black flex items-center justify-center gap-3 shadow-sm`}>
              <Book size={28} className="-rotate-6" />
              {selectedBook.name} 몇 {selectedBook.name === '시편' ? '편' : '장'}을 읽을까요?
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
              {selectedBook.chapters.map((chapter, index) => (
                <motion.button
                  key={chapter.chapter}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02, type: "spring", stiffness: 300, damping: 15 }}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChapterSelect(chapter)}
                  className={`aspect-square ${theme.btnBg} rounded-[1.5rem] shadow-sm border-b-4 ${theme.borderDarker} flex items-center justify-center text-2xl font-black ${theme.btnText} ${theme.btnHover} transition-colors`}
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
            {(() => {
              const currentIndex = selectedBook.chapters.findIndex(c => c.chapter === selectedChapter.chapter);
              const prevChapter = currentIndex > 0 ? selectedBook.chapters[currentIndex - 1] : null;
              const nextChapter = currentIndex < selectedBook.chapters.length - 1 ? selectedBook.chapters[currentIndex + 1] : null;
              const chapterUnit = selectedBook.name === '시편' ? '편' : '장';

              return (
                <div className={`${theme.bg} ${theme.text} p-3 rounded-[2rem] mb-6 text-xl border-4 ${theme.borderDark} font-black flex items-center justify-between shadow-md`}>
                  <motion.button
                    whileHover={prevChapter ? { scale: 1.1, x: -2 } : {}}
                    whileTap={prevChapter ? { scale: 0.9 } : {}}
                    onClick={() => prevChapter && setSelectedChapter(prevChapter)}
                    disabled={!prevChapter}
                    className={`p-3 rounded-2xl transition-colors flex items-center justify-center ${prevChapter ? `bg-white/80 backdrop-blur-sm ${theme.iconText} ${theme.navHover} shadow-sm` : `opacity-40 cursor-not-allowed ${theme.navDisabled}`}`}
                    aria-label={`이전 ${chapterUnit}`}
                  >
                    <ChevronLeft size={28} />
                  </motion.button>
                  
                  <div className="flex items-center gap-2">
                    <List size={28} className={theme.iconText} />
                    <span>{selectedBook.name} <span className={`text-3xl ${theme.iconText}`}>{selectedChapter.chapter}</span>{chapterUnit}</span>
                  </div>

                  <motion.button
                    whileHover={nextChapter ? { scale: 1.1, x: 2 } : {}}
                    whileTap={nextChapter ? { scale: 0.9 } : {}}
                    onClick={() => nextChapter && setSelectedChapter(nextChapter)}
                    disabled={!nextChapter}
                    className={`p-3 rounded-2xl transition-colors flex items-center justify-center ${nextChapter ? `bg-white/80 backdrop-blur-sm ${theme.iconText} ${theme.navHover} shadow-sm` : `opacity-40 cursor-not-allowed ${theme.navDisabled}`}`}
                    aria-label={`다음 ${chapterUnit}`}
                  >
                    <ChevronRight size={28} />
                  </motion.button>
                </div>
              );
            })()}

            <div className="flex flex-col gap-4">
              {selectedChapter.verses.map((verse, index) => {
                const verseId = `${selectedBook.id}-${selectedChapter.chapter}-${verse.verse}`;
                const isCompleted = completedVerses[verseId] > 0;
                
                return (
                  <motion.button
                    key={verse.verse}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVerseSelect(verse)}
                    className={`${theme.bg} p-5 rounded-[2rem] shadow-sm border-b-4 ${theme.borderDark} text-left ${theme.btnHover} flex gap-4 items-start transition-colors relative overflow-hidden`}
                  >
                    <span className={`bg-white/80 backdrop-blur-sm ${theme.numText} font-black rounded-2xl w-12 h-12 flex items-center justify-center shrink-0 mt-1 text-xl shadow-sm rotate-3`}>
                      {verse.verse}
                    </span>
                    <div className="flex-1 pt-1 min-w-0">
                      <span className="text-xl sm:text-2xl text-stone-800 font-bold leading-relaxed block break-keep whitespace-pre-wrap">
                        {verse.text}
                      </span>
                      {isCompleted && (
                        <div className="flex items-center gap-1.5 text-emerald-700 text-sm font-black mt-3 bg-emerald-100 border-2 border-emerald-200 w-fit px-3 py-1.5 rounded-full shadow-sm">
                          <CheckCircle2 size={18} className="text-emerald-600" />
                          <span>{completedVerses[verseId]}회 완료 🌟</span>
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


