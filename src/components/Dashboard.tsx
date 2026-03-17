import { motion } from 'motion/react';
import { BookOpen, Search, Flame, Star, Clock, CheckCircle2, ChevronRight, Heart, Play } from 'lucide-react';
import { Verse } from '../types';
import { UserProgress } from '../hooks/useUserProgress';
import { bibleData } from '../data/bible';

interface Props {
  progress: UserProgress;
  onStartExplore: () => void;
  onStartPreset: () => void;
  onSelectVerse: (verse: Verse) => void;
}

export function Dashboard({ progress, onStartExplore, onStartPreset, onSelectVerse }: Props) {
  // Get a random verse for "Today's Verse" (or deterministic based on date)
  const getTodaysVerse = (): Verse => {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
    
    // Flatten all verses
    const allVerses: Verse[] = [];
    bibleData.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          const words = verse.text.split(' ').filter(w => w.length > 0);
          const chapterUnit = book.name === '시편' ? '편' : '장';
          allVerses.push({
            id: `${book.id}-${chapter.chapter}-${verse.verse}`,
            reference: `${book.name} ${chapter.chapter}${chapterUnit} ${verse.verse}절`,
            verse: verse.text,
            words: words,
            hint: '오늘의 말씀을 마음에 새겨보아요!',
          });
        });
      });
    });

    return allVerses[seed % allVerses.length];
  };

  const todaysVerse = getTodaysVerse();

  // Get verses for "Review" (completed verses)
  const getReviewVerses = () => {
    const completedIds = Object.keys(progress.completedVerses);
    if (completedIds.length === 0) return [];
    
    // Just return the first few for MVP, or random ones
    const reviewVerses: Verse[] = [];
    // We need to reconstruct Verse from ID, or we can just use recentVerses that are completed.
    // For MVP, let's just use recentVerses that have a completion count > 0
    return progress.recentVerses.filter(v => progress.completedVerses[v.id] > 0).slice(0, 3);
  };

  const reviewVerses = getReviewVerses();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen p-4 max-w-md mx-auto pt-6 pb-20 bg-[#fdfbf7]"
    >
      {/* Header with Streak */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <Flame className="text-orange-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold">연속 학습</p>
            <p className="text-xl font-bold text-gray-800">{progress.streak}일째</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-full">
            <CheckCircle2 className="text-emerald-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold">완료한 말씀</p>
            <p className="text-xl font-bold text-gray-800">{Object.keys(progress.completedVerses).length}개</p>
          </div>
        </div>
      </div>

      {/* Today's Verse */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpen className="text-blue-500" size={24} />
          오늘의 암송
        </h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectVerse(todaysVerse)}
          className="w-full bg-blue-50 p-5 rounded-3xl shadow-sm border-2 border-blue-200 text-left hover:bg-blue-100 transition-colors relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-10">
            <BookOpen size={100} />
          </div>
          <span className="inline-block bg-blue-200 text-blue-800 text-sm font-bold px-3 py-1 rounded-full mb-3">
            {todaysVerse.reference}
          </span>
          <p className="text-lg text-gray-800 font-medium leading-relaxed line-clamp-2">
            {todaysVerse.verse}
          </p>
          <div className="mt-4 flex items-center text-blue-600 font-bold text-sm">
            학습하기 <ChevronRight size={16} />
          </div>
        </motion.button>
      </div>

      {/* Explore & Preset Buttons */}
      <div className="flex flex-col gap-3 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartPreset}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-lg font-bold p-4 rounded-2xl shadow-sm border-b-4 border-yellow-600 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-yellow-300 p-2 rounded-full">
              <Play className="text-yellow-800" fill="currentColor" size={24} />
            </div>
            추천 말씀 퍼즐 (단계별)
          </div>
          <ChevronRight className="text-yellow-700" size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartExplore}
          className="w-full bg-white hover:bg-gray-50 text-gray-800 text-lg font-bold p-4 rounded-2xl shadow-sm border-2 border-gray-200 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <Search className="text-gray-600" size={24} />
            </div>
            성경 찾기 (새로운 말씀)
          </div>
          <ChevronRight className="text-gray-400" size={24} />
        </motion.button>
      </div>

      {/* Recent & Review */}
      {progress.recentVerses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock className="text-emerald-500" size={24} />
            최근 학습 및 복습
          </h2>
          <div className="flex flex-col gap-3">
            {progress.recentVerses.slice(0, 3).map((verse) => (
              <motion.button
                key={`recent-${verse.id}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectVerse(verse)}
                className="bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100 text-left hover:border-emerald-200 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-bold text-emerald-600 mb-1 block">
                    {verse.reference}
                  </span>
                  <p className="text-gray-700 line-clamp-1 text-sm">
                    {verse.verse}
                  </p>
                </div>
                {progress.completedVerses[verse.id] > 0 && (
                  <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
                    {progress.completedVerses[verse.id]}회 완료
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {progress.favoriteVerses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Heart className="text-rose-500" size={24} />
            즐겨찾기 말씀
          </h2>
          <div className="flex flex-col gap-3">
            {progress.favoriteVerses.map((verse) => (
              <motion.button
                key={`fav-${verse.id}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectVerse(verse)}
                className="bg-white p-4 rounded-2xl shadow-sm border-2 border-rose-100 text-left hover:border-rose-300 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-sm font-bold text-rose-600 mb-1 block">
                    {verse.reference}
                  </span>
                  <p className="text-gray-700 line-clamp-1 text-sm">
                    {verse.verse}
                  </p>
                </div>
                <Heart className="text-rose-400 fill-rose-400 shrink-0 ml-2" size={20} />
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
