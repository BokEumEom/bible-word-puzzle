export interface XpEvent {
  base: number;
  noHintBonus: number;
  dailyGoalBonus: number;
  streakBonus: number;
  total: number;
}

interface XpInput {
  usedHint: boolean;
  isDailyGoalJustMet: boolean;
  streak: number;
  isReview: boolean;
}

export function calculateXp(input: XpInput): XpEvent {
  const base = input.isReview ? 5 : 10;
  const noHintBonus = (!input.isReview && !input.usedHint) ? 5 : 0;
  const dailyGoalBonus = input.isDailyGoalJustMet ? 15 : 0;
  const streakBonus = input.streak > 1 ? input.streak * 2 : 0;

  return {
    base,
    noHintBonus,
    dailyGoalBonus,
    streakBonus,
    total: base + noHintBonus + dailyGoalBonus + streakBonus,
  };
}
