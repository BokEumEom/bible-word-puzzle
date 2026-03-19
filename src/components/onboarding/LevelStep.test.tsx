import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LevelStep } from './LevelStep';

describe('LevelStep', () => {
  it('renders the heading', () => {
    render(<LevelStep onSelect={vi.fn()} />);
    expect(screen.getByText(/성경 말씀을/)).toBeTruthy();
    expect(screen.getByText(/얼마나 접해봤나요/)).toBeTruthy();
  });

  it('renders all 3 level options', () => {
    render(<LevelStep onSelect={vi.fn()} />);
    expect(screen.getByText('이제 막 시작해요')).toBeTruthy();
    expect(screen.getByText('주일학교에서 배웠어요')).toBeTruthy();
    expect(screen.getByText('매일 말씀을 읽어요')).toBeTruthy();
  });

  it('calls onSelect with beginner when first option clicked', () => {
    const onSelect = vi.fn();
    render(<LevelStep onSelect={onSelect} />);
    fireEvent.click(screen.getByText('이제 막 시작해요'));
    expect(onSelect).toHaveBeenCalledWith('beginner');
  });

  it('calls onSelect with easy when second option clicked', () => {
    const onSelect = vi.fn();
    render(<LevelStep onSelect={onSelect} />);
    fireEvent.click(screen.getByText('주일학교에서 배웠어요'));
    expect(onSelect).toHaveBeenCalledWith('easy');
  });

  it('calls onSelect with normal when third option clicked', () => {
    const onSelect = vi.fn();
    render(<LevelStep onSelect={onSelect} />);
    fireEvent.click(screen.getByText('매일 말씀을 읽어요'));
    expect(onSelect).toHaveBeenCalledWith('normal');
  });

  it('displays descriptions for each level', () => {
    render(<LevelStep onSelect={vi.fn()} />);
    expect(screen.getByText('성경이 처음이에요')).toBeTruthy();
    expect(screen.getByText('어느 정도 알고 있어요')).toBeTruthy();
    expect(screen.getByText('성경을 잘 알아요')).toBeTruthy();
  });
});
