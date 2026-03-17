import { useState, useEffect } from 'react';
import { Verse } from '../types';

export interface UserProgress {
  streak: number;
  lastActiveDate: string;
  recentVerses: Verse[];
  favoriteVerses: Verse[];
  completedVerses: Record<string, number>;
}

const STORAGE_KEY = 'bible_puzzle_progress';

const defaultProgress: UserProgress = {
  streak: 0,
  lastActiveDate: '',
  recentVerses: [],
  favoriteVerses: [],
  completedVerses: {}
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    setProgress(prev => {
      if (prev.lastActiveDate === today) return prev;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (prev.lastActiveDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      return { ...prev, streak: newStreak, lastActiveDate: today };
    });
  };

  const addRecent = (verse: Verse) => {
    setProgress(prev => {
      const filtered = prev.recentVerses.filter(v => v.id !== verse.id);
      return { ...prev, recentVerses: [verse, ...filtered].slice(0, 10) };
    });
  };

  const toggleFavorite = (verse: Verse) => {
    setProgress(prev => {
      const isFav = prev.favoriteVerses.some(v => v.id === verse.id);
      if (isFav) {
        return { ...prev, favoriteVerses: prev.favoriteVerses.filter(v => v.id !== verse.id) };
      } else {
        return { ...prev, favoriteVerses: [verse, ...prev.favoriteVerses] };
      }
    });
  };

  const markCompleted = (verse: Verse) => {
    setProgress(prev => ({
      ...prev,
      completedVerses: {
        ...prev.completedVerses,
        [verse.id]: (prev.completedVerses[verse.id] || 0) + 1
      }
    }));
    updateStreak();
    addRecent(verse);
  };

  return { progress, toggleFavorite, markCompleted, addRecent, updateStreak };
}
