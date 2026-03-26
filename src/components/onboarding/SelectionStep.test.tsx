import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LevelStep } from './LevelStep';
import { GoalStep } from './GoalStep';

describe('SelectionStep styling system', () => {
  it('renders LevelStep with shared selection cards and icon tiles', () => {
    render(<LevelStep onSelect={vi.fn()} />);

    const cards = screen.getAllByTestId('selection-card');
    const tiles = screen.getAllByTestId('selection-icon-tile');

    expect(cards).toHaveLength(3);
    expect(tiles).toHaveLength(3);
    expect(cards[0].className).toContain('bg-white');
    expect(cards[0].className).toContain('rounded-3xl');
    expect(cards[0].className).toContain('border');
    expect(cards[0].className).toContain('shadow-sm');
  });

  it('renders GoalStep with the same shared card shell', () => {
    render(<GoalStep onSelect={vi.fn()} />);

    const cards = screen.getAllByTestId('selection-card');
    const tiles = screen.getAllByTestId('selection-icon-tile');

    expect(cards).toHaveLength(3);
    expect(tiles).toHaveLength(3);
    expect(cards[1].className).toContain('bg-white');
    expect(cards[1].className).toContain('rounded-3xl');
    expect(cards[1].className).toContain('border');
    expect(cards[1].className).toContain('shadow-sm');
  });
});
