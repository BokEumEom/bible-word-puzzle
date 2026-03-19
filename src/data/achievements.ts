import { UserProgress } from '../hooks/useUserProgress';
import { verses } from './verses';

export type AchievementCategory = '학습' | '연속' | '도전' | '헌신' | '수집';

export interface AchievementDef {
  readonly id: string;
  readonly name: string;
  readonly emoji: string;
  readonly description: string;
  readonly category: AchievementCategory;
  readonly check: (ctx: AchievementContext) => boolean;
}

export interface AchievementContext {
  readonly totalCompleted: number;
  readonly completedVerseIds: readonly string[];
  readonly streak: number;
  readonly xp: number;
  readonly favoriteCount: number;
  readonly currentLevel: number;
  readonly dailyGoalMetCount: number;
  readonly noHintCompletions: number;
  readonly uniqueBookCount: number;
  readonly hasCompletedNormal: boolean;
}

const BEGINNER_IDS = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] as const;
const ALL_PRESET_IDS = verses.map(v => v.id);
const NORMAL_IDS = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8'] as const;

export const achievements: readonly AchievementDef[] = [
  // 학습
  { id: 'first-clear', name: '첫 말씀', emoji: '🎯', description: '처음으로 말씀 퍼즐을 완료했어요', category: '학습',
    check: ctx => ctx.totalCompleted >= 1 },
  { id: 'five-clears', name: '다섯 걸음', emoji: '👣', description: '말씀 퍼즐을 5개 완료했어요', category: '학습',
    check: ctx => ctx.totalCompleted >= 5 },
  { id: 'ten-clears', name: '열 걸음', emoji: '🏃', description: '말씀 퍼즐을 10개 완료했어요', category: '학습',
    check: ctx => ctx.totalCompleted >= 10 },
  { id: 'all-beginner', name: '새싹 마스터', emoji: '🌱', description: '초급 말씀을 모두 완료했어요', category: '학습',
    check: ctx => BEGINNER_IDS.every(id => ctx.completedVerseIds.includes(id)) },
  { id: 'all-verses', name: '말씀 정복자', emoji: '👑', description: '모든 추천 말씀을 완료했어요', category: '학습',
    check: ctx => ALL_PRESET_IDS.every(id => ctx.completedVerseIds.includes(id)) },

  // 연속
  { id: 'streak-3', name: '꾸준한 시작', emoji: '🔥', description: '3일 연속 학습했어요', category: '연속',
    check: ctx => ctx.streak >= 3 },
  { id: 'streak-7', name: '일주일 습관', emoji: '💪', description: '7일 연속 학습했어요', category: '연속',
    check: ctx => ctx.streak >= 7 },
  { id: 'streak-14', name: '2주 챔피언', emoji: '🏆', description: '14일 연속 학습했어요', category: '연속',
    check: ctx => ctx.streak >= 14 },
  { id: 'streak-30', name: '한 달의 기적', emoji: '⭐', description: '30일 연속 학습했어요', category: '연속',
    check: ctx => ctx.streak >= 30 },

  // 도전
  { id: 'first-no-hint', name: '스스로 해냈어요', emoji: '💡', description: '힌트 없이 처음 완료했어요', category: '도전',
    check: ctx => ctx.noHintCompletions >= 1 },
  { id: 'five-no-hints', name: '힌트 불필요', emoji: '🧠', description: '힌트 없이 5번 완료했어요', category: '도전',
    check: ctx => ctx.noHintCompletions >= 5 },
  { id: 'first-normal', name: '도전자', emoji: '🎖️', description: '잘해요 난이도를 처음 완료했어요', category: '도전',
    check: ctx => ctx.hasCompletedNormal },

  // 헌신
  { id: 'goal-7', name: '목표 달성왕', emoji: '🎯', description: '일일 목표를 7번 달성했어요', category: '헌신',
    check: ctx => ctx.dailyGoalMetCount >= 7 },
  { id: 'level-max', name: '빛의 경지', emoji: '✨', description: '최고 레벨에 도달했어요', category: '헌신',
    check: ctx => ctx.currentLevel >= 5 },

  // 수집
  { id: 'three-favorites', name: '말씀 수집가', emoji: '💖', description: '좋아하는 말씀을 3개 모았어요', category: '수집',
    check: ctx => ctx.favoriteCount >= 3 },
  { id: 'five-books', name: '성경 탐험가', emoji: '📚', description: '5개 이상의 성경을 탐험했어요', category: '수집',
    check: ctx => ctx.uniqueBookCount >= 5 },
];

export function checkAchievements(
  alreadyUnlocked: readonly string[],
  context: AchievementContext,
): AchievementDef[] {
  return achievements.filter(
    def => !alreadyUnlocked.includes(def.id) && def.check(context),
  );
}

export function buildAchievementContext(
  progress: UserProgress,
  currentLevel: number,
): AchievementContext {
  const completedVerseIds = Object.keys(progress.completedVerses);

  const bookIdSet = new Set<string>();
  for (const vid of completedVerseIds) {
    const presetVerse = verses.find(v => v.id === vid);
    if (presetVerse?.bookId) {
      bookIdSet.add(presetVerse.bookId);
    }
  }

  const hasCompletedNormal = NORMAL_IDS.some(id => completedVerseIds.includes(id));

  return {
    totalCompleted: completedVerseIds.length,
    completedVerseIds,
    streak: progress.streak,
    xp: progress.xp,
    favoriteCount: progress.favoriteVerses.length,
    currentLevel,
    dailyGoalMetCount: progress.dailyGoalMetCount,
    noHintCompletions: progress.noHintCompletions,
    uniqueBookCount: bookIdSet.size,
    hasCompletedNormal,
  };
}
