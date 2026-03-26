import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Difficulty } from '../../types';
import { bibleIndex } from '../../data/bible';
import { BookOpen, Scroll, Cross, Mail, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface Props {
  level: Difficulty;
  onSelect: (interests: string[]) => void;
}

interface Preset {
  id: string;
  label: string;
  desc: string;
  icon: any;
  bookIds: string[];
  accentClassName: string;
}

const presets: Preset[] = [
  {
    id: 'wisdom', label: '시편/잠언', desc: '위로와 지혜',
    icon: BookOpen, bookIds: ['psa', 'pro'],
    accentClassName: 'bg-violet-50 text-violet-500',
  },
  {
    id: 'gospel', label: '복음서', desc: '예수님의 이야기',
    icon: Cross, bookIds: ['mat', 'mrk', 'luk', 'jhn'],
    accentClassName: 'bg-rose-50 text-rose-500',
  },
  {
    id: 'genesis', label: '창세기부터', desc: '처음부터 차근차근',
    icon: Scroll, bookIds: ['gen', 'exo'],
    accentClassName: 'bg-amber-50 text-amber-500',
  },
  {
    id: 'paul', label: '바울서신', desc: '믿음의 편지',
    icon: Mail, bookIds: ['rom', '1co', 'eph'],
    accentClassName: 'bg-sky-50 text-sky-500',
  },
];

const BEGINNER_DEFAULTS = ['psa', 'pro', 'gen'];

export function InterestStep({ level, onSelect }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showGrid, setShowGrid] = useState(false);
  const [gridTestament, setGridTestament] = useState<'old' | 'new'>('old');

  // Beginner: auto-advance with defaults
  if (level === 'beginner') {
    return (
      <div className="flex min-h-screen items-center p-6 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-6 text-center shadow-sm"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <BookOpen size={28} />
          </div>
          <h2 className="mb-3 text-3xl font-black text-stone-900">
            시편, 잠언, 창세기로<br />시작할게요!
          </h2>
          <p className="mb-8 text-base font-bold text-stone-500">
            가장 인기 있는 성경으로 준비했어요
          </p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(BEGINNER_DEFAULTS)}
            className="btn-primary w-full py-4 text-xl"
          >
            좋아요!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const togglePreset = (preset: Preset) => {
    const next = new Set(selected);
    const isSelected = preset.bookIds.every(id => next.has(id));
    if (isSelected) {
      preset.bookIds.forEach(id => next.delete(id));
    } else {
      preset.bookIds.forEach(id => next.add(id));
    }
    setSelected(next);
  };

  const toggleGridBook = (bookId: string) => {
    const next = new Set(selected);
    if (next.has(bookId)) next.delete(bookId);
    else next.add(bookId);
    setSelected(next);
  };

  const isPresetSelected = (preset: Preset) => preset.bookIds.every(id => selected.has(id));

  const gridBooks = useMemo(() => bibleIndex.filter(b => b.testament === gridTestament), [gridTestament]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center p-6 pb-32 pt-20">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 text-center text-3xl font-black leading-tight text-stone-900"
      >
        어떤 말씀에 관심 있나요?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 text-center text-base font-bold text-stone-500"
      >
        마음이 가는 말씀부터 고르면 추천이 더 정확해져요.
      </motion.p>

      {/* Presets */}
      <div className="w-full space-y-4 mb-6">
        {presets.map((preset, index) => {
          const Icon = preset.icon;
          const active = isPresetSelected(preset);
          return (
            <motion.button
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => togglePreset(preset)}
              className={`relative flex w-full items-center gap-4 rounded-3xl border px-5 py-5 text-left shadow-sm transition-colors ${
                active
                  ? 'border-orange-200 bg-orange-50 ring-2 ring-orange-200'
                  : 'border-stone-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'
              }`}
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${preset.accentClassName}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-stone-900">{preset.label}</h3>
                <p className="mt-1 text-sm font-bold text-stone-500">{preset.desc}</p>
              </div>
              {active && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 size={22} className="shrink-0 text-orange-500" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Grid toggle (normal level only) */}
      {level === 'normal' && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => setShowGrid(!showGrid)}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-base font-black text-stone-500 shadow-sm ring-1 ring-stone-200 transition-colors hover:text-orange-500"
          >
            {showGrid ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            직접 고를래요
          </motion.button>

          <AnimatePresence>
            {showGrid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm"
              >
                {/* Testament tabs */}
                <div className="mb-4 flex rounded-3xl bg-stone-100 p-1">
                  <button
                    className={`flex-1 py-2.5 rounded-2xl font-black text-lg transition-colors ${
                      gridTestament === 'old' ? 'bg-white text-amber-600 shadow-sm' : 'text-stone-500'
                    }`}
                    onClick={() => setGridTestament('old')}
                  >
                    구약
                  </button>
                  <button
                    className={`flex-1 py-2.5 rounded-2xl font-black text-lg transition-colors ${
                      gridTestament === 'new' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500'
                    }`}
                    onClick={() => setGridTestament('new')}
                  >
                    신약
                  </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-4 gap-2.5">
                  {gridBooks.map(book => {
                    const active = selected.has(book.id);
                    const isOld = book.testament === 'old';
                    return (
                      <motion.button
                        key={book.id}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleGridBook(book.id)}
                        className={`flex aspect-square flex-col justify-between rounded-3xl border p-2.5 text-left transition-colors ${
                          active
                            ? isOld
                              ? 'border-amber-200 bg-amber-100 ring-2 ring-amber-200'
                              : 'border-indigo-200 bg-indigo-100 ring-2 ring-indigo-200'
                            : isOld
                              ? 'border-transparent bg-amber-50 hover:border-amber-200'
                              : 'border-transparent bg-indigo-50 hover:border-indigo-200'
                        }`}
                        aria-label={book.name}
                      >
                        <span className={`text-xl font-black ${isOld ? 'text-amber-700' : 'text-indigo-700'}`}>
                          {book.abbr}
                        </span>
                        <span className={`text-[10px] font-bold self-end leading-tight ${isOld ? 'text-amber-600/80' : 'text-indigo-600/80'}`}>
                          {book.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Next button — fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FFE0B2] to-transparent">
        <div className="max-w-md mx-auto">
          <motion.button
            whileHover={selected.size > 0 ? { scale: 1.05 } : {}}
            whileTap={selected.size > 0 ? { scale: 0.95 } : {}}
            onClick={() => onSelect(Array.from(selected))}
            disabled={selected.size === 0}
            className={`w-full py-4 rounded-3xl text-2xl font-black transition-all ${
              selected.size > 0
                ? 'btn-primary'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            다음
          </motion.button>
        </div>
      </div>
    </div>
  );
}
