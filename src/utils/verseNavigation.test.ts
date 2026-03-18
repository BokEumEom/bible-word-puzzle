import { describe, it, expect } from 'vitest';
import { parseVerseId, getNextVerse } from './verseNavigation';
import { BibleChapter } from '../types';

describe('parseVerseId', () => {
  it('parses standard verse id', () => {
    expect(parseVerseId('gen-1-3')).toEqual({ bookId: 'gen', chapter: 1, verse: 3 });
  });

  it('parses multi-segment book id', () => {
    expect(parseVerseId('1sa-2-5')).toEqual({ bookId: '1sa', chapter: 2, verse: 5 });
  });

  it('returns null for invalid format', () => {
    expect(parseVerseId('gen')).toBeNull();
    expect(parseVerseId('gen-1')).toBeNull();
    expect(parseVerseId('')).toBeNull();
  });

  it('returns null for non-numeric chapter/verse', () => {
    expect(parseVerseId('gen-abc-1')).toBeNull();
    expect(parseVerseId('gen-1-abc')).toBeNull();
  });
});

describe('getNextVerse', () => {
  const chapters: BibleChapter[] = [
    {
      chapter: 1,
      verses: [
        { verse: 1, text: '태초에 하나님이 천지를 창조하시니라' },
        { verse: 2, text: '땅이 혼돈하고 공허하며' },
        { verse: 3, text: '하나님이 이르시되 빛이 있으라' },
      ],
    },
    {
      chapter: 2,
      verses: [
        { verse: 1, text: '천지와 만물이 다 이루어지니라' },
        { verse: 2, text: '하나님이 그가 하시던 일을 일곱째 날에 마치시니' },
      ],
    },
  ];

  it('returns next verse in same chapter', () => {
    const next = getNextVerse('gen-1-1', chapters);
    expect(next).not.toBeNull();
    expect(next!.id).toBe('gen-1-2');
    expect(next!.verse).toBe('땅이 혼돈하고 공허하며');
    expect(next!.words).toEqual(['땅이', '혼돈하고', '공허하며']);
  });

  it('returns first verse of next chapter at end of chapter', () => {
    const next = getNextVerse('gen-1-3', chapters);
    expect(next).not.toBeNull();
    expect(next!.id).toBe('gen-2-1');
    expect(next!.reference).toContain('2:1');
  });

  it('returns null at end of book', () => {
    const next = getNextVerse('gen-2-2', chapters);
    expect(next).toBeNull();
  });

  it('returns null for invalid verse id', () => {
    expect(getNextVerse('invalid', chapters)).toBeNull();
  });

  it('returns null for non-existent chapter', () => {
    expect(getNextVerse('gen-99-1', chapters)).toBeNull();
  });

  it('returns null for non-existent verse', () => {
    expect(getNextVerse('gen-1-99', chapters)).toBeNull();
  });

  it('includes correct reference with book name', () => {
    const next = getNextVerse('gen-1-1', chapters);
    expect(next!.reference).toBe('창세기 1:2');
  });
});
