import { Collection, CollectionVerse, collections } from '../data/collections';

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

export function isCollectionUnlocked(
  collection: Collection,
  completedVerses: Readonly<Record<string, number>>,
): boolean {
  if (!collection.unlockRequirement) return true;
  const reqCollection = collections.find(c => c.id === collection.unlockRequirement!.collectionId);
  if (!reqCollection) return true;
  const progress = getCollectionProgress(reqCollection, completedVerses);
  return progress.percent >= collection.unlockRequirement.percent;
}

export function getActiveCollection(
  completedVerses: Readonly<Record<string, number>>,
): Collection | null {
  // Find first collection that isn't fully completed
  for (const collection of collections) {
    const progress = getCollectionProgress(collection, completedVerses);
    if (progress.percent < 100) return collection;
  }
  return null;
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
