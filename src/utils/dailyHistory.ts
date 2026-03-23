export interface DailyStats {
  readonly completions: number;
  readonly goalMet: boolean;
  readonly xpEarned: number;
}

export type DailyHistory = Readonly<Record<string, DailyStats>>;

/**
 * Returns 7 ISO date strings (Mon→Sun) for the week containing the given date.
 */
export function getWeekDates(referenceDate: Date = new Date()): string[] {
  const d = new Date(referenceDate);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + mondayOffset);

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export interface WeeklyStats {
  readonly dates: string[];
  readonly dailyCompletions: number[];
  readonly totalCompletions: number;
  readonly totalXp: number;
  readonly daysGoalMet: number;
  readonly daysActive: number;
}

export function getWeeklyStats(
  history: DailyHistory,
  referenceDate: Date = new Date(),
): WeeklyStats {
  const dates = getWeekDates(referenceDate);
  const dailyCompletions = dates.map(d => history[d]?.completions ?? 0);
  const totalCompletions = dailyCompletions.reduce((a, b) => a + b, 0);
  const totalXp = dates.reduce((sum, d) => sum + (history[d]?.xpEarned ?? 0), 0);
  const daysGoalMet = dates.filter(d => history[d]?.goalMet).length;
  const daysActive = dates.filter(d => (history[d]?.completions ?? 0) > 0).length;

  return { dates, dailyCompletions, totalCompletions, totalXp, daysGoalMet, daysActive };
}

export function getMotivationalMessage(daysActive: number): string {
  if (daysActive === 0) return '이번 주를 시작해 보세요!';
  if (daysActive <= 3) return '좋은 시작이에요! 계속 해보세요';
  if (daysActive <= 5) return '정말 잘하고 있어요!';
  return '완벽한 한 주! 대단해요!';
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const;
export { DAY_LABELS };
