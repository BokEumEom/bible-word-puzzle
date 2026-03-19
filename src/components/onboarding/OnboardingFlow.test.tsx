import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingFlow } from './OnboardingFlow';

// Mock motion/react to skip animations in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...filterMotionProps(props)}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

function filterMotionProps(props: any) {
  const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
  return rest;
}

// Mock child components to isolate OnboardingFlow logic
vi.mock('./LevelStep', () => ({
  LevelStep: ({ onSelect }: { onSelect: (level: string) => void }) => (
    <button data-testid="level-step" onClick={() => onSelect('beginner')}>
      Select Level
    </button>
  ),
}));

vi.mock('./MiniPuzzleStep', () => ({
  MiniPuzzleStep: ({ onComplete }: { onComplete: () => void }) => (
    <button data-testid="puzzle-step" onClick={onComplete}>
      Complete Puzzle
    </button>
  ),
}));

vi.mock('./InterestStep', () => ({
  InterestStep: ({ onSelect }: { onSelect: (interests: string[]) => void }) => (
    <button data-testid="interest-step" onClick={() => onSelect(['psa', 'pro'])}>
      Select Interests
    </button>
  ),
}));

vi.mock('./GoalStep', () => ({
  GoalStep: ({ onSelect }: { onSelect: (goal: number) => void }) => (
    <button data-testid="goal-step" onClick={() => onSelect(3)}>
      Select Goal
    </button>
  ),
}));

vi.mock('./ResultStep', () => ({
  ResultStep: ({ onComplete }: { onComplete: () => void }) => (
    <button data-testid="result-step" onClick={onComplete}>
      Complete
    </button>
  ),
}));

describe('OnboardingFlow', () => {
  it('renders LevelStep as the first step', () => {
    render(<OnboardingFlow onComplete={vi.fn()} />);
    expect(screen.getByTestId('level-step')).toBeTruthy();
  });

  it('shows 5 progress dots', () => {
    const { container } = render(<OnboardingFlow onComplete={vi.fn()} />);
    const dots = container.querySelectorAll('.rounded-full');
    expect(dots.length).toBe(5);
  });

  it('does not show close button when onSkip is not provided', () => {
    render(<OnboardingFlow onComplete={vi.fn()} />);
    expect(screen.queryByLabelText('닫기')).toBeNull();
  });

  it('shows close button when onSkip is provided', () => {
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={vi.fn()} />);
    expect(screen.getByLabelText('닫기')).toBeTruthy();
  });

  it('calls onSkip when close button is clicked', () => {
    const onSkip = vi.fn();
    render(<OnboardingFlow onComplete={vi.fn()} onSkip={onSkip} />);
    fireEvent.click(screen.getByLabelText('닫기'));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('advances through all steps to completion', () => {
    const onComplete = vi.fn();
    render(<OnboardingFlow onComplete={onComplete} />);

    fireEvent.click(screen.getByTestId('level-step'));
    fireEvent.click(screen.getByTestId('puzzle-step'));
    fireEvent.click(screen.getByTestId('interest-step'));
    fireEvent.click(screen.getByTestId('goal-step'));
    fireEvent.click(screen.getByTestId('result-step'));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(
      { level: 'beginner', interests: ['psa', 'pro'], onboardingCompleted: true },
      3,
    );
  });
});
