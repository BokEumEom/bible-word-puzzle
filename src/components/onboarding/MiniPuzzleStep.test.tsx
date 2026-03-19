import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MiniPuzzleStep } from './MiniPuzzleStep';

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
    p: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock shuffle to return predictable order
vi.mock('../../utils/shuffle', () => ({
  shuffle: <T,>(arr: T[]): T[] => [...arr],
}));

function clickWordButton(word: string) {
  const elements = screen.getAllByText(word);
  const button = elements.find(el => el.tagName === 'BUTTON');
  if (button) {
    fireEvent.click(button);
  }
}

describe('MiniPuzzleStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the heading', () => {
    render(<MiniPuzzleStep onComplete={vi.fn()} />);
    expect(screen.getByText(/말씀을 순서대로/)).toBeTruthy();
  });

  it('renders the verse reference', () => {
    render(<MiniPuzzleStep onComplete={vi.fn()} />);
    expect(screen.getByText('데살로니가전서 5:17')).toBeTruthy();
  });

  it('renders all 3 words', () => {
    render(<MiniPuzzleStep onComplete={vi.fn()} />);
    expect(screen.getAllByText('쉬지').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('말고').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('기도하라').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onComplete after correct sequence with delay', () => {
    const onComplete = vi.fn();
    render(<MiniPuzzleStep onComplete={onComplete} />);

    // With shuffle mocked to identity, bank order matches correct order
    clickWordButton('쉬지');
    clickWordButton('말고');
    clickWordButton('기도하라');

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('shows success overlay after correct answer', () => {
    render(<MiniPuzzleStep onComplete={vi.fn()} />);

    clickWordButton('쉬지');
    clickWordButton('말고');
    clickWordButton('기도하라');

    expect(screen.getByText('이렇게 쉬워요!')).toBeTruthy();
  });

  it('resets on wrong answer after delay', () => {
    render(<MiniPuzzleStep onComplete={vi.fn()} />);

    clickWordButton('기도하라');
    clickWordButton('쉬지');
    clickWordButton('말고');

    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Words should be available again
    expect(screen.getAllByText('쉬지').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('말고').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('기도하라').length).toBeGreaterThanOrEqual(1);
  });
});
