export interface ReviewData {
  readonly strength: number;
  readonly lastReviewedAt: string;
  readonly nextReviewAt: string;
}

export type ReviewMap = Readonly<Record<string, ReviewData>>;

// Days until next review for each strength level
const INTERVALS: readonly number[] = [0, 1, 3, 7, 14, 30];

function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().split('T')[0];
}

function dateDiff(a: string, b: string): number {
  const msPerDay = 86400000;
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const dateA = Date.UTC(ay, am - 1, ad);
  const dateB = Date.UTC(by, bm - 1, bd);
  return Math.round((dateA - dateB) / msPerDay);
}

export function updateReview(
  current: ReviewData | undefined,
  success: boolean,
  today: string,
): ReviewData {
  if (!current) {
    // First completion
    return {
      strength: 1,
      lastReviewedAt: today,
      nextReviewAt: addDays(today, INTERVALS[1]),
    };
  }

  if (success) {
    const newStrength = Math.min(current.strength + 1, 5);
    return {
      strength: newStrength,
      lastReviewedAt: today,
      nextReviewAt: addDays(today, INTERVALS[newStrength]),
    };
  }

  // Failed — reset to strength 1
  return {
    strength: 1,
    lastReviewedAt: today,
    nextReviewAt: addDays(today, INTERVALS[1]),
  };
}

export interface DueReview {
  readonly verseId: string;
  readonly data: ReviewData;
  readonly overdueDays: number;
}

export function getDueReviews(reviewMap: ReviewMap, today: string): DueReview[] {
  const due: DueReview[] = [];

  for (const [verseId, data] of Object.entries(reviewMap)) {
    const overdueDays = dateDiff(today, data.nextReviewAt);
    if (overdueDays >= 0) {
      due.push({ verseId, data, overdueDays });
    }
  }

  return due.sort((a, b) => b.overdueDays - a.overdueDays);
}

export type ReviewUrgency = 'low' | 'medium' | 'high';

export function getReviewUrgency(overdueDays: number): ReviewUrgency {
  if (overdueDays >= 4) return 'high';
  if (overdueDays >= 2) return 'medium';
  return 'low';
}
