import { useState, useEffect } from 'react';
import { Verse, OnboardingProfile } from '../types';

export interface UserProgress {
  streak: number;
  lastActiveDate: string;
  recentVerses: Verse[];
  favoriteVerses: Verse[];
  completedVerses: Record<string, number>;
  dailyGoal: number;
  todayCompletions: number;
  todayCompletionDate: string;
  onboarding: OnboardingProfile;
}

const STORAGE_KEY = 'bible_puzzle_progress';

const defaultProgress: UserProgress = {
  streak: 0,
  lastActiveDate: '',
  recentVerses: [],
  favoriteVerses: [],
  completedVerses: {},
  dailyGoal: 3,
  todayCompletions: 0,
  todayCompletionDate: '',
  onboarding: {
    level: 'beginner',
    interests: [],
    onboardingCompleted: false,
  },
};

function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    const parsed = JSON.parse(stored);
    return { ...defaultProgress, ...parsed };
  } catch {
    return defaultProgress;
  }
}

function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage full or unavailable — silently skip
  }
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
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
    const today = new Date().toISOString().split('T')[0];
    setProgress(prev => {
      const isNewDay = prev.todayCompletionDate !== today;
      return {
        ...prev,
        completedVerses: {
          ...prev.completedVerses,
          [verse.id]: (prev.completedVerses[verse.id] || 0) + 1,
        },
        todayCompletions: isNewDay ? 1 : prev.todayCompletions + 1,
        todayCompletionDate: today,
      };
    });
    updateStreak();
    addRecent(verse);
  };

  const setDailyGoal = (goal: number) => {
    setProgress(prev => ({ ...prev, dailyGoal: goal }));
  };

  const saveOnboarding = (profile: OnboardingProfile) => {
    setProgress(prev => ({
      ...prev,
      dailyGoal: profile.onboardingCompleted ? prev.dailyGoal : prev.dailyGoal,
      onboarding: profile,
    }));
  };

  const today = new Date().toISOString().split('T')[0];
  const isDailyGoalMet = progress.todayCompletionDate === today
    && progress.todayCompletions >= progress.dailyGoal;

  return { progress, toggleFavorite, markCompleted, addRecent, updateStreak, setDailyGoal, saveOnboarding, isDailyGoalMet };
}
