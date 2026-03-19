import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ResultStep } from './ResultStep';

// Mock motion/react to skip animations
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
    h2: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return <h2 {...rest}>{children}</h2>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

function renderAndFinishLoading(props: Partial<{
  level: 'beginner' | 'easy' | 'normal';
  interests: string[];
  dailyGoal: number;
  onComplete: () => void;
}> = {}) {
  const onComplete = props.onComplete ?? vi.fn();
  const result = render(
    <ResultStep
      level={props.level ?? 'beginner'}
      interests={props.interests ?? []}
      dailyGoal={props.dailyGoal ?? 3}
      onComplete={onComplete}
    />,
  );
  // Advance past the 2500ms fake loading
  act(() => {
    vi.advanceTimersByTime(3000);
  });
  return { ...result, onComplete };
}

describe('ResultStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows loading state initially', () => {
    render(
      <ResultStep level="beginner" interests={['psa']} dailyGoal={3} onComplete={vi.fn()} />,
    );
    expect(screen.getByText('맞춤 플랜 생성 중...')).toBeTruthy();
  });

  it('shows progress messages during loading', () => {
    render(
      <ResultStep level="beginner" interests={['psa']} dailyGoal={3} onComplete={vi.fn()} />,
    );
    expect(screen.getByText('성경 데이터 분석 중...')).toBeTruthy();
  });

  it('shows result cards after loading completes', () => {
    renderAndFinishLoading();
    expect(screen.getByText('당신의 수준')).toBeTruthy();
    expect(screen.getByText('관심 성경')).toBeTruthy();
    expect(screen.getByText('일일 목표')).toBeTruthy();
  });

  it('displays correct level label for easy', () => {
    renderAndFinishLoading({ level: 'easy' });
    expect(screen.getByText(/주일학교 수준/)).toBeTruthy();
  });

  it('displays daily goal value', () => {
    renderAndFinishLoading({ dailyGoal: 5 });
    expect(screen.getByText('하루 5구절')).toBeTruthy();
  });

  it('shows CTA button after loading', () => {
    renderAndFinishLoading();
    expect(screen.getByText('내 맞춤 말씀 시작하기!')).toBeTruthy();
  });

  it('calls onComplete when CTA is clicked', () => {
    const { onComplete } = renderAndFinishLoading();
    fireEvent.click(screen.getByText('내 맞춤 말씀 시작하기!'));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('displays interest book names from bibleIndex', () => {
    renderAndFinishLoading({ interests: ['psa', 'pro'] });
    expect(screen.getByText(/시편/)).toBeTruthy();
    expect(screen.getByText(/잠언/)).toBeTruthy();
  });

  it('falls back to default interests text when empty', () => {
    renderAndFinishLoading({ interests: [] });
    expect(screen.getByText(/시편, 잠언, 창세기/)).toBeTruthy();
  });
});
