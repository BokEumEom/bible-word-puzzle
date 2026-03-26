import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileScreen } from './ProfileScreen';
import { achievements } from '../data/achievements';
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

vi.mock('../hooks/useSound', () => ({
  useSound: () => ({
    isMuted: false,
    toggleMute: vi.fn(),
    play: vi.fn(),
  }),
}));

const testProgress: UserProgress = {
  streak: 5,
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
  xp: 120,
  unlockedAchievements: [achievements[0].id],
  dailyGoalMetCount: 2,
  noHintCompletions: 0,
  reviewData: {
    'jhn-3-16': {
      strength: 3,
      lastReviewedAt: '2026-03-20',
      nextReviewAt: '2026-03-26',
    },
  },
};

const testLevel: LevelInfo = {
  level: 2,
  name: '줄기',
  emoji: '🌿',
  minXp: 50,
};

describe('ProfileScreen', () => {
  it('renders a root-tab header and keeps the hero, stats, achievements, review, and settings on the same soft card system', () => {
    render(
      <ProfileScreen
        progress={testProgress}
        level={testLevel}
        onResetOnboarding={vi.fn()}
      />,
    );

    const heroCard = screen.getByTestId('profile-hero-card');
    const statCard = screen.getByTestId('profile-stat-streak');
    const achievementCard = screen.getByTestId(`profile-achievement-${achievements[0].id}`);
    const reviewCard = screen.getByTestId('profile-review-card');
    const settingsCard = screen.getByTestId('profile-settings-card');

    expect(screen.getByText('프로필')).toBeDefined();

    for (const card of [heroCard, statCard, achievementCard, reviewCard, settingsCard]) {
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('border');
      expect(card.className).toContain('shadow-sm');
    }
  });

  it('renders review and settings content inside consistent inset rows', () => {
    render(
      <ProfileScreen
        progress={testProgress}
        level={testLevel}
        onResetOnboarding={vi.fn()}
      />,
    );

    const reviewBreakdown = screen.getByTestId('profile-review-breakdown');
    const soundRow = screen.getByTestId('profile-setting-sound');
    const resetRow = screen.getByTestId('profile-setting-reset');

    for (const row of [reviewBreakdown, soundRow, resetRow]) {
      expect(row.className).toContain('rounded-2xl');
    }

    expect(reviewBreakdown.className).toContain('bg-stone-50');
    expect(soundRow.className).toContain('bg-stone-50');
    expect(resetRow.className).toContain('bg-stone-50');
  });
});
