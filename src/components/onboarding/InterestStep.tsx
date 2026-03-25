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
  color: string;
  shadow: string;
  iconColor: string;
}

const presets: Preset[] = [
  {
    id: 'wisdom', label: '시편/잠언', desc: '위로와 지혜',
    icon: BookOpen, bookIds: ['psa', 'pro'],
    color: 'bg-violet-100 hover:bg-violet-200', shadow: 'shadow-[0_8px_0_var(--color-violet-300)]', iconColor: 'text-violet-500',
  },
  {
    id: 'gospel', label: '복음서', desc: '예수님의 이야기',
    icon: Cross, bookIds: ['mat', 'mrk', 'luk', 'jhn'],
    color: 'bg-rose-100 hover:bg-rose-200', shadow: 'shadow-[0_8px_0_var(--color-rose-300)]', iconColor: 'text-rose-500',
  },
  {
    id: 'genesis', label: '창세기부터', desc: '처음부터 차근차근',
    icon: Scroll, bookIds: ['gen', 'exo'],
    color: 'bg-amber-100 hover:bg-amber-200', shadow: 'shadow-[0_8px_0_var(--color-amber-300)]', iconColor: 'text-amber-500',
  },
  {
    id: 'paul', label: '바울서신', desc: '믿음의 편지',
    icon: Mail, bookIds: ['rom', '1co', 'eph'],
    color: 'bg-sky-100 hover:bg-sky-200', shadow: 'shadow-[0_8px_0_var(--color-sky-300)]', iconColor: 'text-sky-500',
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
      <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-24 h-24 mx-auto mb-6"
          >
            <img src="/joy-proud.png" alt="JOY" className="w-full h-full object-contain" />
          </motion.div>
          <h2 className="text-3xl font-black text-stone-800 mb-4">
            시편, 잠언, 창세기로<br />시작할게요!
          </h2>
          <p className="text-lg font-bold text-stone-500 mb-10">
            가장 인기 있는 성경으로 준비했어요
          </p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(BEGINNER_DEFAULTS)}
            className="btn-primary px-10 py-4 text-2xl"
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
    <div className="flex flex-col items-center min-h-screen p-6 max-w-md mx-auto pt-16 pb-32">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black text-stone-800 mb-10 text-center leading-tight"
      >
        어떤 말씀에<br />관심 있나요?
      </motion.h2>

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
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => togglePreset(preset)}
              className={`w-full flex items-center p-5 rounded-3xl ${preset.shadow} ${preset.color} transition-colors text-left relative ${active ? 'ring-4 ring-orange-300' : ''}`}
            >
              <div className="bg-white p-3 rounded-2xl mr-4 shadow-sm rotate-3">
                <Icon size={28} className={preset.iconColor} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-stone-800">{preset.label}</h3>
                <p className="text-base text-stone-600 font-bold">{preset.desc}</p>
              </div>
              {active && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 size={28} className="text-orange-500 shrink-0" />
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
            className="flex items-center gap-2 text-stone-500 font-black text-base mb-4 hover:text-orange-500 transition-colors"
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
                className="w-full overflow-hidden"
              >
                {/* Testament tabs */}
                <div className="flex bg-white p-1.5 rounded-3xl shadow-inner border-2 border-orange-100 mb-4">
                  <button
                    className={`flex-1 py-2.5 rounded-2xl font-black text-lg transition-colors ${
                      gridTestament === 'old' ? 'bg-white text-amber-600 shadow-sm border-2 border-amber-100' : 'text-stone-500'
                    }`}
                    onClick={() => setGridTestament('old')}
                  >
                    구약
                  </button>
                  <button
                    className={`flex-1 py-2.5 rounded-2xl font-black text-lg transition-colors ${
                      gridTestament === 'new' ? 'bg-white text-indigo-600 shadow-sm border-2 border-indigo-100' : 'text-stone-500'
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
                        className={`aspect-square rounded-3xl transition-colors flex flex-col justify-between p-2.5 text-left ${
                          active
                            ? isOld
                              ? 'bg-amber-200 shadow-[0_8px_0_var(--color-amber-400)] ring-4 ring-orange-300'
                              : 'bg-indigo-200 shadow-[0_8px_0_var(--color-indigo-400)] ring-4 ring-orange-300'
                            : isOld
                              ? 'bg-amber-100 shadow-[0_8px_0_var(--color-amber-300)] hover:bg-amber-200'
                              : 'bg-indigo-100 shadow-[0_8px_0_var(--color-indigo-300)] hover:bg-indigo-200'
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
