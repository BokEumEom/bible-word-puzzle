import { describe, it, expect } from 'vitest';
import { getCollectionProgress, getNextVerseInCollection, toVerseId } from './collectionProgress';
import { Collection, CollectionVerse } from '../data/collections';

const makeVerse = (bookId: string, chapter: number, verse: number): CollectionVerse => ({
  bookId,
  chapter,
  verse,
  reference: `${bookId} ${chapter}:${verse}`,
  hint: 'hint',
  difficulty: 'beginner',
});

const makeCollection = (verses: CollectionVerse[]): Collection => ({
  id: 'test',
  emoji: '📖',
  title: 'Test',
  description: 'Test collection',
  color: 'rose',
  verses,
});

describe('toVerseId', () => {
  it('returns "bookId-chapter-verse" format', () => {
    expect(toVerseId(makeVerse('rom', 5, 8))).toBe('rom-5-8');
  });

  it('handles multi-character bookId', () => {
    expect(toVerseId(makeVerse('1jn', 4, 8))).toBe('1jn-4-8');
  });
});

describe('getCollectionProgress', () => {
  const v1 = makeVerse('rom', 5, 8);
  const v2 = makeVerse('jhn', 3, 16);
  const v3 = makeVerse('1jn', 4, 8);
  const collection = makeCollection([v1, v2, v3]);

  it('returns 0 progress when nothing completed', () => {
    const result = getCollectionProgress(collection, {});
    expect(result).toEqual({ completed: 0, total: 3, percent: 0 });
  });

  it('returns partial progress', () => {
    const completed = { 'rom-5-8': 1, 'jhn-3-16': 2 };
    const result = getCollectionProgress(collection, completed);
    expect(result).toEqual({ completed: 2, total: 3, percent: 67 });
  });

  it('returns 100% when all completed', () => {
    const completed = { 'rom-5-8': 1, 'jhn-3-16': 1, '1jn-4-8': 1 };
    const result = getCollectionProgress(collection, completed);
    expect(result).toEqual({ completed: 3, total: 3, percent: 100 });
  });

  it('returns 0% for empty collection', () => {
    const empty = makeCollection([]);
    const result = getCollectionProgress(empty, {});
    expect(result).toEqual({ completed: 0, total: 0, percent: 0 });
  });

  it('ignores completedVerses with count 0', () => {
    const completed = { 'rom-5-8': 0 };
    const result = getCollectionProgress(collection, completed);
    expect(result.completed).toBe(0);
  });

  it('does not mutate input', () => {
    const completed = { 'rom-5-8': 1 };
    const frozenCompleted = Object.freeze(completed);
    const frozenCollection = Object.freeze({ ...collection, verses: Object.freeze(collection.verses) });
    expect(() => getCollectionProgress(frozenCollection as Collection, frozenCompleted)).not.toThrow();
  });
});

describe('getNextVerseInCollection', () => {
  const v1 = makeVerse('rom', 5, 8);
  const v2 = makeVerse('jhn', 3, 16);
  const v3 = makeVerse('1jn', 4, 8);
  const collection = makeCollection([v1, v2, v3]);

  it('returns first verse when nothing completed', () => {
    expect(getNextVerseInCollection(collection, {})).toEqual(v1);
  });

  it('returns first uncompleted verse', () => {
    const completed = { 'rom-5-8': 1 };
    expect(getNextVerseInCollection(collection, completed)).toEqual(v2);
  });

  it('returns null when all completed', () => {
    const completed = { 'rom-5-8': 1, 'jhn-3-16': 1, '1jn-4-8': 1 };
    expect(getNextVerseInCollection(collection, completed)).toBeNull();
  });

  it('returns null for empty collection', () => {
    const empty = makeCollection([]);
    expect(getNextVerseInCollection(empty, {})).toBeNull();
  });
});
