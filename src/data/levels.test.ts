import { describe, it, expect } from 'vitest';
import { getLevelForXp, getNextLevel, getXpProgress, levels } from './levels';

describe('levels', () => {
  it('has 5 levels in ascending order', () => {
    expect(levels).toHaveLength(5);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i].minXp).toBeGreaterThan(levels[i - 1].minXp);
    }
  });

  it('first level starts at 0 XP', () => {
    expect(levels[0].minXp).toBe(0);
  });
});

describe('getLevelForXp', () => {
  it('returns level 1 for 0 XP', () => {
    expect(getLevelForXp(0)).toEqual(levels[0]);
  });

  it('returns level 1 for 49 XP', () => {
    expect(getLevelForXp(49)).toEqual(levels[0]);
  });

  it('returns level 2 at exactly 50 XP', () => {
    expect(getLevelForXp(50)).toEqual(levels[1]);
  });

  it('returns level 3 at 150 XP', () => {
    expect(getLevelForXp(150)).toEqual(levels[2]);
  });

  it('returns level 5 at 500+ XP', () => {
    expect(getLevelForXp(999)).toEqual(levels[4]);
  });

  it('returns level 1 for negative XP', () => {
    expect(getLevelForXp(-10)).toEqual(levels[0]);
  });
});

describe('getNextLevel', () => {
  it('returns level 2 when current is 1', () => {
    expect(getNextLevel(1)).toEqual(levels[1]);
  });

  it('returns null when at max level', () => {
    expect(getNextLevel(5)).toBeNull();
  });

  it('returns null for invalid level', () => {
    expect(getNextLevel(99)).toBeNull();
  });
});

describe('getXpProgress', () => {
  it('returns 0 progress at start of level', () => {
    const result = getXpProgress(0);
    expect(result).toEqual({ current: 0, next: 50, progress: 0 });
  });

  it('returns correct mid-level progress', () => {
    const result = getXpProgress(25);
    expect(result).toEqual({ current: 25, next: 50, progress: 0.5 });
  });

  it('returns progress within level 2', () => {
    const result = getXpProgress(100);
    expect(result).toEqual({ current: 50, next: 100, progress: 0.5 });
  });

  it('returns full progress at max level', () => {
    const result = getXpProgress(600);
    expect(result).toEqual({ current: 600, next: 600, progress: 1 });
  });
});
