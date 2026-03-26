import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import type { UserProgress } from '../hooks/useUserProgress';
import type { LevelInfo } from '../data/levels';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
  },
}));

vi.mock('./InstallPrompt', () => ({
  InstallPrompt: () => null,
}));

vi.mock('../utils/recommend', () => ({
  getRecommendations: () => ({
    dailyVerse: {
      verse: {
        id: 'jhn-3-16',
        reference: '요한복음 3:16',
        verse: '하나님이 세상을 이처럼 사랑하사',
        difficulty: 'beginner',
        bookId: 'jhn',
        chapter: 3,
      },
      reason: 'daily',
    },
    nextActions: [],
  }),
}));

vi.mock('../utils/spaced', () => ({
  getDueReviews: () => [],
}));

const testProgress: UserProgress = {
  streak: 3,
  lastActiveDate: '2026-03-26',
  recentVerses: [],
  favoriteVerses: [],
  completedVerses: {},
  dailyGoal: 3,
  todayCompletions: 1,
  todayCompletionDate: '2026-03-26',
  onboarding: {
    level: 'beginner',
    interests: [],
    onboardingCompleted: true,
  },
  xp: 40,
  unlockedAchievements: [],
  dailyGoalMetCount: 1,
  noHintCompletions: 0,
  reviewData: {},
};

const testLevel: LevelInfo = {
  level: 1,
  name: '새싹',
  emoji: '🌱',
  minXp: 0,
};

describe('Dashboard', () => {
  it('renders home cards with the same soft white card language as the install prompt section', () => {
    render(
      <Dashboard
        progress={testProgress}
        isDailyGoalMet={false}
        currentLevel={testLevel}
        onStartPreset={vi.fn()}
        onSelectVerse={vi.fn()}
      />,
    );

    const companionCard = screen.getByTestId('dashboard-companion-card');
    const featuredCard = screen.getByTestId('dashboard-featured-card');
    const primaryQuickAction = screen.getByTestId('dashboard-quick-action-primary');
    const recentEmptyState = screen.getByTestId('dashboard-recent-empty');
    const primaryIconTile = screen.getByTestId('dashboard-quick-action-primary-icon');

    for (const card of [companionCard, featuredCard, primaryQuickAction, recentEmptyState]) {
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('rounded-3xl');
      expect(card.className).toContain('shadow-sm');
    }

    expect(primaryQuickAction.className).toContain('border');
    expect(recentEmptyState.className).toContain('border');
    expect(primaryIconTile.className).toContain('rounded-xl');
    expect(primaryIconTile.className).toContain('bg-violet-100');
  });
});
