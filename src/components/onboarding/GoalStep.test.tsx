import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalStep } from './GoalStep';

describe('GoalStep', () => {
  it('renders the heading', () => {
    render(<GoalStep onSelect={vi.fn()} />);
    expect(screen.getByText(/하루에 몇 구절/)).toBeTruthy();
    expect(screen.getByText(/배울까요/)).toBeTruthy();
  });

  it('renders all 3 goal options', () => {
    render(<GoalStep onSelect={vi.fn()} />);
    expect(screen.getByText('1구절')).toBeTruthy();
    expect(screen.getByText('3구절')).toBeTruthy();
    expect(screen.getByText('5구절')).toBeTruthy();
  });

  it('shows recommended badge on 3구절', () => {
    render(<GoalStep onSelect={vi.fn()} />);
    expect(screen.getByText('추천')).toBeTruthy();
  });

  it('calls onSelect with 1 when first option clicked', () => {
    const onSelect = vi.fn();
    render(<GoalStep onSelect={onSelect} />);
    fireEvent.click(screen.getByText('1구절'));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('calls onSelect with 3 when second option clicked', () => {
    const onSelect = vi.fn();
    render(<GoalStep onSelect={onSelect} />);
    fireEvent.click(screen.getByText('3구절'));
    expect(onSelect).toHaveBeenCalledWith(3);
  });

  it('calls onSelect with 5 when third option clicked', () => {
    const onSelect = vi.fn();
    render(<GoalStep onSelect={onSelect} />);
    fireEvent.click(screen.getByText('5구절'));
    expect(onSelect).toHaveBeenCalledWith(5);
  });

  it('displays descriptions for each goal', () => {
    render(<GoalStep onSelect={vi.fn()} />);
    expect(screen.getByText('가볍게')).toBeTruthy();
    expect(screen.getByText('꾸준히')).toBeTruthy();
    expect(screen.getByText('도전!')).toBeTruthy();
  });
});
