import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IntroStep } from './IntroStep';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...filterMotionProps(props)}>{children}</button>,
    h1: ({ children, ...props }: any) => <h1 {...filterMotionProps(props)}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...filterMotionProps(props)}>{children}</p>,
  },
}));

function filterMotionProps(props: any) {
  const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
  return rest;
}

describe('IntroStep', () => {
  it('renders a standalone character hero with a fixed bottom CTA shell', () => {
    render(<IntroStep onStart={vi.fn()} />);

    expect(screen.getByAltText('JOY 캐릭터')).toBeTruthy();

    const hero = screen.getByTestId('intro-hero');
    const ctaShell = screen.getByTestId('intro-fixed-cta');

    expect(hero.className).toContain('mx-auto');
    expect(ctaShell.className).toContain('fixed');
    expect(ctaShell.className).toContain('bottom-0');
  });

  it('keeps the intro copy minimal without feature cards', () => {
    render(<IntroStep onStart={vi.fn()} />);

    expect(screen.queryByText('퍼즐로 익히기')).toBeNull();
    expect(screen.queryByText('맞춤 말씀 추천')).toBeNull();
  });
});
