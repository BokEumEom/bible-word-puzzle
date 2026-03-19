import { useState, useEffect } from 'react';
import { Verse, OnboardingProfile } from '../types';
import { getLevelForXp } from '../data/levels';
import { calculateXp, XpEvent } from '../utils/xp';
import { ReviewData, updateReview } from '../utils/spaced';

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
  xp: number;
  unlockedAchievements: string[];
  dailyGoalMetCount: number;
  noHintCompletions: number;
  reviewData: Record<string, ReviewData>;
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
  xp: 0,
  unlockedAchievements: [],
  dailyGoalMetCount: 0,
  noHintCompletions: 0,
  reviewData: {},
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

  const addXp = (amount: number) => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const markCompleted = (verse: Verse, options?: { usedHint?: boolean; isReview?: boolean }): XpEvent => {
    const today = new Date().toISOString().split('T')[0];

    // Calculate XP before state update (need current state for isDailyGoalJustMet)
    const isNewDay = progress.todayCompletionDate !== today;
    const newTodayCompletions = isNewDay ? 1 : progress.todayCompletions + 1;
    const willMeetGoal = newTodayCompletions >= progress.dailyGoal;
    const alreadyMetGoal = !isNewDay && progress.todayCompletions >= progress.dailyGoal;

    const xpEvent = calculateXp({
      usedHint: options?.usedHint ?? false,
      isDailyGoalJustMet: willMeetGoal && !alreadyMetGoal,
      streak: progress.streak,
      isReview: options?.isReview ?? (progress.completedVerses[verse.id] > 0),
    });

    const isDailyGoalJustMet = willMeetGoal && !alreadyMetGoal;
    const isNoHint = !(options?.usedHint ?? false);

    setProgress(prev => {
      const prevIsNewDay = prev.todayCompletionDate !== today;
      const success = !(options?.usedHint ?? false);
      const newReviewData = updateReview(prev.reviewData[verse.id], success, today);
      return {
        ...prev,
        completedVerses: {
          ...prev.completedVerses,
          [verse.id]: (prev.completedVerses[verse.id] || 0) + 1,
        },
        todayCompletions: prevIsNewDay ? 1 : prev.todayCompletions + 1,
        todayCompletionDate: today,
        xp: prev.xp + xpEvent.total,
        noHintCompletions: prev.noHintCompletions + (isNoHint ? 1 : 0),
        dailyGoalMetCount: prev.dailyGoalMetCount + (isDailyGoalJustMet ? 1 : 0),
        reviewData: { ...prev.reviewData, [verse.id]: newReviewData },
      };
    });
    updateStreak();
    addRecent(verse);

    return xpEvent;
  };

  const unlockAchievements = (ids: string[]) => {
    setProgress(prev => ({
      ...prev,
      unlockedAchievements: [...prev.unlockedAchievements, ...ids],
    }));
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

  const currentLevel = getLevelForXp(progress.xp);

  return { progress, toggleFavorite, markCompleted, addRecent, addXp, updateStreak, setDailyGoal, saveOnboarding, unlockAchievements, isDailyGoalMet, currentLevel };
}
