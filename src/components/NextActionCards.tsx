import { motion } from 'motion/react';
import { RotateCcw, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { Verse } from '../types';
import { NextAction, NextActionType } from '../utils/recommend';
import { ReviewUrgency } from '../utils/spaced';

interface Props {
  actions: NextAction[];
  onSelectVerse: (verse: Verse) => void;
}

interface CardStyle {
  icon: typeof RotateCcw;
  color: string;
  border: string;
  iconColor: string;
  iconBg: string;
}

const urgencyStyles: Record<ReviewUrgency, Omit<CardStyle, 'icon'>> = {
  low: {
    color: 'bg-emerald-50/80 hover:bg-emerald-100/80',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100',
  },
  medium: {
    color: 'bg-amber-50/80 hover:bg-amber-100/80',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100',
  },
  high: {
    color: 'bg-rose-50/80 hover:bg-rose-100/80',
    border: 'border-rose-200',
    iconColor: 'text-rose-500',
    iconBg: 'bg-rose-100',
  },
};

const cardConfig: Record<NextActionType, CardStyle> = {
  review: {
    icon: RotateCcw,
    color: 'bg-emerald-50/80 hover:bg-emerald-100/80',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-100',
  },
  new: {
    icon: Sparkles,
    color: 'bg-violet-50/80 hover:bg-violet-100/80',
    border: 'border-violet-200',
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-100',
  },
  challenge: {
    icon: TrendingUp,
    color: 'bg-amber-50/80 hover:bg-amber-100/80',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-100',
  },
};

export function NextActionCards({ actions, onSelectVerse }: Props) {
  if (actions.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-black text-stone-800 mb-4 flex items-center gap-2">
        <Sparkles className="text-violet-500" size={28} />
        다음 할 일
      </h2>
      <div className="flex flex-col gap-3">
        {actions.map((action, index) => {
          const baseConfig = cardConfig[action.type];
          const urgencyOverride = action.type === 'review' && action.urgency
            ? urgencyStyles[action.urgency]
            : null;
          const style = urgencyOverride
            ? { ...baseConfig, ...urgencyOverride }
            : baseConfig;
          const Icon = style.icon;
          const isHighUrgency = action.type === 'review' && action.urgency === 'high';
          return (
            <motion.button
              key={action.type}
              initial={{ opacity: 0, x: -20 }}
              animate={isHighUrgency
                ? { opacity: 1, x: 0, scale: [1, 1.01, 1] }
                : { opacity: 1, x: 0 }
              }
              transition={isHighUrgency
                ? { delay: index * 0.1, scale: { repeat: Infinity, duration: 2 } }
                : { delay: index * 0.1, type: 'spring', stiffness: 200 }
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectVerse(action.verse)}
              className={`w-full backdrop-blur-sm p-4 rounded-[2rem] border-b-4 ${style.border} ${style.color} shadow-sm transition-colors text-left flex items-center`}
            >
              <div className={`${style.iconBg} p-3 rounded-2xl mr-4 shadow-sm shrink-0`}>
                <Icon size={22} className={style.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-stone-500">{action.label}</span>
                  {isHighUrgency && (
                    <span className="text-xs font-black text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full">
                      긴급
                    </span>
                  )}
                </div>
                <p className="text-base font-bold text-stone-700 truncate">
                  {action.description}
                </p>
              </div>
              <ChevronRight size={20} className="text-stone-300 shrink-0 ml-2" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
