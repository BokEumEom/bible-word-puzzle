export interface LevelInfo {
  level: number;
  name: string;
  emoji: string;
  minXp: number;
}

export const levels: LevelInfo[] = [
  { level: 1, name: '새싹', emoji: '🌱', minXp: 0 },
  { level: 2, name: '줄기', emoji: '🌿', minXp: 50 },
  { level: 3, name: '나무', emoji: '🌳', minXp: 150 },
  { level: 4, name: '열매', emoji: '🍎', minXp: 300 },
  { level: 5, name: '빛', emoji: '✨', minXp: 500 },
];

export function getLevelForXp(xp: number): LevelInfo {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) return levels[i];
  }
  return levels[0];
}

export function getNextLevel(currentLevel: number): LevelInfo | null {
  const next = levels.find(l => l.level === currentLevel + 1);
  return next ?? null;
}

export function getXpProgress(xp: number): { current: number; next: number; progress: number } {
  const currentLevel = getLevelForXp(xp);
  const nextLevel = getNextLevel(currentLevel.level);

  if (!nextLevel) {
    return { current: xp, next: xp, progress: 1 };
  }

  const xpInLevel = xp - currentLevel.minXp;
  const xpNeeded = nextLevel.minXp - currentLevel.minXp;
  return { current: xpInLevel, next: xpNeeded, progress: xpInLevel / xpNeeded };
}
