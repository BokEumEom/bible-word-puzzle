/**
 * Design System Tokens
 *
 * 듀오링고 스타일 디자인 시스템의 단일 소스 오브 트루스.
 * 모든 컴포넌트는 이 토큰을 참조하여 일관된 UI를 유지합니다.
 */

// ─── Color Roles ─────────────────────────────────────────
// 색상은 역할 기반으로 사용. orange/amber/emerald 등 원색 이름 대신 역할 이름으로.
export const colors = {
  /** 주요 액션 (CTA 버튼, 활성 상태) — orange */
  primary: {
    bg: 'bg-orange-400',
    bgHover: 'hover:bg-orange-500',
    bgLight: 'bg-orange-50',
    text: 'text-orange-500',
    textDark: 'text-orange-700',
    border: 'border-orange-200',
    borderActive: 'border-orange-600',
  },
  /** 정답/성공/완료 — emerald */
  success: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    bgLight: 'bg-emerald-50',
    bgMedium: 'bg-emerald-100',
    text: 'text-emerald-600',
    textDark: 'text-emerald-700',
    border: 'border-emerald-200',
    borderActive: 'border-emerald-700',
  },
  /** 오답/주의/힌트 — amber */
  warning: {
    bg: 'bg-amber-400',
    bgHover: 'hover:bg-amber-500',
    bgLight: 'bg-amber-50',
    bgMedium: 'bg-amber-100',
    text: 'text-amber-600',
    textDark: 'text-amber-700',
    border: 'border-amber-200',
    borderActive: 'border-amber-600',
  },
  /** 목표/진행/XP — violet */
  info: {
    bg: 'bg-violet-500',
    bgLight: 'bg-violet-50',
    bgMedium: 'bg-violet-100',
    text: 'text-violet-500',
    textDark: 'text-violet-600',
    border: 'border-violet-200',
  },
  /** 즐겨찾기/사랑 — rose */
  favorite: {
    bg: 'bg-rose-400',
    bgLight: 'bg-rose-50',
    bgMedium: 'bg-rose-100',
    text: 'text-rose-500',
    border: 'border-rose-200',
  },
  /** 스트릭/불꽃 — orange (primary와 동일 계열) */
  streak: {
    text: 'text-orange-500',
    bg: 'bg-orange-100',
  },
  /** 중립/비활성 */
  neutral: {
    bg: 'bg-stone-200',
    bgLight: 'bg-stone-100',
    text: 'text-stone-600',
    textLight: 'text-stone-400',
    textDark: 'text-stone-800',
    border: 'border-stone-200',
  },
  /** 카드/컨테이너 배경 */
  surface: {
    card: 'bg-white/90 backdrop-blur-sm',
    cardSolid: 'bg-white',
    overlay: 'bg-black/30 backdrop-blur-sm',
  },
} as const;

// ─── Typography ──────────────────────────────────────────
export const typography = {
  /** 페이지 제목 */
  h1: 'text-3xl font-black text-stone-800',
  /** 섹션 제목 */
  h2: 'text-xl font-black text-stone-800',
  /** 카드 내 제목 */
  h3: 'text-lg font-black text-stone-700',
  /** 본문 텍스트 */
  body: 'text-base font-bold text-stone-700',
  /** 작은 본문 */
  bodySmall: 'text-sm font-bold text-stone-600',
  /** 라벨 (상단 작은 글씨) */
  label: 'text-xs font-black uppercase tracking-wide',
  /** 캡션 (최소 텍스트) */
  caption: 'text-[10px] font-bold text-stone-400',
  /** 숫자 강조 */
  stat: 'text-xl font-black',
} as const;

// ─── Border Radius (3단계만) ─────────────────────────────
export const radius = {
  /** 작은 요소: 태그, 뱃지, 아이콘 배경 */
  sm: 'rounded-xl',
  /** 표준: 카드, 컨테이너, 입력 */
  md: 'rounded-2xl',
  /** 큰 요소: 모달, 전체 카드, 주요 버튼 */
  lg: 'rounded-3xl',
  /** 원형: 아바타, 알약 버튼 */
  full: 'rounded-full',
} as const;

// ─── Shadows (3단계만) ───────────────────────────────────
export const shadows = {
  /** 카드, 일반 컨테이너 */
  sm: 'shadow-sm',
  /** 강조 카드, 떠있는 요소 */
  md: 'shadow-md',
  /** 모달, 셀레브레이션 */
  lg: 'shadow-lg',
} as const;

// ─── Spacing ─────────────────────────────────────────────
export const spacing = {
  /** 카드 내부 패딩 — 작은 카드 */
  cardSm: 'p-4',
  /** 카드 내부 패딩 — 일반 */
  cardMd: 'p-5',
  /** 카드 내부 패딩 — 큰 카드/모달 */
  cardLg: 'p-6',
  /** 섹션 간 간격 */
  sectionGap: 'mb-6',
  /** 아이템 간 간격 */
  itemGap: 'gap-3',
  /** 페이지 패딩 */
  page: 'p-4 max-w-md mx-auto',
  /** 페이지 패딩 — 넓은 */
  pageWide: 'p-4 max-w-2xl mx-auto',
} as const;

// ─── Animations (Motion 프리셋) ──────────────────────────
export const animations = {
  /** 빠른 피드백 (탭, 클릭 반응) */
  fast: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  /** 표준 트랜지션 (화면 전환, 카드 등장) */
  standard: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
  /** 느린 등장 (프로그래스 바, 로딩) */
  slow: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
  },
  /** 셀레브레이션 (바운스 큰 것) */
  celebration: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 15,
  },
  /** 스태거 딜레이 간격 */
  stagger: {
    short: 0.05,
    medium: 0.1,
    long: 0.15,
  },
} as const;

// ─── 3D 버튼 스타일 (듀오링고 시그니처) ──────────────────
export const button3d = {
  /** 주요 CTA 버튼 — bottom border로 입체감 */
  active: 'border-b-4 active:border-b-0 active:translate-y-1 transition-transform',
  /** 비활성 */
  disabled: 'cursor-not-allowed opacity-60',
} as const;

// ─── 조합 프리셋 (자주 쓰는 패턴) ────────────────────────
export const presets = {
  /** 기본 카드 */
  card: `${colors.surface.card} ${radius.md} ${shadows.sm} border-2 ${colors.primary.border} ${spacing.cardSm}`,
  /** 피처드 카드 (메인 CTA) */
  cardFeatured: `${colors.surface.card} ${radius.lg} ${shadows.md} border-4 ${colors.primary.border} ${spacing.cardMd}`,
  /** 통계 아이콘 배경 */
  statIcon: `p-2 ${radius.sm}`,
  /** 수평 스크롤 아이템 */
  scrollItem: `shrink-0 w-44 ${colors.surface.card} ${spacing.cardSm} ${radius.md} ${shadows.sm} border-b-4 text-left hover:bg-white transition-colors`,
} as const;
