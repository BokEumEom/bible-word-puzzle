import { describe, it, expect } from 'vitest';
import { getWeekDates, getWeeklyStats, getMotivationalMessage, DailyHistory } from './dailyHistory';

describe('getWeekDates', () => {
  it('returns 7 dates starting from Monday', () => {
    // Wednesday 2026-03-18
    const dates = getWeekDates(new Date('2026-03-18'));
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe('2026-03-16'); // Monday
    expect(dates[6]).toBe('2026-03-22'); // Sunday
  });

  it('handles Sunday input (belongs to previous week)', () => {
    const dates = getWeekDates(new Date('2026-03-22'));
    expect(dates[0]).toBe('2026-03-16');
    expect(dates[6]).toBe('2026-03-22');
  });

  it('handles Monday input', () => {
    const dates = getWeekDates(new Date('2026-03-16'));
    expect(dates[0]).toBe('2026-03-16');
    expect(dates[6]).toBe('2026-03-22');
  });
});

describe('getWeeklyStats', () => {
  const history: DailyHistory = {
    '2026-03-16': { completions: 3, goalMet: true, xpEarned: 45 },
    '2026-03-17': { completions: 1, goalMet: false, xpEarned: 15 },
    '2026-03-19': { completions: 5, goalMet: true, xpEarned: 80 },
  };

  it('returns correct totals for the week', () => {
    const stats = getWeeklyStats(history, new Date('2026-03-18'));
    expect(stats.totalCompletions).toBe(9);
    expect(stats.totalXp).toBe(140);
    expect(stats.daysGoalMet).toBe(2);
    expect(stats.daysActive).toBe(3);
  });

  it('returns 7 daily completions with zeros for missing days', () => {
    const stats = getWeeklyStats(history, new Date('2026-03-18'));
    expect(stats.dailyCompletions).toEqual([3, 1, 0, 5, 0, 0, 0]);
  });

  it('returns all zeros for empty history', () => {
    const stats = getWeeklyStats({}, new Date('2026-03-18'));
    expect(stats.totalCompletions).toBe(0);
    expect(stats.daysActive).toBe(0);
    expect(stats.dailyCompletions).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });
});

describe('getMotivationalMessage', () => {
  it('returns start message for 0 days', () => {
    expect(getMotivationalMessage(0)).toContain('시작');
  });

  it('returns encouraging message for 1-3 days', () => {
    expect(getMotivationalMessage(2)).toContain('시작');
  });

  it('returns praise for 4-5 days', () => {
    expect(getMotivationalMessage(5)).toContain('잘하고');
  });

  it('returns perfect message for 6-7 days', () => {
    expect(getMotivationalMessage(7)).toContain('완벽');
  });
});
