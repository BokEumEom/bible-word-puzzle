import { Collection, CollectionVerse } from '../data/collections';

export interface CollectionProgress {
  readonly completed: number;
  readonly total: number;
  readonly percent: number;
}

export function getCollectionProgress(
  collection: Collection,
  completedVerses: Readonly<Record<string, number>>,
): CollectionProgress {
  const total = collection.verses.length;
  const completed = collection.verses.filter(
    v => (completedVerses[toVerseId(v)] ?? 0) > 0
  ).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}


export function getNextVerseInCollection(
  collection: Collection,
  completedVerses: Readonly<Record<string, number>>,
): CollectionVerse | null {
  return collection.verses.find(
    v => (completedVerses[toVerseId(v)] ?? 0) === 0
  ) ?? null;
}

export function toVerseId(cv: CollectionVerse): string {
  return `${cv.bookId}-${cv.chapter}-${cv.verse}`;
}
