import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserProgress } from './useUserProgress';

describe('useUserProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default progress when localStorage is empty', () => {
    const { result } = renderHook(() => useUserProgress());
    expect(result.current.progress.streak).toBe(0);
    expect(result.current.progress.recentVerses).toEqual([]);
    expect(result.current.progress.favoriteVerses).toEqual([]);
    expect(result.current.progress.completedVerses).toEqual({});
  });

  it('recovers from corrupted localStorage', () => {
    localStorage.setItem('bible_puzzle_progress', 'NOT_VALID_JSON{{{');
    const { result } = renderHook(() => useUserProgress());
    expect(result.current.progress.streak).toBe(0);
  });

  it('persists progress to localStorage', () => {
    const verse = {
      id: 'test-1',
      reference: 'Test 1:1',
      verse: 'test verse',
      words: ['test', 'verse'],
    };

    const { result } = renderHook(() => useUserProgress());
    act(() => {
      result.current.markCompleted(verse);
    });

    const stored = JSON.parse(localStorage.getItem('bible_puzzle_progress')!);
    expect(stored.completedVerses['test-1']).toBe(1);
  });

  it('toggleFavorite adds and removes', () => {
    const verse = {
      id: 'fav-1',
      reference: 'Test 1:1',
      verse: 'fav verse',
      words: ['fav'],
    };

    const { result } = renderHook(() => useUserProgress());

    act(() => result.current.toggleFavorite(verse));
    expect(result.current.progress.favoriteVerses).toHaveLength(1);

    act(() => result.current.toggleFavorite(verse));
    expect(result.current.progress.favoriteVerses).toHaveLength(0);
  });

  it('addRecent keeps max 10 and deduplicates', () => {
    const { result } = renderHook(() => useUserProgress());

    for (let i = 0; i < 12; i++) {
      const verse = {
        id: `v-${i}`,
        reference: `Test ${i}:1`,
        verse: `verse ${i}`,
        words: [`verse${i}`],
      };
      act(() => result.current.addRecent(verse));
    }

    expect(result.current.progress.recentVerses).toHaveLength(10);
    expect(result.current.progress.recentVerses[0].id).toBe('v-11');
  });

  it('merges partial localStorage data with defaults', () => {
    localStorage.setItem('bible_puzzle_progress', JSON.stringify({ streak: 5 }));
    const { result } = renderHook(() => useUserProgress());
    expect(result.current.progress.streak).toBe(5);
    expect(result.current.progress.recentVerses).toEqual([]);
    expect(result.current.progress.completedVerses).toEqual({});
  });

  it('updateStreak: same day does not change streak', () => {
    const { result } = renderHook(() => useUserProgress());
    act(() => result.current.updateStreak());
    const streakAfterFirst = result.current.progress.streak;

    act(() => result.current.updateStreak());
    expect(result.current.progress.streak).toBe(streakAfterFirst);
  });

  it('updateStreak: consecutive day increments streak', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    localStorage.setItem('bible_puzzle_progress', JSON.stringify({
      streak: 3,
      lastActiveDate: yesterdayStr,
      recentVerses: [],
      favoriteVerses: [],
      completedVerses: {},
    }));

    const { result } = renderHook(() => useUserProgress());
    act(() => result.current.updateStreak());
    expect(result.current.progress.streak).toBe(4);
  });

  it('updateStreak: gap resets streak to 1', () => {
    localStorage.setItem('bible_puzzle_progress', JSON.stringify({
      streak: 10,
      lastActiveDate: '2020-01-01',
      recentVerses: [],
      favoriteVerses: [],
      completedVerses: {},
    }));

    const { result } = renderHook(() => useUserProgress());
    act(() => result.current.updateStreak());
    expect(result.current.progress.streak).toBe(1);
  });

  it('returns default daily goal fields when localStorage is empty', () => {
    const { result } = renderHook(() => useUserProgress());
    expect(result.current.progress.dailyGoal).toBe(3);
    expect(result.current.progress.todayCompletions).toBe(0);
    expect(result.current.progress.todayCompletionDate).toBe('');
    expect(result.current.isDailyGoalMet).toBe(false);
  });

  it('increments todayCompletions on markCompleted', () => {
    const { result } = renderHook(() => useUserProgress());
    const verse = { id: 'dg-1', reference: 'Test 1:1', verse: 'test', words: ['test'] };

    act(() => result.current.markCompleted(verse));
    expect(result.current.progress.todayCompletions).toBe(1);

    const verse2 = { id: 'dg-2', reference: 'Test 1:2', verse: 'test2', words: ['test2'] };
    act(() => result.current.markCompleted(verse2));
    expect(result.current.progress.todayCompletions).toBe(2);
  });

  it('isDailyGoalMet becomes true when goal reached', () => {
    const { result } = renderHook(() => useUserProgress());

    for (let i = 0; i < 3; i++) {
      const verse = { id: `goal-${i}`, reference: `T ${i}:1`, verse: `v${i}`, words: [`v${i}`] };
      act(() => result.current.markCompleted(verse));
    }

    expect(result.current.isDailyGoalMet).toBe(true);
  });

  it('setDailyGoal updates the goal', () => {
    const { result } = renderHook(() => useUserProgress());
    act(() => result.current.setDailyGoal(5));
    expect(result.current.progress.dailyGoal).toBe(5);
  });

  it('resets todayCompletions on new day', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    localStorage.setItem('bible_puzzle_progress', JSON.stringify({
      ...{ streak: 1, lastActiveDate: yesterdayStr, recentVerses: [], favoriteVerses: [], completedVerses: {} },
      dailyGoal: 3,
      todayCompletions: 5,
      todayCompletionDate: yesterdayStr,
    }));

    const { result } = renderHook(() => useUserProgress());
    expect(result.current.progress.todayCompletions).toBe(5);

    const verse = { id: 'new-day-1', reference: 'T 1:1', verse: 'v', words: ['v'] };
    act(() => result.current.markCompleted(verse));
    expect(result.current.progress.todayCompletions).toBe(1);
  });

  it('handles localStorage write failure gracefully', () => {
    const { result } = renderHook(() => useUserProgress());

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const verse = {
      id: 'err-1',
      reference: 'Err 1:1',
      verse: 'error test',
      words: ['error'],
    };

    expect(() => {
      act(() => result.current.markCompleted(verse));
    }).not.toThrow();

    vi.restoreAllMocks();
  });
});
