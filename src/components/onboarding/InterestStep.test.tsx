import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InterestStep } from './InterestStep';

describe('InterestStep', () => {
  describe('beginner level', () => {
    it('shows auto-selected message for beginners', () => {
      render(<InterestStep level="beginner" onSelect={vi.fn()} />);
      expect(screen.getByText(/시편, 잠언, 창세기로/)).toBeTruthy();
    });

    it('shows "좋아요!" button for beginners', () => {
      render(<InterestStep level="beginner" onSelect={vi.fn()} />);
      expect(screen.getByText('좋아요!')).toBeTruthy();
    });

    it('calls onSelect with defaults when beginner clicks "좋아요!"', () => {
      const onSelect = vi.fn();
      render(<InterestStep level="beginner" onSelect={onSelect} />);
      fireEvent.click(screen.getByText('좋아요!'));
      expect(onSelect).toHaveBeenCalledWith(['psa', 'pro', 'gen']);
    });
  });

  describe('easy level', () => {
    it('shows preset cards for easy level', () => {
      render(<InterestStep level="easy" onSelect={vi.fn()} />);
      expect(screen.getByText('시편/잠언')).toBeTruthy();
      expect(screen.getByText('복음서')).toBeTruthy();
      expect(screen.getByText('창세기부터')).toBeTruthy();
      expect(screen.getByText('바울서신')).toBeTruthy();
    });

    it('does not show grid toggle for easy level', () => {
      render(<InterestStep level="easy" onSelect={vi.fn()} />);
      expect(screen.queryByText('직접 고를래요')).toBeNull();
    });

    it('next button starts disabled and enables after selecting preset', () => {
      render(<InterestStep level="easy" onSelect={vi.fn()} />);
      const nextBtn = screen.getByText('다음');

      // Check initial class contains disabled style
      expect(nextBtn.className).toContain('cursor-not-allowed');

      fireEvent.click(screen.getByText('시편/잠언'));
      expect(nextBtn.className).not.toContain('cursor-not-allowed');
    });

    it('calls onSelect with selected book ids', () => {
      const onSelect = vi.fn();
      render(<InterestStep level="easy" onSelect={onSelect} />);

      fireEvent.click(screen.getByText('시편/잠언'));
      fireEvent.click(screen.getByText('다음'));

      expect(onSelect).toHaveBeenCalledTimes(1);
      const selected = onSelect.mock.calls[0][0];
      expect(selected).toContain('psa');
      expect(selected).toContain('pro');
    });

    it('toggles preset off when clicked again', () => {
      render(<InterestStep level="easy" onSelect={vi.fn()} />);

      fireEvent.click(screen.getByText('시편/잠언'));
      const nextBtn = screen.getByText('다음');
      expect(nextBtn.className).not.toContain('cursor-not-allowed');

      fireEvent.click(screen.getByText('시편/잠언'));
      expect(nextBtn.className).toContain('cursor-not-allowed');
    });
  });

  describe('normal level', () => {
    it('shows preset cards and grid toggle', () => {
      render(<InterestStep level="normal" onSelect={vi.fn()} />);
      expect(screen.getByText('시편/잠언')).toBeTruthy();
      expect(screen.getByText('직접 고를래요')).toBeTruthy();
    });

    it('shows abbreviation grid when toggle clicked', () => {
      render(<InterestStep level="normal" onSelect={vi.fn()} />);
      fireEvent.click(screen.getByText('직접 고를래요'));
      expect(screen.getByText('구약')).toBeTruthy();
      expect(screen.getByText('신약')).toBeTruthy();
    });

    it('can select multiple presets', () => {
      const onSelect = vi.fn();
      render(<InterestStep level="normal" onSelect={onSelect} />);

      fireEvent.click(screen.getByText('시편/잠언'));
      fireEvent.click(screen.getByText('복음서'));
      fireEvent.click(screen.getByText('다음'));

      const selected = onSelect.mock.calls[0][0];
      expect(selected).toContain('psa');
      expect(selected).toContain('pro');
      expect(selected).toContain('mat');
      expect(selected).toContain('luk');
    });
  });
});
