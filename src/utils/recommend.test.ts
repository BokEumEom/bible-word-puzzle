import { describe, it, expect } from 'vitest';
import { getRecommendations, RecommendationInput } from './recommend';
import { Verse } from '../types';

const makeVerse = (id: string, bookId: string, difficulty: 'beginner' | 'easy' | 'normal'): Verse => ({
  id,
  bookId,
  difficulty,
  reference: `${bookId} ref`,
  verse: `verse ${id}`,
  words: ['word'],
});

const testVerses: Verse[] = [
  makeVerse('b1', 'psa', 'beginner'),
  makeVerse('b2', 'gen', 'beginner'),
  makeVerse('e1', 'psa', 'easy'),
  makeVerse('e2', 'mat', 'easy'),
  makeVerse('n1', 'pro', 'normal'),
  makeVerse('n2', 'psa', 'normal'),
];

function makeInput(overrides: Partial<RecommendationInput> = {}): RecommendationInput {
  return {
    allVerses: testVerses,
    interests: ['psa', 'pro'],
    level: 'beginner',
    completedVerses: {},
    dateSeed: 42,
    ...overrides,
  };
}

describe('getRecommendations', () => {
  describe('dailyVerse', () => {
    it('selects interest-matched uncompleted verse', () => {
      const result = getRecommendations(makeInput());
      expect(result.dailyVerse.reason).toBe('interest');
      expect(['psa', 'pro']).toContain(result.dailyVerse.verse.bookId);
    });

    it('falls back to any uncompleted when no interest match', () => {
      const result = getRecommendations(makeInput({ interests: [] }));
      expect(result.dailyVerse.reason).toBe('uncompleted');
    });

    it('falls back to any verse when all completed', () => {
      const allCompleted: Record<string, number> = {};
      for (const v of testVerses) allCompleted[v.id] = 1;

      const result = getRecommendations(makeInput({ completedVerses: allCompleted }));
      expect(result.dailyVerse.reason).toBe('fallback');
    });

    it('picks interest uncompleted even if non-interest are also uncompleted', () => {
      const result = getRecommendations(makeInput({
        completedVerses: { b1: 1 }, // psa completed, but e1/n1/n2 still uncompleted
      }));
      expect(result.dailyVerse.reason).toBe('interest');
      expect(['psa', 'pro']).toContain(result.dailyVerse.verse.bookId);
    });

    it('different dateSeed can produce different verses', () => {
      const r1 = getRecommendations(makeInput({ dateSeed: 0 }));
      const r2 = getRecommendations(makeInput({ dateSeed: 1 }));
      const r3 = getRecommendations(makeInput({ dateSeed: 2 }));
      const r4 = getRecommendations(makeInput({ dateSeed: 3 }));

      const ids = new Set([r1, r2, r3, r4].map(r => r.dailyVerse.verse.id));
      // With 4 interest-matched verses (b1, e1, n1, n2), at least 2 should differ
      expect(ids.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe('nextActions', () => {
    it('shows no review card when nothing completed', () => {
      const result = getRecommendations(makeInput());
      expect(result.nextActions.find(a => a.type === 'review')).toBeUndefined();
    });

    it('shows review card when verses completed', () => {
      const result = getRecommendations(makeInput({ completedVerses: { b1: 1 } }));
      const review = result.nextActions.find(a => a.type === 'review');
      expect(review).toBeDefined();
      expect(review!.verse.id).toBe('b1');
      expect(review!.label).toBe('복습하기');
    });

    it('review prefers interest-matched verse with lowest count', () => {
      const result = getRecommendations(makeInput({
        completedVerses: { b1: 3, e1: 1, e2: 1 },
      }));
      const review = result.nextActions.find(a => a.type === 'review');
      // e1 (psa, interest-matched, count 1) should be preferred over e2 (mat, not interest)
      expect(review!.verse.id).toBe('e1');
    });

    it('shows new card when interest uncompleted exist', () => {
      const result = getRecommendations(makeInput());
      const newAction = result.nextActions.find(a => a.type === 'new');
      expect(newAction).toBeDefined();
      expect(['psa', 'pro']).toContain(newAction!.verse.bookId);
    });

    it('new card is different from dailyVerse', () => {
      const result = getRecommendations(makeInput());
      const newAction = result.nextActions.find(a => a.type === 'new');
      if (newAction) {
        expect(newAction.verse.id).not.toBe(result.dailyVerse.verse.id);
      }
    });

    it('no new card when all interest verses completed', () => {
      const result = getRecommendations(makeInput({
        completedVerses: { b1: 1, e1: 1, n1: 1, n2: 1 },
      }));
      expect(result.nextActions.find(a => a.type === 'new')).toBeUndefined();
    });

    it('shows challenge card for beginner (picks easy verse)', () => {
      const result = getRecommendations(makeInput({ level: 'beginner' }));
      const challenge = result.nextActions.find(a => a.type === 'challenge');
      expect(challenge).toBeDefined();
      expect(challenge!.verse.difficulty).toBe('easy');
      expect(challenge!.label).toBe('도전!');
    });

    it('shows challenge card for easy (picks normal verse)', () => {
      const result = getRecommendations(makeInput({ level: 'easy' }));
      const challenge = result.nextActions.find(a => a.type === 'challenge');
      expect(challenge).toBeDefined();
      expect(challenge!.verse.difficulty).toBe('normal');
    });

    it('no challenge card for normal level', () => {
      const result = getRecommendations(makeInput({ level: 'normal' }));
      expect(result.nextActions.find(a => a.type === 'challenge')).toBeUndefined();
    });

    it('returns at most 3 actions', () => {
      const result = getRecommendations(makeInput({ completedVerses: { b1: 1 } }));
      expect(result.nextActions.length).toBeLessThanOrEqual(3);
    });
  });

  it('does not mutate input arrays', () => {
    const input = makeInput();
    const versesBefore = [...input.allVerses];
    const interestsBefore = [...input.interests];
    getRecommendations(input);
    expect(input.allVerses).toEqual(versesBefore);
    expect(input.interests).toEqual(interestsBefore);
  });
});
