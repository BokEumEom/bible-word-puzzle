import { motion } from 'motion/react';
import { ChevronRight, LucideIcon } from 'lucide-react';

export interface SelectionOption<T extends string | number> {
  value: T;
  label: string;
  desc: string;
  icon: LucideIcon;
  accentClassName: string;
  badge?: string;
}

interface Props<T extends string | number> {
  title: string;
  description?: string;
  options: SelectionOption<T>[];
  onSelect: (value: T) => void;
}

export function SelectionStep<T extends string | number>({
  title,
  description,
  options,
  onSelect,
}: Props<T>) {
  return (
    <div className="flex min-h-screen items-center p-6 pt-20">
      <div className="mx-auto w-full max-w-md">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-center text-3xl font-black leading-tight text-stone-900"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8 text-center text-base font-bold text-stone-500"
          >
            {description}
          </motion.p>
        )}

        <div className="space-y-3">
          {options.map((option, index) => {
            const Icon = option.icon;

            return (
              <motion.button
                key={String(option.value)}
                data-testid="selection-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(option.value)}
                className="relative flex w-full items-center gap-4 rounded-3xl border border-stone-200 bg-white px-5 py-5 text-left shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50/40"
              >
                <div
                  data-testid="selection-icon-tile"
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${option.accentClassName}`}
                >
                  <Icon size={24} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-stone-900">{option.label}</h3>
                  <p className="mt-1 text-sm font-bold text-stone-500">{option.desc}</p>
                </div>

                <ChevronRight size={20} className="shrink-0 text-stone-300" />

                {option.badge && (
                  <span className="absolute right-5 top-4 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-black text-violet-600">
                    {option.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
