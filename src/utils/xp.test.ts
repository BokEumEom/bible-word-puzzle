import { describe, it, expect } from 'vitest';
import { calculateXp } from './xp';

describe('calculateXp', () => {
  it('gives base 10 XP for new verse', () => {
    const result = calculateXp({
      usedHint: true,
      isDailyGoalJustMet: false,
      streak: 0,
      isReview: false,
    });
    expect(result.base).toBe(10);
    expect(result.noHintBonus).toBe(0);
    expect(result.dailyGoalBonus).toBe(0);
    expect(result.streakBonus).toBe(0);
    expect(result.total).toBe(10);
  });

  it('gives base 5 XP for review', () => {
    const result = calculateXp({
      usedHint: false,
      isDailyGoalJustMet: false,
      streak: 0,
      isReview: true,
    });
    expect(result.base).toBe(5);
    expect(result.noHintBonus).toBe(0); // no hint bonus for review
    expect(result.total).toBe(5);
  });

  it('gives +5 no-hint bonus for new verse without hint', () => {
    const result = calculateXp({
      usedHint: false,
      isDailyGoalJustMet: false,
      streak: 0,
      isReview: false,
    });
    expect(result.noHintBonus).toBe(5);
    expect(result.total).toBe(15);
  });

  it('gives +15 daily goal bonus when goal just met', () => {
    const result = calculateXp({
      usedHint: true,
      isDailyGoalJustMet: true,
      streak: 0,
      isReview: false,
    });
    expect(result.dailyGoalBonus).toBe(15);
    expect(result.total).toBe(25);
  });

  it('gives streak bonus for streak > 1', () => {
    const result = calculateXp({
      usedHint: true,
      isDailyGoalJustMet: false,
      streak: 5,
      isReview: false,
    });
    expect(result.streakBonus).toBe(10); // 5 * 2
    expect(result.total).toBe(20);
  });

  it('gives no streak bonus for streak of 1', () => {
    const result = calculateXp({
      usedHint: true,
      isDailyGoalJustMet: false,
      streak: 1,
      isReview: false,
    });
    expect(result.streakBonus).toBe(0);
  });

  it('stacks all bonuses correctly', () => {
    const result = calculateXp({
      usedHint: false,
      isDailyGoalJustMet: true,
      streak: 3,
      isReview: false,
    });
    expect(result.base).toBe(10);
    expect(result.noHintBonus).toBe(5);
    expect(result.dailyGoalBonus).toBe(15);
    expect(result.streakBonus).toBe(6); // 3 * 2
    expect(result.total).toBe(36);
  });

  it('does not give no-hint bonus for review even without hint', () => {
    const result = calculateXp({
      usedHint: false,
      isDailyGoalJustMet: false,
      streak: 0,
      isReview: true,
    });
    expect(result.noHintBonus).toBe(0);
  });
});
