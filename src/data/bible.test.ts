import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bibleIndex, loadBookChapters, BookLoadError } from './bible';

describe('bibleIndex', () => {
  it('contains 66 books', () => {
    expect(bibleIndex).toHaveLength(66);
  });

  it('has 39 old testament and 27 new testament books', () => {
    const old = bibleIndex.filter(b => b.testament === 'old');
    const newT = bibleIndex.filter(b => b.testament === 'new');
    expect(old).toHaveLength(39);
    expect(newT).toHaveLength(27);
  });

  it('all books have required fields', () => {
    for (const book of bibleIndex) {
      expect(book.id).toBeTruthy();
      expect(book.name).toBeTruthy();
      expect(book.chapterCount).toBeGreaterThan(0);
      expect(['old', 'new']).toContain(book.testament);
    }
  });

  it('has no duplicate ids', () => {
    const ids = bibleIndex.map(b => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('loadBookChapters', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('throws BookLoadError on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    await expect(loadBookChapters('nonexistent')).rejects.toBeInstanceOf(BookLoadError);

    vi.unstubAllGlobals();
  });

  it('throws BookLoadError on non-ok response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }));

    await expect(loadBookChapters('missing-book')).rejects.toBeInstanceOf(BookLoadError);

    vi.unstubAllGlobals();
  });

  it('fetches, parses, and caches on success', async () => {
    const mockChapters = [{ chapter: 1, verses: [{ verse: 1, text: 'test' }] }];
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockChapters),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await loadBookChapters('test-success-book');
    expect(result).toEqual(mockChapters);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second call should use cache, not fetch again
    const cached = await loadBookChapters('test-success-book');
    expect(cached).toEqual(mockChapters);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });
});
