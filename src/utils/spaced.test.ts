import { describe, it, expect } from 'vitest';
import { updateReview, getDueReviews, getReviewUrgency, ReviewData, ReviewMap } from './spaced';

describe('updateReview', () => {
  it('creates strength 1 for new verse', () => {
    const result = updateReview(undefined, true, '2026-03-19');
    expect(result.strength).toBe(1);
    expect(result.lastReviewedAt).toBe('2026-03-19');
    expect(result.nextReviewAt).toBe('2026-03-20'); // +1 day
  });

  it('creates strength 1 for new verse even on failure', () => {
    const result = updateReview(undefined, false, '2026-03-19');
    expect(result.strength).toBe(1);
    expect(result.nextReviewAt).toBe('2026-03-20');
  });

  it('increments strength on success', () => {
    const current: ReviewData = { strength: 1, lastReviewedAt: '2026-03-18', nextReviewAt: '2026-03-19' };
    const result = updateReview(current, true, '2026-03-19');
    expect(result.strength).toBe(2);
    expect(result.nextReviewAt).toBe('2026-03-22'); // +3 days
  });

  it('progresses through all intervals', () => {
    let data: ReviewData = { strength: 2, lastReviewedAt: '2026-03-01', nextReviewAt: '2026-03-04' };

    data = updateReview(data, true, '2026-03-04'); // → strength 3
    expect(data.strength).toBe(3);
    expect(data.nextReviewAt).toBe('2026-03-11'); // +7 days

    data = updateReview(data, true, '2026-03-11'); // → strength 4
    expect(data.strength).toBe(4);
    expect(data.nextReviewAt).toBe('2026-03-25'); // +14 days

    data = updateReview(data, true, '2026-03-25'); // → strength 5
    expect(data.strength).toBe(5);
    expect(data.nextReviewAt).toBe('2026-04-24'); // +30 days
  });

  it('caps strength at 5', () => {
    const current: ReviewData = { strength: 5, lastReviewedAt: '2026-03-01', nextReviewAt: '2026-03-31' };
    const result = updateReview(current, true, '2026-03-31');
    expect(result.strength).toBe(5);
    expect(result.nextReviewAt).toBe('2026-04-30'); // +30 days
  });

  it('resets strength to 1 on failure', () => {
    const current: ReviewData = { strength: 4, lastReviewedAt: '2026-03-01', nextReviewAt: '2026-03-15' };
    const result = updateReview(current, false, '2026-03-15');
    expect(result.strength).toBe(1);
    expect(result.nextReviewAt).toBe('2026-03-16'); // +1 day
  });
});

describe('getDueReviews', () => {
  it('returns empty array for empty reviewMap', () => {
    expect(getDueReviews({}, '2026-03-19')).toEqual([]);
  });

  it('returns due reviews only', () => {
    const reviewMap: ReviewMap = {
      'v1': { strength: 1, lastReviewedAt: '2026-03-17', nextReviewAt: '2026-03-18' }, // overdue
      'v2': { strength: 2, lastReviewedAt: '2026-03-17', nextReviewAt: '2026-03-25' }, // not due
      'v3': { strength: 1, lastReviewedAt: '2026-03-18', nextReviewAt: '2026-03-19' }, // due today
    };
    const result = getDueReviews(reviewMap, '2026-03-19');
    expect(result).toHaveLength(2);
    expect(result[0].verseId).toBe('v1'); // most overdue first
    expect(result[0].overdueDays).toBe(1);
    expect(result[1].verseId).toBe('v3');
    expect(result[1].overdueDays).toBe(0);
  });

  it('excludes future reviews', () => {
    const reviewMap: ReviewMap = {
      'v1': { strength: 3, lastReviewedAt: '2026-03-19', nextReviewAt: '2026-03-26' },
    };
    const result = getDueReviews(reviewMap, '2026-03-19');
    expect(result).toHaveLength(0);
  });

  it('sorts by overdue days descending', () => {
    const reviewMap: ReviewMap = {
      'v1': { strength: 1, lastReviewedAt: '2026-03-10', nextReviewAt: '2026-03-15' }, // 4 days overdue
      'v2': { strength: 1, lastReviewedAt: '2026-03-12', nextReviewAt: '2026-03-13' }, // 6 days overdue
      'v3': { strength: 1, lastReviewedAt: '2026-03-18', nextReviewAt: '2026-03-19' }, // 0 days overdue
    };
    const result = getDueReviews(reviewMap, '2026-03-19');
    expect(result[0].verseId).toBe('v2');
    expect(result[1].verseId).toBe('v1');
    expect(result[2].verseId).toBe('v3');
  });
});

describe('getReviewUrgency', () => {
  it('returns low for 0-1 overdue days', () => {
    expect(getReviewUrgency(0)).toBe('low');
    expect(getReviewUrgency(1)).toBe('low');
  });

  it('returns medium for 2-3 overdue days', () => {
    expect(getReviewUrgency(2)).toBe('medium');
    expect(getReviewUrgency(3)).toBe('medium');
  });

  it('returns high for 4+ overdue days', () => {
    expect(getReviewUrgency(4)).toBe('high');
    expect(getReviewUrgency(10)).toBe('high');
  });
});
