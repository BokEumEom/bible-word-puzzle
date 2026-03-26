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

const colorMap: Record<string, { tile: string; ring: string; text: string; bar: string; badge: string }> = {
  rose: { tile: 'bg-rose-50', ring: 'border-rose-100', text: 'text-rose-600', bar: 'bg-rose-400', badge: 'bg-rose-100 text-rose-700' },
  sky: { tile: 'bg-sky-50', ring: 'border-sky-100', text: 'text-sky-600', bar: 'bg-sky-400', badge: 'bg-sky-100 text-sky-700' },
  amber: { tile: 'bg-amber-50', ring: 'border-amber-100', text: 'text-amber-600', bar: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700' },
  emerald: { tile: 'bg-emerald-50', ring: 'border-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700' },
  violet: { tile: 'bg-violet-50', ring: 'border-violet-100', text: 'text-violet-600', bar: 'bg-violet-400', badge: 'bg-violet-100 text-violet-700' },
  indigo: { tile: 'bg-indigo-50', ring: 'border-indigo-100', text: 'text-indigo-600', bar: 'bg-indigo-400', badge: 'bg-indigo-100 text-indigo-700' },
  orange: { tile: 'bg-orange-50', ring: 'border-orange-100', text: 'text-orange-600', bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700' },
  teal: { tile: 'bg-teal-50', ring: 'border-teal-100', text: 'text-teal-600', bar: 'bg-teal-400', badge: 'bg-teal-100 text-teal-700' },
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
        data-testid="collection-detail-summary-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-3xl border border-stone-100 bg-white p-5 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${colors.tile} ${colors.ring}`}>
            <span className="text-3xl leading-none">{collection.emoji}</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black tracking-[0.08em] text-stone-400">선택한 테마</p>
                <h1 className={`mt-1 text-xl font-black ${colors.text}`}>{collection.title}</h1>
                <p className="mt-1 text-sm font-bold text-stone-400">{collection.description}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${colors.badge}`}>
                {progress.completed}/{progress.total}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-stone-100">
          <motion.div
            className={`h-full ${colors.bar} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress.percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs font-bold text-stone-400">
          <span>{collection.verses.length}개 말씀</span>
          <span>{progress.percent}% 진행</span>
        </div>
      </motion.div>

      {/* Verse List — all unlocked, free order */}
      <div className="flex flex-col gap-3">
        {collection.verses.map((cv, i) => {
          const verseId = toVerseId(cv);
          const completed = (completedVerses[verseId] ?? 0) > 0;

          return (
            <motion.button
              key={verseId}
              data-testid={`collection-detail-verse-row-${verseId}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => onPlayVerse(cv)}
              className="flex w-full items-start gap-4 rounded-3xl border border-stone-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50 active:bg-stone-100"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${completed ? `${colors.badge} border-transparent` : `${colors.tile} ${colors.ring}`}`}>
                {completed ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <Play size={16} className={colors.text} fill="currentColor" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-black ${completed ? 'text-stone-700' : colors.text}`}>
                        {cv.reference}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${completed ? colors.badge : 'bg-stone-100 text-stone-400'}`}>
                        {difficultyLabel[cv.difficulty] ?? cv.difficulty}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-stone-400">
                      {cv.hint}
                    </p>
                  </div>

                  {completed && (
                    <span className="shrink-0 text-xs font-bold text-stone-400">
                      {completedVerses[verseId]}회
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
