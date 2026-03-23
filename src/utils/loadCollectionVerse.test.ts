import { describe, it, expect, vi } from 'vitest';
import { CollectionVerse } from '../data/collections';

vi.mock('../data/bible', () => ({
  loadBookChapters: vi.fn(),
}));

import { loadCollectionVerse } from './loadCollectionVerse';
import { loadBookChapters } from '../data/bible';

const mockLoadBookChapters = vi.mocked(loadBookChapters);

const cv: CollectionVerse = {
  bookId: 'rom',
  chapter: 5,
  verse: 8,
  reference: '로마서 5:8',
  hint: '죄인이었을 때도',
  difficulty: 'easy',
};

const mockChapters = [
  {
    chapter: 5,
    verses: [
      { verse: 7, text: '의인을 위하여 죽는 자가 없고' },
      { verse: 8, text: '우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로' },
    ],
  },
];

describe('loadCollectionVerse', () => {
  it('converts CollectionVerse to Verse', async () => {
    mockLoadBookChapters.mockResolvedValue(mockChapters);

    const result = await loadCollectionVerse(cv);

    expect(result.id).toBe('rom-5-8');
    expect(result.bookId).toBe('rom');
    expect(result.difficulty).toBe('easy');
    expect(result.reference).toBe('로마서 5:8');
    expect(result.hint).toBe('죄인이었을 때도');
    expect(result.verse).toBe('우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로');
    expect(result.words).toEqual([
      '우리가', '아직', '죄인', '되었을', '때에',
      '그리스도께서', '우리를', '위하여', '죽으심으로',
    ]);
  });

  it('throws when chapter not found', async () => {
    mockLoadBookChapters.mockResolvedValue([{ chapter: 1, verses: [] }]);

    await expect(loadCollectionVerse(cv)).rejects.toThrow('Chapter 5 not found in rom');
  });

  it('throws when verse not found', async () => {
    mockLoadBookChapters.mockResolvedValue([
      { chapter: 5, verses: [{ verse: 1, text: 'other' }] },
    ]);

    await expect(loadCollectionVerse(cv)).rejects.toThrow('Verse 8 not found in rom ch.5');
  });
});
