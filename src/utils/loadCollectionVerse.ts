import { Verse } from '../types';
import { CollectionVerse } from '../data/collections';
import { loadBookChapters } from '../data/bible';
import { toVerseId } from './collectionProgress';

/**
 * Loads a CollectionVerse from the Bible JSON and converts it to a playable Verse.
 * Bible JSON uses 1-based chapter numbers in BibleChapter[].
 */
export async function loadCollectionVerse(cv: CollectionVerse): Promise<Verse> {
  const chapters = await loadBookChapters(cv.bookId);
  const chapter = chapters.find(c => c.chapter === cv.chapter);
  if (!chapter) {
    throw new Error(`Chapter ${cv.chapter} not found in ${cv.bookId}`);
  }

  const bibleVerse = chapter.verses.find(v => v.verse === cv.verse);
  if (!bibleVerse) {
    throw new Error(`Verse ${cv.verse} not found in ${cv.bookId} ch.${cv.chapter}`);
  }

  const text = bibleVerse.text;
  const words = text.split(/\s+/).filter(w => w.length > 0);

  return {
    id: toVerseId(cv),
    bookId: cv.bookId,
    difficulty: cv.difficulty,
    reference: cv.reference,
    verse: text,
    words,
    hint: cv.hint,
  };
}
