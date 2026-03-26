import { motion } from 'motion/react';
import { ChevronRight, Library } from 'lucide-react';
import { collections, Collection } from '../data/collections';
import { getCollectionProgress } from '../utils/collectionProgress';

interface Props {
  completedVerses: Readonly<Record<string, number>>;
  onSelectCollection: (collection: Collection) => void;
}

const colorMap: Record<string, { tile: string; ring: string; text: string; bar: string; pill: string }> = {
  rose: { tile: 'bg-rose-50', ring: 'border-rose-100', text: 'text-rose-600', bar: 'bg-rose-400', pill: 'bg-rose-100 text-rose-700' },
  sky: { tile: 'bg-sky-50', ring: 'border-sky-100', text: 'text-sky-600', bar: 'bg-sky-400', pill: 'bg-sky-100 text-sky-700' },
  amber: { tile: 'bg-amber-50', ring: 'border-amber-100', text: 'text-amber-600', bar: 'bg-amber-400', pill: 'bg-amber-100 text-amber-700' },
  emerald: { tile: 'bg-emerald-50', ring: 'border-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-400', pill: 'bg-emerald-100 text-emerald-700' },
  violet: { tile: 'bg-violet-50', ring: 'border-violet-100', text: 'text-violet-600', bar: 'bg-violet-400', pill: 'bg-violet-100 text-violet-700' },
  indigo: { tile: 'bg-indigo-50', ring: 'border-indigo-100', text: 'text-indigo-600', bar: 'bg-indigo-400', pill: 'bg-indigo-100 text-indigo-700' },
  orange: { tile: 'bg-orange-50', ring: 'border-orange-100', text: 'text-orange-600', bar: 'bg-orange-400', pill: 'bg-orange-100 text-orange-700' },
  teal: { tile: 'bg-teal-50', ring: 'border-teal-100', text: 'text-teal-600', bar: 'bg-teal-400', pill: 'bg-teal-100 text-teal-700' },
};

export function CollectionList({ completedVerses, onSelectCollection }: Props) {
  const collectionItems = collections.map(collection => ({
    collection,
    progress: getCollectionProgress(collection, completedVerses),
    colors: colorMap[collection.color] ?? colorMap.rose,
  }));
  const totalVerseCount = collectionItems.reduce((sum, item) => sum + item.progress.total, 0);
  const completedVerseCount = collectionItems.reduce((sum, item) => sum + item.progress.completed, 0);
  const completedCollectionCount = collectionItems.filter(item => item.progress.completed === item.progress.total).length;
  const overallPercent = totalVerseCount > 0 ? Math.round((completedVerseCount / totalVerseCount) * 100) : 0;

  return (
    <div className="min-h-screen p-4 max-w-md mx-auto pt-4 pb-24">
      <div className="flex items-center gap-2 mb-5 h-10">
        <Library size={22} className="text-orange-500" />
        <h1 className="text-xl font-black text-stone-800">테마</h1>
      </div>

      <motion.div
        data-testid="collection-summary-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="mb-5 rounded-3xl border border-stone-100 bg-white p-5 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-black tracking-[0.08em] text-stone-400">테마 라이브러리</p>
            <h2 className="mt-1 text-xl font-black text-stone-800">오늘 마음에 맞는 말씀을 골라보세요</h2>
            <p className="mt-1 text-sm font-bold text-stone-400">
              {collections.length}개 테마 · {totalVerseCount}개 말씀
            </p>
          </div>
          <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-600">
            {completedVerseCount}/{totalVerseCount}
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-violet-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-500"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs font-bold text-stone-400">
          <span>완료 테마 {completedCollectionCount}개</span>
          <span>{overallPercent}% 진행</span>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3">
        {collectionItems.map(({ collection, progress, colors }, i) => {
          return (
            <motion.button
              key={collection.id}
              data-testid={`collection-row-${collection.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => onSelectCollection(collection)}
              className="w-full rounded-3xl border border-stone-100 bg-white p-4 text-left shadow-sm transition-colors hover:bg-stone-50 active:bg-stone-100"
            >
              <div className="flex items-start gap-4">
                <div
                  data-testid={`collection-icon-${collection.id}`}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${colors.tile} ${colors.ring}`}
                >
                  <span className="text-2xl leading-none">{collection.emoji}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className={`text-base font-black ${colors.text}`}>
                        {collection.title}
                      </h3>
                      <p className="mt-0.5 text-sm font-bold text-stone-400">{collection.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${colors.pill}`}>
                        {progress.completed}/{progress.total}
                      </span>
                      <ChevronRight size={18} className="text-stone-300 shrink-0" />
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                      <motion.div
                        className={`h-full ${colors.bar} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percent}%` }}
                        transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-stone-400">
                      <span>
                        {progress.completed === 0
                          ? '아직 시작하지 않았어요'
                          : progress.completed === progress.total
                            ? '모두 완료했어요'
                            : `${progress.percent}% 진행 중`}
                      </span>
                      <span>{collection.verses.length}개 말씀</span>
                    </div>
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
