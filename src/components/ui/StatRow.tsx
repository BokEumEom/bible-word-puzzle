import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { animations } from '../../design/tokens';

interface Props {
  readonly icon: LucideIcon;
  readonly iconColor: string;
  readonly iconBg: string;
  readonly label: string;
  readonly value: string | number;
  readonly valueColor?: string;
  readonly delay?: number;
}

/**
 * 통계 행 컴포넌트 — ResultScreen, CompletionScreen, ProfileScreen 등에서 공통 사용.
 * 아이콘 + 라벨 + 값 패턴을 표준화합니다.
 */
export function StatRow({ icon: Icon, iconColor, iconBg, label, value, valueColor = 'text-stone-700', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...animations.standard, delay }}
      className="flex items-center gap-3 px-5 py-4"
    >
      <div className={`stat-icon ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="text-left">
        <p className="text-xs font-bold text-stone-400">{label}</p>
        <p className={`text-xl font-black ${valueColor}`}>{value}</p>
      </div>
    </motion.div>
  );
}
