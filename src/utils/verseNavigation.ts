import { BibleChapter, Verse } from '../types';
import { bibleIndex } from '../data/bible';

export interface ParsedVerseId {
  bookId: string;
  chapter: number;
  verse: number;
}

export function parseVerseId(id: string): ParsedVerseId | null {
  const parts = id.split('-');
  if (parts.length < 3) return null;
  const verse = parseInt(parts[parts.length - 1], 10);
  const chapter = parseInt(parts[parts.length - 2], 10);
  const bookId = parts.slice(0, parts.length - 2).join('-');
  if (isNaN(chapter) || isNaN(verse) || !bookId) return null;
  return { bookId, chapter, verse };
}

function toVerse(bookId: string, chapter: number, verseNum: number, text: string): Verse {
  const book = bibleIndex.find(b => b.id === bookId);
  const bookName = book?.name ?? bookId;
  return {
    id: `${bookId}-${chapter}-${verseNum}`,
    reference: `${bookName} ${chapter}:${verseNum}`,
    verse: text,
    words: text.split(/\s+/),
  };
}

export function getNextVerse(
  currentVerseId: string,
  chapters: BibleChapter[]
): Verse | null {
  const parsed = parseVerseId(currentVerseId);
  if (!parsed) return null;

  const { bookId, chapter, verse } = parsed;
  const currentChapter = chapters.find(c => c.chapter === chapter);
  if (!currentChapter) return null;

  const currentVerseIndex = currentChapter.verses.findIndex(v => v.verse === verse);
  if (currentVerseIndex === -1) return null;

  // Next verse in same chapter
  if (currentVerseIndex < currentChapter.verses.length - 1) {
    const next = currentChapter.verses[currentVerseIndex + 1];
    return toVerse(bookId, chapter, next.verse, next.text);
  }

  // First verse of next chapter
  const nextChapter = chapters.find(c => c.chapter === chapter + 1);
  if (nextChapter && nextChapter.verses.length > 0) {
    const first = nextChapter.verses[0];
    return toVerse(bookId, nextChapter.chapter, first.verse, first.text);
  }

  // End of book
  return null;
}
