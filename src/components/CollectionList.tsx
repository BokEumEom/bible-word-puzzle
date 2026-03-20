import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collections, Collection } from '../data/collections';
import { getCollectionProgress } from '../utils/collectionProgress';

interface Props {
  completedVerses: Readonly<Record<string, number>>;
  onSelectCollection: (collection: Collection) => void;
  onBack: () => void;
}

const colorMap: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', bar: 'bg-rose-400' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600', bar: 'bg-sky-400' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', bar: 'bg-amber-400' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', bar: 'bg-emerald-400' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600', bar: 'bg-violet-400' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', bar: 'bg-indigo-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', bar: 'bg-orange-400' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', bar: 'bg-teal-400' },
};

export function CollectionList({ completedVerses, onSelectCollection, onBack }: Props) {
  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white border-2 border-orange-100 transition-colors"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={28} className="text-orange-500" />
        </button>
        <h1 className="text-2xl font-black text-stone-700">테마별 모음</h1>
      </div>

      <div className="flex flex-col gap-3">
        {collections.map((collection, i) => {
          const progress = getCollectionProgress(collection, completedVerses);
          const colors = colorMap[collection.color] ?? colorMap.rose;

          return (
            <motion.button
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => onSelectCollection(collection)}
              className={`w-full text-left p-4 rounded-2xl border-2 border-b-4 transition-all ${colors.bg} ${colors.border} active:border-b-2 active:translate-y-0.5`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl shrink-0">{collection.emoji}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-black text-lg ${colors.text}`}>
                      {collection.title}
                    </h3>
                    <ChevronRight size={20} className="text-stone-400 shrink-0" />
                  </div>
                  <p className="text-sm text-stone-500 font-medium">{collection.description}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-stone-200/60 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${colors.bar} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percent}%` }}
                        transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs font-bold text-stone-500 shrink-0">
                      {progress.completed}/{progress.total}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
