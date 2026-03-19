import { Verse, Difficulty } from '../types';
import { ReviewData, getDueReviews, getReviewUrgency, ReviewUrgency } from './spaced';

export interface RecommendationInput {
  allVerses: readonly Verse[];
  interests: readonly string[];
  level: Difficulty;
  completedVerses: Readonly<Record<string, number>>;
  dateSeed: number;
  reviewData?: Readonly<Record<string, ReviewData>>;
  today?: string;
}

export interface DailyVerseResult {
  verse: Verse;
  reason: 'interest' | 'uncompleted' | 'fallback';
}

export type NextActionType = 'review' | 'new' | 'challenge';

export interface NextAction {
  type: NextActionType;
  verse: Verse;
  label: string;
  description: string;
  urgency?: ReviewUrgency;
}

export interface RecommendationResult {
  dailyVerse: DailyVerseResult;
  nextActions: NextAction[];
}

const NEXT_DIFFICULTY: Record<string, Difficulty | undefined> = {
  beginner: 'easy',
  easy: 'normal',
  normal: undefined,
};

function pickBySeed<T>(items: readonly T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function getDailyVerse(input: RecommendationInput): DailyVerseResult {
  const { allVerses, interests, completedVerses, dateSeed } = input;
  const interestSet = new Set(interests);

  // 1. Interest-matched + uncompleted
  const interestUncompleted = allVerses.filter(
    v => v.bookId && interestSet.has(v.bookId) && !completedVerses[v.id],
  );
  if (interestUncompleted.length > 0) {
    return { verse: pickBySeed(interestUncompleted, dateSeed), reason: 'interest' };
  }

  // 2. Any uncompleted
  const uncompleted = allVerses.filter(v => !completedVerses[v.id]);
  if (uncompleted.length > 0) {
    return { verse: pickBySeed(uncompleted, dateSeed), reason: 'uncompleted' };
  }

  // 3. Fallback: any verse
  return { verse: pickBySeed(allVerses, dateSeed), reason: 'fallback' };
}

function getNextActions(input: RecommendationInput, dailyVerseId: string): NextAction[] {
  const { allVerses, interests, level, completedVerses, dateSeed, reviewData, today } = input;
  const interestSet = new Set(interests);
  const actions: NextAction[] = [];

  // Review: spaced repetition if reviewData available, else fallback to count-based
  if (reviewData && today) {
    const dueReviews = getDueReviews(reviewData, today);
    if (dueReviews.length > 0) {
      const dueVerse = allVerses.find(v => v.id === dueReviews[0].verseId);
      if (dueVerse) {
        const urgency = getReviewUrgency(dueReviews[0].overdueDays);
        actions.push({
          type: 'review',
          verse: dueVerse,
          label: urgency === 'high' ? '긴급 복습!' : '복습하기',
          description: `${dueVerse.reference} 다시 풀어보세요`,
          urgency,
        });
      }
    }
  } else {
    // Fallback: completed verse with lowest count, prefer interest-matched
    const completedEntries = allVerses
      .filter(v => completedVerses[v.id] > 0)
      .map(v => ({ verse: v, count: completedVerses[v.id], isInterest: !!(v.bookId && interestSet.has(v.bookId)) }))
      .sort((a, b) => {
        if (a.isInterest !== b.isInterest) return a.isInterest ? -1 : 1;
        return a.count - b.count;
      });

    if (completedEntries.length > 0) {
      const reviewVerse = completedEntries[0].verse;
      actions.push({
        type: 'review',
        verse: reviewVerse,
        label: '복습하기',
        description: `${reviewVerse.reference} 다시 풀어보세요`,
      });
    }
  }

  // New: interest-matched uncompleted (different from dailyVerse)
  const newCandidates = allVerses.filter(
    v => v.bookId && interestSet.has(v.bookId) && !completedVerses[v.id] && v.id !== dailyVerseId,
  );
  if (newCandidates.length > 0) {
    const newVerse = pickBySeed(newCandidates, dateSeed + 7);
    actions.push({
      type: 'new',
      verse: newVerse,
      label: '새 말씀',
      description: `${newVerse.reference} 처음 도전!`,
    });
  }

  // Challenge: one level up
  const nextDifficulty = NEXT_DIFFICULTY[level];
  if (nextDifficulty) {
    const challengeCandidates = allVerses.filter(v => v.difficulty === nextDifficulty);
    if (challengeCandidates.length > 0) {
      const challengeVerse = pickBySeed(challengeCandidates, dateSeed + 13);
      actions.push({
        type: 'challenge',
        verse: challengeVerse,
        label: '도전!',
        description: '한 단계 위 말씀에 도전해보세요',
      });
    }
  }

  return actions;
}

export function getRecommendations(input: RecommendationInput): RecommendationResult {
  const dailyVerse = getDailyVerse(input);
  const nextActions = getNextActions(input, dailyVerse.verse.id);
  return { dailyVerse, nextActions };
}
