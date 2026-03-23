import { LucideIcon } from 'lucide-react';

interface Props {
  readonly icon?: LucideIcon;
  readonly iconColor?: string;
  readonly children: React.ReactNode;
}

/**
 * 섹션 제목 — 아이콘 + 텍스트 패턴 표준화.
 * Dashboard, CollectionList, ProfileScreen 등에서 공통 사용.
 */
export function SectionTitle({ icon: Icon, iconColor = 'text-stone-500', children }: Props) {
  return (
    <h2 className="text-lg font-black text-stone-800 mb-3 flex items-center gap-2">
      {Icon && <Icon className={iconColor} size={20} />}
      {children}
    </h2>
  );
}
