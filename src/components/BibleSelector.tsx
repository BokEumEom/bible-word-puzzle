import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BibleBookMeta, BibleChapter, BibleVerse, Verse } from '../types';
import { bibleIndex, loadBookChapters } from '../data/bible';
import { Book, ChevronLeft, ChevronRight, List, CheckCircle2, Home, Loader2, Search, X, RefreshCw, Clock, Star } from 'lucide-react';

interface Props {
  onSelect: (verse: Verse) => void;
  onBack: () => void;
  completedVerses?: Record<string, number>;
  interests?: string[];
}

type Step = 'book' | 'chapter' | 'verse';

const MAX_STAGGER = 20;
const RECENT_BOOKS_KEY = 'bible-puzzle-recent-books';
const MAX_RECENT = 5;

// --- Theme ---

const chapterThemes = {
  old: {
    bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-200',
    borderDark: 'border-amber-300', borderDarker: 'border-amber-400',
    btnBg: 'bg-amber-200', btnHover: 'hover:bg-amber-300', btnText: 'text-amber-900',
    iconText: 'text-amber-600', navHover: 'hover:bg-amber-50', navDisabled: 'bg-amber-50',
    numText: 'text-amber-800',
    breadcrumbBg: 'bg-amber-500', breadcrumbText: 'text-white',
    breadcrumbInactiveBg: 'bg-amber-100', breadcrumbInactiveText: 'text-amber-800',
    breadcrumbInactiveHover: 'hover:bg-amber-200', breadcrumbArrow: 'text-amber-300',
    verseBg: 'bg-amber-400', verseText: 'text-amber-900',
  },
  new: {
    bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-200',
    borderDark: 'border-indigo-300', borderDarker: 'border-indigo-400',
    btnBg: 'bg-indigo-200', btnHover: 'hover:bg-indigo-300', btnText: 'text-indigo-900',
    iconText: 'text-indigo-600', navHover: 'hover:bg-indigo-50', navDisabled: 'bg-indigo-50',
    numText: 'text-indigo-800',
    breadcrumbBg: 'bg-indigo-500', breadcrumbText: 'text-white',
    breadcrumbInactiveBg: 'bg-indigo-100', breadcrumbInactiveText: 'text-indigo-800',
    breadcrumbInactiveHover: 'hover:bg-indigo-200', breadcrumbArrow: 'text-indigo-300',
    verseBg: 'bg-indigo-400', verseText: 'text-indigo-900',
  },
} as const;

type ChapterTheme = typeof chapterThemes.old | typeof chapterThemes.new;

function chapterUnit(bookName: string): string {
  return bookName === '시편' ? '편' : '장';
}

// --- Recent books helpers ---

function loadRecentBooks(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_BOOKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function saveRecentBook(bookId: string): void {
  const recents = loadRecentBooks().filter(id => id !== bookId);
  const updated = [bookId, ...recents].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_BOOKS_KEY, JSON.stringify(updated));
}

// --- Sub-components ---

function ChapterNavigator({
  book, chapters, currentChapter, onChangeChapter, theme,
}: {
  book: BibleBookMeta;
  chapters: BibleChapter[];
  currentChapter: BibleChapter;
  onChangeChapter: (chapter: BibleChapter) => void;
  theme: ChapterTheme;
}) {
  const currentIndex = chapters.findIndex(c => c.chapter === currentChapter.chapter);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const unit = chapterUnit(book.name);

  return (
    <div className={`${theme.bg} ${theme.text} p-3 rounded-[2rem] mb-6 text-xl border-4 ${theme.borderDark} font-black flex items-center justify-between shadow-md`}>
      <motion.button
        whileHover={prevChapter ? { scale: 1.1, x: -2 } : {}}
        whileTap={prevChapter ? { scale: 0.9 } : {}}
        onClick={() => prevChapter && onChangeChapter(prevChapter)}
        disabled={!prevChapter}
        className={`p-3 rounded-2xl transition-colors flex items-center justify-center ${prevChapter ? `bg-white/80 backdrop-blur-sm ${theme.iconText} ${theme.navHover} shadow-sm` : `opacity-40 cursor-not-allowed ${theme.navDisabled}`}`}
        aria-label={`이전 ${unit}`}
      >
        <ChevronLeft size={28} />
      </motion.button>
      <div className="flex items-center gap-2">
        <List size={28} className={theme.iconText} />
        <span>{book.name} <span className={`text-3xl ${theme.iconText}`}>{currentChapter.chapter}</span>{unit}</span>
      </div>
      <motion.button
        whileHover={nextChapter ? { scale: 1.1, x: 2 } : {}}
        whileTap={nextChapter ? { scale: 0.9 } : {}}
        onClick={() => nextChapter && onChangeChapter(nextChapter)}
        disabled={!nextChapter}
        className={`p-3 rounded-2xl transition-colors flex items-center justify-center ${nextChapter ? `bg-white/80 backdrop-blur-sm ${theme.iconText} ${theme.navHover} shadow-sm` : `opacity-40 cursor-not-allowed ${theme.navDisabled}`}`}
        aria-label={`다음 ${unit}`}
      >
        <ChevronRight size={28} />
      </motion.button>
    </div>
  );
}

// --- Main component ---

export function BibleSelector({ onSelect, onBack, completedVerses = {}, interests = [] }: Props) {
  const [step, setStep] = useState<Step>('book');
  const [selectedBook, setSelectedBook] = useState<BibleBookMeta | null>(null);
  const [chapters, setChapters] = useState<BibleChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<BibleChapter | null>(null);
  const [activeTestament, setActiveTestament] = useState<'old' | 'new'>('old');
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentBookIds, setRecentBookIds] = useState<string[]>([]);

  const theme = chapterThemes[selectedBook?.testament ?? activeTestament];

  useEffect(() => {
    setRecentBookIds(loadRecentBooks());
  }, []);

  const testamentBooks = useMemo(() => {
    return bibleIndex.filter(b => b.testament === activeTestament);
  }, [activeTestament]);

  // Search across ALL books by name or abbreviation
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.trim().toLowerCase();
    return bibleIndex.filter(b =>
      b.name.toLowerCase().includes(q) || b.abbr.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const recentBooks = useMemo(() => {
    return recentBookIds
      .map(id => bibleIndex.find(b => b.id === id))
      .filter((b): b is BibleBookMeta => b !== undefined);
  }, [recentBookIds]);

  const interestBooks = useMemo(() => {
    if (interests.length === 0) return [];
    return interests
      .map(id => bibleIndex.find(b => b.id === id))
      .filter((b): b is BibleBookMeta => b !== undefined);
  }, [interests]);

  const fetchChapters = (bookId: string) => {
    setLoading(true);
    setLoadError(false);
    loadBookChapters(bookId)
      .then(setChapters)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!selectedBook) return;
    fetchChapters(selectedBook.id);
  }, [selectedBook]);

  const handleBookSelect = (book: BibleBookMeta) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setSearchQuery('');
    saveRecentBook(book.id);
    setRecentBookIds(loadRecentBooks());
    setStep('chapter');
  };

  const handleChapterSelect = (chapter: BibleChapter) => {
    setSelectedChapter(chapter);
    setStep('verse');
  };

  const handleVerseSelect = (verse: BibleVerse) => {
    if (!selectedBook || !selectedChapter) return;
    const words = verse.text.split(' ').filter(w => w.length > 0);
    const unit = chapterUnit(selectedBook.name);
    const gameVerse: Verse = {
      id: `${selectedBook.id}-${selectedChapter.chapter}-${verse.verse}`,
      reference: `${selectedBook.name} ${selectedChapter.chapter}${unit} ${verse.verse}절`,
      verse: verse.text,
      words,
      hint: '말씀을 잘 읽고 맞춰보아요!',
    };
    onSelect(gameVerse);
  };

  const handleGlobalBack = () => {
    if (step === 'verse') setStep('chapter');
    else if (step === 'chapter') setStep('book');
    else onBack();
  };

  const headerTitle = () => {
    if (step === 'book') return '성경 찾기 📖';
    if (step === 'chapter' && selectedBook) return selectedBook.name;
    if (step === 'verse' && selectedBook && selectedChapter) return `${selectedBook.name} ${selectedChapter.chapter}${chapterUnit(selectedBook.name)}`;
    return '성경 찾기 📖';
  };

  const hasCompletedBook = (bookId: string) => {
    return Object.keys(completedVerses).some(key => key.startsWith(`${bookId}-`));
  };

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-6 pb-20">
      {/* Sticky header */}
      <div className="sticky top-2 z-20 mb-6">
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
              {headerTitle()}
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

          {/* Breadcrumbs for chapter/verse steps */}
          {(step === 'chapter' || step === 'verse') && (
            <nav className="flex items-center justify-center gap-2 px-1 pb-1 overflow-x-auto no-scrollbar" aria-label="성경 탐색 경로">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setStep('book')}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-black text-sm hover:bg-orange-200 transition-colors shadow-sm whitespace-nowrap"
              >
                <Book size={16} />
                성경
              </motion.button>

              <ChevronRight size={18} className="text-orange-300 shrink-0" aria-hidden="true" />

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
                aria-current={step === 'chapter' ? 'page' : undefined}
              >
                <List size={16} />
                {selectedBook?.name}
              </motion.button>

              {step === 'verse' && (
                <>
                  <ChevronRight size={18} className={`${theme.breadcrumbArrow} shrink-0`} aria-hidden="true" />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className={`flex items-center gap-1.5 px-4 py-2 ${theme.verseBg} ${theme.verseText} rounded-full font-black text-sm shadow-inner cursor-default whitespace-nowrap`}
                    aria-current="page"
                  >
                    {selectedChapter?.chapter}{chapterUnit(selectedBook?.name ?? '')}
                  </motion.div>
                </>
              )}
            </nav>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Book selection — search + recents + testament toggle + abbreviation grid */}
        {step === 'book' && (
          <motion.div
            key="book"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-4"
          >
            {/* Search */}
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="성경 검색 (창, 시, 요...)"
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-orange-100 text-lg font-bold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-300 transition-colors"
                aria-label="성경 이름 검색"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-orange-100 transition-colors"
                  aria-label="검색어 지우기"
                >
                  <X size={18} className="text-stone-400" />
                </button>
              )}
            </div>

            {/* Search results */}
            {searchResults ? (
              <div className="flex flex-col gap-2">
                {searchResults.length === 0 ? (
                  <div className="text-center py-12 text-stone-400 font-bold text-lg">
                    검색 결과가 없어요 😅
                  </div>
                ) : searchResults.map((book, index) => (
                  <motion.button
                    key={book.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleBookSelect(book)}
                    className={`w-full p-4 rounded-2xl shadow-sm border-2 border-b-4 text-left flex items-center gap-3 transition-colors ${
                      book.testament === 'old'
                        ? 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                        : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    <span className="text-lg font-black text-stone-400 w-8">{book.abbr}</span>
                    <span className="text-xl font-black text-stone-800">{book.name}</span>
                    <span className="text-sm font-bold text-stone-400 ml-auto">{book.chapterCount}{chapterUnit(book.name)}</span>
                    {hasCompletedBook(book.id) && (
                      <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <>
                {/* Recent books */}
                {recentBooks.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-1">
                      <Clock size={16} className="text-stone-400" />
                      <span className="text-sm font-black text-stone-400">최근</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentBooks.map((book, index) => (
                        <motion.button
                          key={book.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleBookSelect(book)}
                          className={`px-4 py-2.5 rounded-2xl font-black text-base border-2 border-b-4 transition-colors ${
                            book.testament === 'old'
                              ? 'bg-amber-100 border-amber-300 hover:bg-amber-200 text-amber-800'
                              : 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200 text-indigo-800'
                          }`}
                        >
                          {book.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interest books */}
                {interestBooks.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-1">
                      <Star size={16} className="text-orange-400" />
                      <span className="text-sm font-black text-orange-400">관심 성경</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interestBooks.map((book, index) => (
                        <motion.button
                          key={book.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleBookSelect(book)}
                          className={`px-4 py-2.5 rounded-2xl font-black text-base border-2 border-b-4 transition-colors ${
                            book.testament === 'old'
                              ? 'bg-amber-200 border-amber-400 hover:bg-amber-300 text-amber-800'
                              : 'bg-indigo-200 border-indigo-400 hover:bg-indigo-300 text-indigo-800'
                          }`}
                        >
                          {book.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Testament tabs */}
                <div className="flex bg-white/50 p-1.5 rounded-3xl shadow-inner border-2 border-orange-100" role="tablist" aria-label="구약/신약 선택">
                  <motion.button
                    role="tab"
                    aria-selected={activeTestament === 'old'}
                    className={`flex-1 py-3 px-4 rounded-2xl font-black text-xl transition-colors ${
                      activeTestament === 'old'
                        ? 'bg-white text-amber-600 shadow-sm border-2 border-amber-100'
                        : 'text-stone-500 hover:bg-white/80'
                    }`}
                    onClick={() => setActiveTestament('old')}
                    whileTap={{ scale: 0.95 }}
                  >
                    구약
                  </motion.button>
                  <motion.button
                    role="tab"
                    aria-selected={activeTestament === 'new'}
                    className={`flex-1 py-3 px-4 rounded-2xl font-black text-xl transition-colors ${
                      activeTestament === 'new'
                        ? 'bg-white text-indigo-600 shadow-sm border-2 border-indigo-100'
                        : 'text-stone-500 hover:bg-white/80'
                    }`}
                    onClick={() => setActiveTestament('new')}
                    whileTap={{ scale: 0.95 }}
                  >
                    신약
                  </motion.button>
                </div>

                {/* Abbreviation grid — DifficultySelector tone */}
                <motion.div
                  key={activeTestament}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-4 gap-3"
                >
                  {testamentBooks.map((book, index) => {
                    const completed = hasCompletedBook(book.id);
                    const isOld = activeTestament === 'old';

                    return (
                      <motion.button
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: index < MAX_STAGGER ? index * 0.015 : 0,
                          type: 'spring', stiffness: 300, damping: 20,
                        }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => handleBookSelect(book)}
                        className={`relative aspect-square rounded-[2rem] border-b-8 shadow-sm transition-colors flex flex-col justify-between p-3 text-left ${
                          completed
                            ? isOld
                              ? 'bg-amber-200 hover:bg-amber-300 border-amber-400'
                              : 'bg-indigo-200 hover:bg-indigo-300 border-indigo-400'
                            : isOld
                              ? 'bg-amber-100 hover:bg-amber-200 border-amber-300'
                              : 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300'
                        }`}
                        aria-label={book.name}
                      >
                        <span className={`text-2xl font-black ${isOld ? 'text-amber-700' : 'text-indigo-700'}`}>
                          {book.abbr}
                        </span>
                        <span className={`text-[11px] font-bold self-end leading-tight ${isOld ? 'text-amber-600/80' : 'text-indigo-600/80'}`}>
                          {book.name}
                        </span>
                        {completed && (
                          <CheckCircle2 size={14} className="absolute top-2.5 right-2.5 text-emerald-500" />
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* Step 2: Chapter selection */}
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
              {selectedBook.name} 몇 {chapterUnit(selectedBook.name)}을 읽을까요?
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={40} className={`${theme.iconText} animate-spin`} />
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-stone-500 font-bold text-lg">데이터를 불러오지 못했어요 😢</p>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => selectedBook && fetchChapters(selectedBook.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-400 text-white font-black text-lg rounded-2xl shadow-sm border-b-4 border-orange-600 hover:bg-orange-500 transition-colors"
                >
                  <RefreshCw size={20} />
                  다시 시도하기
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-3 min-[400px]:grid-cols-4 sm:grid-cols-5 gap-2 min-[400px]:gap-3 sm:gap-4" role="list" aria-label={`${selectedBook.name} 장 목록`}>
                {chapters.map((chapter, index) => (
                  <motion.button
                    key={chapter.chapter}
                    role="listitem"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index < MAX_STAGGER ? index * 0.02 : 0,
                      type: 'spring', stiffness: 300, damping: 15,
                    }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleChapterSelect(chapter)}
                    className={`aspect-square ${theme.btnBg} rounded-[1.5rem] shadow-sm border-b-4 ${theme.borderDarker} flex items-center justify-center text-2xl font-black ${theme.btnText} ${theme.btnHover} transition-colors`}
                    aria-label={`${chapter.chapter}${chapterUnit(selectedBook.name)}`}
                  >
                    {chapter.chapter}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Verse selection */}
        {step === 'verse' && selectedBook && selectedChapter && (
          <motion.div
            key="verse"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            <ChapterNavigator
              book={selectedBook}
              chapters={chapters}
              currentChapter={selectedChapter}
              onChangeChapter={handleChapterSelect}
              theme={theme}
            />

            <div className="flex flex-col gap-4" role="list" aria-label={`${selectedBook.name} ${selectedChapter.chapter}${chapterUnit(selectedBook.name)} 절 목록`}>
              {selectedChapter.verses.map((verse, index) => {
                const verseId = `${selectedBook.id}-${selectedChapter.chapter}-${verse.verse}`;
                const isCompleted = completedVerses[verseId] > 0;

                return (
                  <motion.button
                    key={verse.verse}
                    role="listitem"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index < MAX_STAGGER ? index * 0.05 : 0,
                      type: 'spring', stiffness: 200,
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVerseSelect(verse)}
                    className={`${theme.bg} p-5 rounded-[2rem] shadow-sm border-b-4 ${theme.borderDark} text-left ${theme.btnHover} flex gap-4 items-start transition-colors relative overflow-hidden`}
                    aria-label={`${verse.verse}절: ${verse.text}`}
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
