import { motion } from 'motion/react';
import { ChevronLeft, Check, Play } from 'lucide-react';
import { Collection, CollectionVerse } from '../data/collections';
import { getCollectionProgress, toVerseId } from '../utils/collectionProgress';

interface Props {
  collection: Collection;
  completedVerses: Readonly<Record<string, number>>;
  onPlayVerse: (cv: CollectionVerse) => void;
  onBack: () => void;
}

const colorMap: Record<string, { bg: string; text: string; bar: string; badge: string; border: string }> = {
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', bar: 'bg-rose-400', badge: 'bg-rose-100 text-rose-700', border: 'border-rose-200' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-600', bar: 'bg-sky-400', badge: 'bg-sky-100 text-sky-700', border: 'border-sky-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', bar: 'bg-violet-400', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-400', badge: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700', border: 'border-orange-200' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', bar: 'bg-teal-400', badge: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
};

const difficultyLabel: Record<string, string> = {
  beginner: '입문',
  easy: '쉬움',
  normal: '보통',
};

export function CollectionDetail({ collection, completedVerses, onPlayVerse, onBack }: Props) {
  const colors = colorMap[collection.color] ?? colorMap.rose;
  const progress = getCollectionProgress(collection, completedVerses);

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-3 bg-white rounded-full shadow-sm hover:bg-white border-2 border-orange-100 transition-colors"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={28} className="text-orange-500" />
        </button>
      </div>

      {/* Collection Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${colors.bg} rounded-3xl p-6 mb-6 border-2 ${colors.border}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{collection.emoji}</span>
          <div>
            <h1 className={`text-2xl font-black ${colors.text}`}>{collection.title}</h1>
            <p className="text-sm text-stone-500 font-medium">{collection.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${colors.bar} rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progress.percent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className={`text-sm font-black ${colors.text}`}>
            {progress.completed}/{progress.total}
          </span>
        </div>
      </motion.div>

      {/* Verse List — all unlocked, free order */}
      <div className="flex flex-col gap-2">
        {collection.verses.map((cv, i) => {
          const verseId = toVerseId(cv);
          const completed = (completedVerses[verseId] ?? 0) > 0;

          return (
            <motion.button
              key={verseId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => onPlayVerse(cv)}
              className={`
                w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3
                ${completed
                  ? 'bg-white border-stone-100'
                  : `${colors.bg} ${colors.border}`}
              `}
            >
              {/* Status Icon */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${completed
                  ? `${colors.bar} text-white`
                  : 'bg-white border-2 ' + colors.border}
              `}>
                {completed ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <Play size={16} className={colors.text} fill="currentColor" />
                )}
              </div>

              {/* Verse Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-black ${completed ? 'text-stone-700' : colors.text}`}>
                    {cv.reference}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${completed ? colors.badge : 'bg-stone-100 text-stone-400'}`}>
                    {difficultyLabel[cv.difficulty] ?? cv.difficulty}
                  </span>
                </div>
                <p className="text-sm mt-0.5 text-stone-500 font-medium">
                  {cv.hint}
                </p>
              </div>

              {/* Completion count */}
              {completed && (
                <span className="text-xs font-bold text-stone-400 shrink-0">
                  {completedVerses[verseId]}회
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
