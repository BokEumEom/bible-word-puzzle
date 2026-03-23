import { describe, it, expect } from 'vitest';
import { collections } from './collections';

describe('collections data', () => {
  it('has 8 collections', () => {
    expect(collections).toHaveLength(8);
  });

  it('has no duplicate IDs', () => {
    const ids = collections.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every collection has required fields', () => {
    for (const c of collections) {
      expect(c.id).toBeTruthy();
      expect(c.emoji).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(c.color).toBeTruthy();
      expect(c.verses.length).toBeGreaterThan(0);
    }
  });

  it('every verse has required fields', () => {
    for (const c of collections) {
      for (const v of c.verses) {
        expect(v.bookId).toBeTruthy();
        expect(v.chapter).toBeGreaterThan(0);
        expect(v.verse).toBeGreaterThan(0);
        expect(v.reference).toBeTruthy();
        expect(v.hint).toBeTruthy();
        expect(['beginner', 'easy', 'normal']).toContain(v.difficulty);
      }
    }
  });

  it('unlock requirements reference existing collections', () => {
    const ids = new Set(collections.map(c => c.id));
    for (const c of collections) {
      if (c.unlockRequirement) {
        expect(ids).toContain(c.unlockRequirement.collectionId);
        expect(c.unlockRequirement.percent).toBeGreaterThan(0);
        expect(c.unlockRequirement.percent).toBeLessThanOrEqual(100);
      }
    }
  });
});
