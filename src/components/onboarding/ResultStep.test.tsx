import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

function renderResult(props: Partial<{
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
  return { ...result, onComplete };
}

describe('ResultStep', () => {
  it('renders summary cards immediately without a loading state', () => {
    renderResult();

    expect(screen.queryByText('맞춤 플랜 생성 중...')).toBeNull();
    expect(screen.getByText(/맞춤 시작점이/)).toBeTruthy();
    expect(screen.getByTestId('result-title').className).toContain('text-2xl');
    expect(screen.getByAltText('완료한 JOY 캐릭터').className).toContain('h-28');
    expect(screen.getByText('현재 수준')).toBeTruthy();
    expect(screen.getByText('관심 말씀')).toBeTruthy();
    expect(screen.getByText('일일 목표')).toBeTruthy();
  });

  it('displays correct level label for easy', () => {
    renderResult({ level: 'easy' });
    expect(screen.getByText(/주일학교 수준/)).toBeTruthy();
  });

  it('displays daily goal value', () => {
    renderResult({ dailyGoal: 5 });
    expect(screen.getByText('하루 5구절')).toBeTruthy();
  });

  it('shows CTA button immediately', () => {
    renderResult();
    expect(screen.getByText('내 맞춤 말씀 시작하기!')).toBeTruthy();
  });

  it('calls onComplete when CTA is clicked', () => {
    const { onComplete } = renderResult();
    fireEvent.click(screen.getByText('내 맞춤 말씀 시작하기!'));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('displays interest book names from bibleIndex', () => {
    renderResult({ interests: ['psa', 'pro'] });
    expect(screen.getByText(/시편/)).toBeTruthy();
    expect(screen.getByText(/잠언/)).toBeTruthy();
  });

  it('falls back to default interests text when empty', () => {
    renderResult({ interests: [] });
    expect(screen.getByText(/시편, 잠언, 창세기/)).toBeTruthy();
  });
});
