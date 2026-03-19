import { describe, it, expect } from 'vitest';
import { achievements, checkAchievements, buildAchievementContext, AchievementContext } from './achievements';
import { UserProgress } from '../hooks/useUserProgress';

function makeContext(overrides: Partial<AchievementContext> = {}): AchievementContext {
  return {
    totalCompleted: 0,
    completedVerseIds: [],
    streak: 0,
    xp: 0,
    favoriteCount: 0,
    currentLevel: 1,
    dailyGoalMetCount: 0,
    noHintCompletions: 0,
    uniqueBookCount: 0,
    hasCompletedNormal: false,
    ...overrides,
  };
}

describe('achievement definitions', () => {
  it('has 16 achievements with unique ids', () => {
    expect(achievements).toHaveLength(16);
    const ids = achievements.map(a => a.id);
    expect(new Set(ids).size).toBe(16);
  });

  it('every achievement has required fields', () => {
    for (const a of achievements) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.emoji).toBeTruthy();
      expect(a.description).toBeTruthy();
      expect(a.category).toBeTruthy();
      expect(typeof a.check).toBe('function');
    }
  });

  it('categories are valid', () => {
    const validCategories = ['학습', '연속', '도전', '헌신', '수집'];
    for (const a of achievements) {
      expect(validCategories).toContain(a.category);
    }
  });
});

describe('checkAchievements', () => {
  it('returns empty array when no conditions met', () => {
    const result = checkAchievements([], makeContext());
    expect(result).toEqual([]);
  });

  it('returns first-clear when totalCompleted >= 1', () => {
    const result = checkAchievements([], makeContext({ totalCompleted: 1, completedVerseIds: ['b1'] }));
    expect(result.some(a => a.id === 'first-clear')).toBe(true);
  });

  it('does not return already-unlocked achievements', () => {
    const result = checkAchievements(['first-clear'], makeContext({ totalCompleted: 1, completedVerseIds: ['b1'] }));
    expect(result.some(a => a.id === 'first-clear')).toBe(false);
  });

  it('returns streak-3 when streak >= 3', () => {
    const result = checkAchievements([], makeContext({ streak: 3 }));
    expect(result.some(a => a.id === 'streak-3')).toBe(true);
  });

  it('returns multiple achievements at once', () => {
    const result = checkAchievements([], makeContext({
      totalCompleted: 1,
      completedVerseIds: ['b1'],
      noHintCompletions: 1,
    }));
    const ids = result.map(a => a.id);
    expect(ids).toContain('first-clear');
    expect(ids).toContain('first-no-hint');
  });

  it('returns all-beginner when b1-b6 all completed', () => {
    const ids = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'];
    const result = checkAchievements([], makeContext({
      totalCompleted: 6,
      completedVerseIds: ids,
    }));
    expect(result.some(a => a.id === 'all-beginner')).toBe(true);
  });

  it('does not return all-beginner with only 5 of 6', () => {
    const ids = ['b1', 'b2', 'b3', 'b4', 'b5'];
    const result = checkAchievements([], makeContext({
      totalCompleted: 5,
      completedVerseIds: ids,
    }));
    expect(result.some(a => a.id === 'all-beginner')).toBe(false);
  });

  it('returns five-books when uniqueBookCount >= 5', () => {
    const result = checkAchievements([], makeContext({ uniqueBookCount: 5 }));
    expect(result.some(a => a.id === 'five-books')).toBe(true);
  });

  it('returns level-max when currentLevel >= 5', () => {
    const result = checkAchievements([], makeContext({ currentLevel: 5 }));
    expect(result.some(a => a.id === 'level-max')).toBe(true);
  });

  it('returns first-normal when hasCompletedNormal', () => {
    const result = checkAchievements([], makeContext({ hasCompletedNormal: true }));
    expect(result.some(a => a.id === 'first-normal')).toBe(true);
  });

  it('returns three-favorites when favoriteCount >= 3', () => {
    const result = checkAchievements([], makeContext({ favoriteCount: 3 }));
    expect(result.some(a => a.id === 'three-favorites')).toBe(true);
  });

  it('returns goal-7 when dailyGoalMetCount >= 7', () => {
    const result = checkAchievements([], makeContext({ dailyGoalMetCount: 7 }));
    expect(result.some(a => a.id === 'goal-7')).toBe(true);
  });

  it('is a pure function (same input yields same output)', () => {
    const ctx = makeContext({ totalCompleted: 5, completedVerseIds: ['b1', 'b2', 'b3', 'b4', 'b5'] });
    const result1 = checkAchievements([], ctx);
    const result2 = checkAchievements([], ctx);
    expect(result1.map(a => a.id)).toEqual(result2.map(a => a.id));
  });
});

describe('buildAchievementContext', () => {
  const makeProgress = (overrides: Partial<UserProgress> = {}): UserProgress => ({
    streak: 0,
    lastActiveDate: '',
    recentVerses: [],
    favoriteVerses: [],
    completedVerses: {},
    dailyGoal: 3,
    todayCompletions: 0,
    todayCompletionDate: '',
    onboarding: { level: 'beginner', interests: [], onboardingCompleted: true },
    xp: 0,
    unlockedAchievements: [],
    dailyGoalMetCount: 0,
    noHintCompletions: 0,
    reviewData: {},
    ...overrides,
  });

  it('counts unique books from completedVerses', () => {
    // b1 → 1th, e1 → psa, e2 → jhn (3 unique books)
    const ctx = buildAchievementContext(makeProgress({
      completedVerses: { b1: 1, e1: 1, e2: 1 },
    }), 1);
    expect(ctx.uniqueBookCount).toBe(3);
  });

  it('detects normal difficulty completion', () => {
    const ctx = buildAchievementContext(makeProgress({
      completedVerses: { n1: 1 },
    }), 1);
    expect(ctx.hasCompletedNormal).toBe(true);
  });

  it('returns false for hasCompletedNormal when no normal verses', () => {
    const ctx = buildAchievementContext(makeProgress({
      completedVerses: { b1: 1, e1: 1 },
    }), 1);
    expect(ctx.hasCompletedNormal).toBe(false);
  });

  it('returns correct counts', () => {
    const ctx = buildAchievementContext(makeProgress({
      completedVerses: { b1: 2, b2: 1 },
      streak: 5,
      xp: 100,
      favoriteVerses: [
        { id: 'b1', reference: 'T', verse: 'v', words: ['v'] },
        { id: 'b2', reference: 'T', verse: 'v', words: ['v'] },
      ],
      noHintCompletions: 3,
      dailyGoalMetCount: 2,
    }), 3);
    expect(ctx.totalCompleted).toBe(2);
    expect(ctx.streak).toBe(5);
    expect(ctx.xp).toBe(100);
    expect(ctx.favoriteCount).toBe(2);
    expect(ctx.currentLevel).toBe(3);
    expect(ctx.noHintCompletions).toBe(3);
    expect(ctx.dailyGoalMetCount).toBe(2);
  });
});
